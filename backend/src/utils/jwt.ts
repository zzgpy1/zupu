import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const JWT_EXPIRY = "7d";

export async function generateToken(
  userId: string,
  email: string,
  username: string,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  return new SignJWT({ userId, email, username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(JWT_EXPIRY)
    .sign(encoder.encode(secret));
}

export async function verifyToken(token: string, secret: string): Promise<JWTPayload | null> {
  try {
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    return payload;
  } catch {
    return null;
  }
}
