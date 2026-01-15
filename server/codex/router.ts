import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { listCodexDocs, loadCodexDocument } from "./service";

export const codexRouter = router({
  list: publicProcedure.query(() => listCodexDocs()),
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => loadCodexDocument(input.id)),
});
