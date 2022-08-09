import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/future/image";
import { Reducer, useReducer, useState } from "react";

import useDebounce from "@/server/hooks/useDebounce";
import { trpc } from "@/utils/trpc";

import {
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
    FaAngleLeft,
    FaAngleRight,
    FaRedo,
    FaSearch,
} from "react-icons/fa";
import { Toaster } from "react-hot-toast";

const DashboardFile = dynamic(() => import("@/components/DashboardFile"), { ssr: false });

export interface ActionType {
    type: "FIRST" | "PREV" | "NEXT" | "LAST" | "SET" | "UPDATE" | "DELETE";
    payload?: number | string;
}

export interface State {
    currentPage: number;
    totalPages: number;
    refetch(): void;
}

const reducer = (state: State, action: ActionType) => {
    const { type, payload } = action;

    switch (type) {
        case "FIRST":
            return { ...state, currentPage: 1 };

        case "LAST":
            return { ...state, currentPage: state.totalPages };

        case "NEXT":
            if (state.currentPage + 1 > state.totalPages) {
                return state;
            }
            return { ...state, currentPage: state.currentPage + 1 };

        case "PREV":
            if (state.currentPage - 1 <= 0) {
                return state;
            }
            return { ...state, currentPage: state.currentPage - 1 };

        case "SET":
            if (!payload || typeof payload === "string") {
                return state;
            }

            return { ...state, currentPage: payload };

        case "DELETE":
            state.refetch();

            return state;

        case "UPDATE":
            if (typeof payload !== "number") {
                return state;
            }

            return { ...state, totalPages: payload, currentPage: 1 };

        default:
            return state;
    }
};

const Dashboard: NextPage = () => {
    // Todo: Make a button that can reset to new password incase user forgot!

    const [limit, setLimit] = useState<5 | 10 | 25>(5);

    const [searchText, setSearchText] = useState<string>("");
    const [search, setSearch] = useState<string>("");

    const [isRefetching, setFetching] = useState<boolean>(false);

    useDebounce(() => setSearch(searchText), 500, [searchText]);

    const { data, isLoading, refetch } = trpc.useQuery(["file.get-file-by-id", { limit, search }], {
        onSuccess: ({ totalPage }) => {
            dispatch({ type: "UPDATE", payload: totalPage });
        },
    });

    const [state, dispatch] = useReducer<Reducer<State, ActionType>>(reducer, {
        currentPage: 1,
        totalPages: data?.totalPage || 1,
        refetch: refetch,
    });

    return (
        <div className="flex items-center justify-center w-full h-screen">
            <div className="bg-gradient-to-t from-slate-800 to-slate-900 p-2 rounded-2xl h-[70vh] w-1/2 min-w-[620px] flex flex-col justify-start items-center relative">
                <div className="relative flex items-center justify-between w-full px-5">
                    <div className="absolute flex items-center justify-center px-3 rounded-lg group bg-slate-600">
                        <FaSearch
                            className={`absolute w-4 h-4 transition-all group-focus-within:right-3 ${
                                searchText.length && "right-3"
                            }`}
                        />
                        <input
                            className={`bg-transparent group-focus-within:outline-none px-2 z-50 py-1 group-focus-within:w-40 transition-[width] placeholder:text-sm ${
                                searchText.length ? "w-40 pl-2 pr-5" : "w-2"
                            }`}
                            type="text"
                            name="search-file"
                            id="search-file"
                            placeholder="Search by name"
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    <span className="flex items-center justify-center w-full p-2 text-2xl">
                        Dashboard
                    </span>

                    {data && data.totalPage > 0 && (
                        <div className="absolute flex items-center justify-center gap-3 top-1 right-16">
                            <button
                                className={`bg-slate-600 rounded-lg transition-colors duration-500 p-2 w-10 ${
                                    limit === 5 && "bg-sky-500"
                                }`}
                                onClick={() => setLimit(5)}
                            >
                                5
                            </button>
                            <button
                                className={`bg-slate-600 rounded-lg transition-colors duration-500 p-2 w-10 ${
                                    limit === 10 && "bg-sky-500"
                                }`}
                                onClick={() => setLimit(10)}
                            >
                                10
                            </button>
                            <button
                                className={`bg-slate-600 rounded-lg transition-colors duration-500 p-2 w-10 ${
                                    limit === 25 && "bg-sky-500"
                                }`}
                                onClick={() => setLimit(25)}
                            >
                                25
                            </button>
                        </div>
                    )}

                    <div>
                        <button
                            className="absolute p-3 rounded-full bg-slate-600 top-1 right-3"
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
                    <div className="flex items-center justify-center w-full h-full">
                        <Image
                            width="100"
                            height="100"
                            src={"/loading.svg"}
                            alt={"Loading image"}
                        />
                    </div>
                )}

                {!isLoading && data && (
                    <>
                        <div className="flex flex-col w-full h-full pt-2 overflow-scroll gap-y-3">
                            {data.pages[state.currentPage - 1]?.map((file) => {
                                return (
                                    <DashboardFile
                                        key={file.fileID}
                                        file={file}
                                        dispatch={dispatch}
                                    />
                                );
                            })}
                            {!data.totalPage && (
                                <div className="flex items-center justify-center w-full h-full">
                                    Nothing here to show!
                                </div>
                            )}
                        </div>

                        {data.totalPage > 0 && (
                            <div className="absolute flex items-center justify-center px-5 pt-2 pb-5 top-full rounded-b-2xl gap-x-3 bg-slate-800">
                                <button
                                    className="flex items-center justify-center w-10 h-10 px-3 py-2 rounded-lg bg-slate-600"
                                    onClick={() => dispatch({ type: "FIRST" })}
                                >
                                    <FaAngleDoubleLeft />
                                </button>
                                <button
                                    className="flex items-center justify-center w-10 h-10 px-3 py-2 rounded-lg bg-slate-600"
                                    onClick={() => dispatch({ type: "PREV" })}
                                >
                                    <FaAngleLeft />
                                </button>
                                <div className="flex items-center justify-center h-10 px-4 py-2 rounded-lg w-max bg-slate-600">
                                    {(state.currentPage - 1) * limit + 1}-
                                    {state.currentPage * limit <= data.totalFiles
                                        ? state.currentPage * limit
                                        : state.currentPage * limit -
                                          (state.currentPage * limit - data.totalFiles)}
                                    /{data.totalFiles}
                                </div>
                                <button
                                    className="flex items-center justify-center w-10 h-10 px-3 py-2 rounded-lg bg-slate-600"
                                    onClick={() => dispatch({ type: "NEXT" })}
                                >
                                    <FaAngleRight />
                                </button>
                                <button
                                    className="flex items-center justify-center w-10 h-10 px-3 py-2 rounded-lg bg-slate-600"
                                    onClick={() => dispatch({ type: "LAST" })}
                                >
                                    <FaAngleDoubleRight />
                                </button>
                            </div>
                        )}
                        <Toaster />
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
