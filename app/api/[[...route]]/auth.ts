import { Hono } from "hono";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import { decode, sign, verify, jwt } from "hono/jwt";
import { checkAuthenticated } from "./middleware";
import env from "@/env";

type Variables = {
  user: {
    id: number
    role: string
    name: string
    email: string
    exp: number
  }
}

const app = new Hono<{ Variables: Variables }>();

app.get("/", (c) => c.text("Auth route"));

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = loginSchema
  .extend({
    name: z
      .string()
      .min(3)
      .max(50)
      .regex(/^[A-Za-z\s]+$/, "Name can only contain letters"),
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;
    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }
    if (
      countOfLowerCase < 1 ||
      countOfUpperCase < 1 ||
      countOfSpecialChar < 1 ||
      countOfNumbers < 1
    ) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "password does not meet complexity requirements",
      });
    }
  });

app.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) return c.notFound();

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return c.notFound();

  const payload = {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 5,
  };

  const token = await sign(payload, env.JWT_SECRET);

  c.header(
    "Set-Cookie",
    `token=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=300`
  );

  return c.json({ success: true, message: "Authenticated" }, 200);
});

app.post("/register", zValidator("json", registerSchema), async (c) => {
  const { name, email, password } = c.req.valid("json");

  const exists = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (exists) {
    return c.json(
      {
        success: false,
        message: "User already exists",
      },
      409
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return c.json(user, 201);
});

app.post("/me", checkAuthenticated, async (c) => {
  const user = c.get("user");

  return c.json({ success: true, message: `Authenticated as ${user.name} with UserId: ${user.id}` }, 200);
});

export default app;
