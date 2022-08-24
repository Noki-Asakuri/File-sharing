// src/server/router/context.ts
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

import { prisma } from "@/server/db/prisma";
import { supabase } from "@/server/db/supabase";

import { Session, unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "src/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

type CreateContextOptions = {
    session: Session | null;
    req: NextApiRequest;
    res: NextApiResponse;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
    return { ...opts, prisma, supabase };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
    const { req, res } = opts;

    const session = await getServerSession(req, res, nextAuthOptions);

    return await createContextInner({ session, req, res });
};

export type Context = inferAsyncReturnType<typeof createContext>;
