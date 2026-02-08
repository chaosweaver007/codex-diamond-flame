import { createApp } from "../server/_core/index.js";

let app: any;

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await createApp();
  }
  return app(req, res);
}
