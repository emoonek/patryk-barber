import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/db/prisma";
import type { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from "./auth.schemas";
import { createSession, destroySession } from "./session";
import { createFutureDate, generateToken, hashToken } from "./auth.tokens";

function appUrl() {
  return process.env.APP_URL ?? "http://localhost:3000";
}

function passwordWithPepper(password: string) {
  return `${password}${process.env.PASSWORD_PEPPER ?? ""}`;
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new Error("Konto z tym adresem email już istnieje.");
  }

  const passwordHash = await bcrypt.hash(passwordWithPepper(input.password), 12);
  const token = generateToken();

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      role: UserRole.customer,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone || null,
      emailVerifiedAt: null,
      emailTokens: {
        create: {
          tokenHash: hashToken(token),
          expiresAt: createFutureDate(60 * 24),
        },
      },
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  await sendVerificationEmail({
    to: user.email,
    verificationUrl: `${appUrl()}/weryfikacja-email/${token}`,
  });
  await createSession(user);

  return user;
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findFirst({
    where: {
      email: input.email,
      deletedAt: null,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error("Nieprawidłowy email lub hasło.");
  }

  const passwordMatches = await bcrypt.compare(passwordWithPepper(input.password), user.passwordHash);

  if (!passwordMatches) {
    throw new Error("Nieprawidłowy email lub hasło.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await createSession(user);

  return user;
}

export async function logoutUser() {
  await destroySession();
}

export async function verifyEmailToken(token: string) {
  const tokenHash = hashToken(token);
  const now = new Date();

  const storedToken = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
  });

  if (!storedToken || storedToken.usedAt || storedToken.expiresAt < now) {
    throw new Error("Link weryfikacyjny jest nieprawidłowy albo wygasł.");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: storedToken.userId },
      data: { emailVerifiedAt: now },
    }),
    prisma.emailVerificationToken.update({
      where: { id: storedToken.id },
      data: { usedAt: now },
    }),
  ]);
}

export async function requestPasswordReset(input: ForgotPasswordInput) {
  const user = await prisma.user.findFirst({
    where: {
      email: input.email,
      deletedAt: null,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    return;
  }

  const token = generateToken();

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: createFutureDate(60),
    },
  });

  await sendPasswordResetEmail({
    to: user.email,
    resetUrl: `${appUrl()}/reset-hasla/${token}`,
  });
}

export async function resetPassword(input: ResetPasswordInput) {
  const tokenHash = hashToken(input.token);
  const now = new Date();

  const storedToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!storedToken || storedToken.usedAt || storedToken.expiresAt < now) {
    throw new Error("Link resetu hasła jest nieprawidłowy albo wygasł.");
  }

  const passwordHash = await bcrypt.hash(passwordWithPepper(input.password), 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: storedToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: storedToken.id },
      data: { usedAt: now },
    }),
  ]);
}
