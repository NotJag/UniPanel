import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import env from "@/env";

const checkAuthenticated = createMiddleware(async (c, next) => {
  let token = c.req.header("Authorization");

  if (!token) return c.redirect("/auth/login");

  token = token.split(" ")[1];
  const secretKey = env.JWT_SECRET;

  try {
    const decodedPayload = await verify(token, secretKey);
    c.set("user", decodedPayload);
  } catch (e) {
    return c.redirect("/auth/login");
  }

  await next();
});

const checkAdmin = createMiddleware(async (c, next) => {
  await next();
});

export { checkAuthenticated, checkAdmin };
