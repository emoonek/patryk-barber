import type { LoginInput, RegisterInput } from "./auth.schemas";

export async function registerUser(_input: RegisterInput) {
  throw new Error("Rejestracja zostanie zaimplementowana w ETAPIE 3.");
}

export async function loginUser(_input: LoginInput) {
  throw new Error("Logowanie zostanie zaimplementowane w ETAPIE 3.");
}

export async function logoutUser() {
  throw new Error("Wylogowanie zostanie zaimplementowane w ETAPIE 3.");
}
