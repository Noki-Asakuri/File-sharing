// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next";

import { createContext } from "$lib/server/trpc/context";
import { appRouter } from "$lib/server/trpc/routers";

// export API handler
export default createNextApiHandler({ router: appRouter, createContext });
