import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "expoia-admin";

function getAdminToken() {
  const password = process.env.ADMIN_PANEL_PASSWORD;
  if (!password) {
    throw new Error("Falta configurar ADMIN_PANEL_PASSWORD");
  }

  return createHmac("sha256", password).update("expoia-admin-session").digest("hex");
}

export async function tieneSesionAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return false;

  const expected = getAdminToken();
  const providedBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export function validarPasswordAdmin(password: string) {
  const configuredPassword = process.env.ADMIN_PANEL_PASSWORD;
  if (!configuredPassword) {
    throw new Error("Falta configurar ADMIN_PANEL_PASSWORD");
  }

  const providedBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(configuredPassword);
  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export const ADMIN_COOKIE_NAME = ADMIN_COOKIE;
