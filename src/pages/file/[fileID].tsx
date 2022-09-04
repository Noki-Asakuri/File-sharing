import type { GetServerSidePropsContext, NextPage } from "next";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import Head from "next/head";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import InfoCard from "$lib/components/fileID/InfoCard";
import PasswordForm from "$lib/components/fileID/Lock";
import { prisma } from "$lib/server/db/prisma";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { unstable_getServerSession as getServerSession } from "next-auth";

import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export type ServerProps = NonNullable<Awaited<ReturnType<typeof getServerSideProps>>["props"]>;

const FileDownload: NextPage<ServerProps> = ({ author, file }) => {
    const [parentRef] = useAutoAnimate<HTMLFormElement>();

    const { data: session } = useSession();

    const [isLocked, setLock] = useState<boolean>(
        !session
            ? !!file.password
            : !!file.password && !file.unlockedUser.includes(session.user.discordID),
    );

    return (
        <>
            <Head>
                <title>{file.name}</title>
                <meta property="og:title" content={`File Sharing.`} />
                <meta property="og:site_name" content={author.fullName} />
                <meta
                    property="og:description"
                    content={`File: ${file.name}\nDownload: ${file.downloadCount}\nUpload ${file.createdAt}`}
                />
                <meta property="og:image" content={author.image} />
            </Head>

            <article className="flex h-screen items-center justify-center" ref={parentRef}>
                {isLocked && file.password && (
                    <PasswordForm password={file.password} setLock={setLock} fileID={file.fileID} />
                )}

                {!isLocked && <InfoCard author={author} file={file} session={session} />}
                <Toaster
                    toastOptions={{
                        duration: 2000,
                        style: {
                            borderRadius: "10px",
                            background: "#262626",
                            color: "#E8DCFF",
                        },
                    }}
                />
            </article>
        </>
    );
};

export default FileDownload;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    if (!ctx.params || typeof ctx.params.fileID !== "string") {
        return { notFound: true };
    }

    const [file, session] = await Promise.all([
        prisma.file.findFirst({
            where: { fileID: ctx.params.fileID },
            select: {
                createdAt: true,
                downloadCount: true,
                name: true,
                fileID: true,
                password: true,
                unlockedUser: true,
                path: true,
                user: {
                    select: {
                        joinDate: true,
                        name: true,
                        isAdmin: true,
                        image: true,
                        discordID: true,
                    },
                },
            },
        }),
        getServerSession(ctx.req, ctx.res, authOptions),
    ]);

    if (!file) return { notFound: true };

    const dayjsFile = dayjs(file.createdAt);
    const dayjsAuthor = dayjs(file.user.joinDate);

    return {
        props: {
            file: {
                ...file,
                user: null,
                relativeTime: dayjsFile.fromNow(),
                createdAt: dayjsFile.format("MM-DD-YYYY, hh:mm:ss A"),
            },
            author: {
                name: file.user.name?.split("#")[0] as string,
                discriminator: ("#" + file.user.name?.split("#")[1]) as string,
                fullName: file.user.name as string,
                discordID: file.user.discordID,
                image: file.user.image as string,
                isAdmin: file.user.isAdmin,
                relativeTime: dayjsAuthor.fromNow(),
                joinDate: dayjsAuthor.format("MM-DD-YYYY, hh:mm:ss A"),
            },
            session,
        },
    };
}
