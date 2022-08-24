import type { GetServerSidePropsContext, NextPage } from "next";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import Head from "next/head";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import InfoCard from "@/components/fileID/InfoCard";
import PasswordForm from "@/components/fileID/Lock";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/server/db/prisma";
import { unstable_getServerSession as getServerSession } from "next-auth";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
dayjs.extend(relativeTime);

export type ServerProps = NonNullable<Awaited<ReturnType<typeof getServerSideProps>>["props"]>;

const FileDownload: NextPage<ServerProps> = ({ author, file }) => {
    const [parentRef] = useAutoAnimate<HTMLFormElement>({
        disrespectUserMotionPreference: true,
    });

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
                <meta property="og:site_name" content={file?.author} />
                <meta
                    property="og:description"
                    content={`File: ${file?.name}\nDownload: ${file?.downloadCount}\nUpload ${file?.createdAt}`}
                />
                <meta property="og:image" content={author?.image} />
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
                authorID: true,
                downloadCount: true,
                name: true,
                fileID: true,
                password: true,
                author: true,
                unlockedUser: true,
            },
        }),
        getServerSession(ctx.req, ctx.res, authOptions),
    ]);

    if (!file) return { notFound: true };

    const author = await prisma.user.findFirstOrThrow({
        where: { discordID: file.authorID },
        select: { name: true, joinDate: true, image: true, isAdmin: true, discordID: true },
    });

    const dayjsFile = dayjs(file.createdAt);
    const dayjsAuthor = dayjs(author.joinDate);

    return {
        props: {
            file: {
                ...file,
                relativeTime: dayjsFile.fromNow(),
                createdAt: dayjsFile.format("MM-DD-YYYY, hh:mm:ss A"),
            },
            author: {
                name: author.name?.split("#")[0] as string,
                discriminator: ("#" + author.name?.split("#")[1]) as string,
                fullName: author.name as string,
                discordID: author.discordID,
                image: author.image as string,
                isAdmin: author.isAdmin,
                relativeTime: dayjsAuthor.fromNow(),
                joinDate: dayjsAuthor.format("MM-DD-YYYY, hh:mm:ss A"),
            },
            session,
        },
    };
}
