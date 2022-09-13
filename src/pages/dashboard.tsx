import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { Reducer, useReducer, useState } from "react";

import { trpc } from "$lib/utils/trpc";
import LoadingImage from "$lib/components/Svg/Loading";
import useDebounce from "$lib/server/hooks/useDebounce";

import { Toaster } from "react-hot-toast";
import {
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
    FaAngleLeft,
    FaAngleRight,
    FaRedo,
    FaSearch,
} from "react-icons/fa";

const DashboardFile = dynamic(() => import("$lib/components/Dashboard/DashboardFile"), {
    ssr: false,
});

export interface ActionType {
    type: "FIRST" | "PREV" | "NEXT" | "LAST" | "SET" | "UPDATE" | "DELETE" | "RESET";
    payload?: number | string;
}

export interface State {
    currentPage: number;
    totalPages: number;
    refetch: () => void;
}

const reducer = (state: State, action: ActionType) => {
    const { type, payload } = action;

    switch (type) {
        case "FIRST":
            return { ...state, currentPage: 1 };

        case "LAST":
            return { ...state, currentPage: state.totalPages };

        case "NEXT":
            if (state.currentPage + 1 > state.totalPages) break;

            return { ...state, currentPage: state.currentPage + 1 };

        case "PREV":
            if (state.currentPage - 1 <= 0) break;

            return { ...state, currentPage: state.currentPage - 1 };

        case "SET":
            if (!payload || typeof payload === "string") break;

            return { ...state, currentPage: payload };

        case "DELETE":
            state.refetch();

        case "UPDATE":
            if (typeof payload !== "number") break;

            return { ...state, totalPages: payload, currentPage: 1 };

        case "RESET":
            state.refetch();
    }

    return state;
};

type Limit = 5 | 10 | 25;

type LimitButtonProps = {
    limit: Limit;
    currentLimit: number;
    setLimit: (a: Limit) => void;
};
type NavButtonProps = {
    children: React.ReactNode;
    type: ActionType["type"];
    dispatch: ({ type, payload }: ActionType) => void;
};

const LimitButton: React.FC<LimitButtonProps> = ({ limit, setLimit, currentLimit }) => {
    return (
        <button
            className={`w-10 rounded-lg bg-slate-600 p-2 transition-colors duration-500 ${
                currentLimit === limit && "bg-sky-500"
            }`}
            onClick={() => setLimit(limit)}
        >
            {limit}
        </button>
    );
};

const NavButton: React.FC<NavButtonProps> = ({ dispatch, type, children }) => {
    return (
        <button
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-600 px-3 py-2"
            onClick={() => dispatch({ type })}
        >
            {children}
        </button>
    );
};

const Dashboard: NextPage = () => {
    const [limit, setLimit] = useState<Limit>(5);

    const [searchText, setSearchText] = useState<string>("");
    const [search, setSearch] = useState<string>("");

    const [isRefetching, setFetching] = useState<boolean>(false);
    useDebounce(() => setSearch(searchText), 500, [searchText]);

    const { data, isLoading, refetch } = trpc.file.dashboard.useQuery(
        { limit, search },
        {
            onSuccess: ({ totalPage }) => {
                dispatch({ type: "UPDATE", payload: totalPage });
            },
            refetchOnWindowFocus: false,
        },
    );

    const [state, dispatch] = useReducer<Reducer<State, ActionType>>(reducer, {
        currentPage: 1,
        totalPages: data?.totalPage || 1,
        refetch: refetch,
    });

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="relative flex h-[70vh] w-1/2 min-w-[620px] flex-col items-center justify-start rounded-2xl bg-gradient-to-t from-slate-800 to-slate-900 p-2">
                <div className="relative flex w-full items-center justify-between px-5">
                    <div className="group absolute flex items-center justify-center rounded-lg bg-slate-600 px-3">
                        <FaSearch
                            className={`absolute h-4 w-4 transition-all group-focus-within:right-3 ${
                                searchText.length && "right-3"
                            }`}
                        />
                        <input
                            className={`z-50 bg-transparent px-2 py-1 transition-[width] placeholder:text-sm group-focus-within:w-40 group-focus-within:outline-none ${
                                searchText.length ? "w-40 pl-2 pr-5" : "w-2"
                            }`}
                            type="text"
                            name="search-file"
                            id="search-file"
                            placeholder="Search by name"
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    <span className="flex w-full items-center justify-center p-2 text-2xl">
                        Dashboard
                    </span>

                    <div className="absolute top-1 right-16 flex items-center justify-center gap-3">
                        <LimitButton limit={5} setLimit={setLimit} currentLimit={limit} />
                        <LimitButton limit={10} setLimit={setLimit} currentLimit={limit} />
                        <LimitButton limit={25} setLimit={setLimit} currentLimit={limit} />
                    </div>

                    <div>
                        <button
                            className="absolute top-1 right-3 rounded-full bg-slate-600 p-3"
                            onClick={() => {
                                setFetching(true);
                                refetch();

                                setTimeout(() => setFetching(false), 1000);
                            }}
                        >
                            <FaRedo className={isRefetching ? "animate-refetchSpin" : undefined} />
                        </button>
                    </div>
                </div>

                {isLoading && (
                    <div className="flex h-full w-full items-center justify-center">
                        <LoadingImage />
                    </div>
                )}

                {!isLoading && (
                    <div className="flex h-full w-full flex-col gap-y-3 overflow-scroll pt-2">
                        {data?.pages[state.currentPage - 1]?.map((file) => {
                            return (
                                <DashboardFile key={file.fileID} file={file} dispatch={dispatch} />
                            );
                        })}
                        {!data?.totalPage && (
                            <div className="flex h-full w-full items-center justify-center">
                                Nothing here to show!
                            </div>
                        )}
                    </div>
                )}

                <div className="absolute top-full flex items-center justify-center gap-x-3 rounded-b-2xl bg-slate-800 px-5 pt-2 pb-5">
                    <NavButton dispatch={dispatch} type="FIRST">
                        <FaAngleDoubleLeft />
                    </NavButton>
                    <NavButton dispatch={dispatch} type="PREV">
                        <FaAngleLeft />
                    </NavButton>
                    <div className="flex h-10 w-max items-center justify-center rounded-lg bg-slate-600 px-4 py-2">
                        {data && data.totalPage !== 0
                            ? `${(state.currentPage - 1) * limit + 1}-${
                                  state.currentPage * limit <= data.totalFiles
                                      ? state.currentPage * limit
                                      : state.currentPage * limit -
                                        (state.currentPage * limit - data.totalFiles)
                              }/${data.totalFiles}`
                            : "0-0/0"}
                    </div>
                    <NavButton dispatch={dispatch} type="NEXT">
                        <FaAngleRight />
                    </NavButton>
                    <NavButton dispatch={dispatch} type="LAST">
                        <FaAngleDoubleRight />
                    </NavButton>
                </div>
                {!isLoading && data && <Toaster />}
            </div>
        </div>
    );
};

export default Dashboard;
