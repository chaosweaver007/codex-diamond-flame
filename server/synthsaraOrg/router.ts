import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  listSynthsaraOrgDocs,
  loadSynthsaraOrgDocument,
} from "./service";

export const synthsaraOrgRouter = router({
  list: publicProcedure.query(() => listSynthsaraOrgDocs()),
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => loadSynthsaraOrgDocument(input.id)),
});
