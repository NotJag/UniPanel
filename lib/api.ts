import { type AppType } from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";

const api = hc<AppType>("http://localhost:3000/").api;

export default api;