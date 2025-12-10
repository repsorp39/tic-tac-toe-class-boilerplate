import z from "zod";

export function isValidEmail(email) {
  return !z.email().safeParse(email).error;
}

export function isStrongPassword(password) {
  return !z
    .string()
    .min(8)
    .max(15)
    .regex(/[A-Za-z]+/)
    .regex(/[0-9]+/)
    .safeParse(password).error;
}

export function isValidPseudo(pseudo) {
  return !z
    .string()
    .min(4)
    .max(12)
    .regex(/[A-Za-z0-9\s]+/)
    .safeParse(pseudo).error;
}

export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
};