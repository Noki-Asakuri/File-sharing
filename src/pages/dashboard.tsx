import useDebounce from "@/server/hooks/useDebounce";
import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import Image from "next/future/image";
import { Reducer, useReducer, useState } from "react";

import {
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
    FaAngleLeft,
    FaAngleRight,
    FaSearch,
} from "react-icons/fa";
import { IoReloadSharp } from "react-icons/io5";

import dynamic from "next/dynamic";
const DashboardFile = dynamic(() => import("@/components/DashboardFile"), {
    suspense: true,
});

export enum Action {
    FIRST = "FIRST",
    PREV = "PREV",
    NEXT = "NEXT",
    LAST = "LAST",
    SET = "SET",
    DELETE = "DELETE",
    UPDATE = "UPDATE",
}

export interface ActionType {
    type: Action;
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
        case Action.FIRST:
            return { ...state, currentPage: 1 };

        case Action.LAST:
            if (!payload || typeof payload === "string") {
                return state;
            }

            return { ...state, currentPage: payload };

        case Action.NEXT:
            if (!payload || typeof payload === "string") {
                return state;
            }

            if (state.currentPage + 1 > payload) {
                return state;
            }
            return { ...state, currentPage: state.currentPage + 1 };

        case Action.PREV:
            if (state.currentPage - 1 <= 0) {
                return state;
            }
            return { ...state, currentPage: state.currentPage - 1 };

        case Action.SET:
            if (!payload || typeof payload === "string") {
                return state;
            }

            return { ...state, currentPage: payload };

        case Action.DELETE:
            state.refetch();

            return state;

        case Action.UPDATE:
            if (typeof payload !== "number") {
                return state;
            }

            return { ...state, totalPages: payload };

        default:
            return state;
    }
};

const Dashboard: NextPage = ({}) => {
    const [limit, setLimit] = useState<5 | 10 | 25>(5);

    const [searchText, setSearchText] = useState<string>("");
    const [search, setSearch] = useState<string>("");

    const [isRefetching, setFetching] = useState<boolean>(false);

    useDebounce(() => setSearch(searchText), 500, [searchText]);

    const { data, isLoading, refetch } = trpc.useQuery(
        ["file.get-file-by-id", { limit, search }],
        {
            onSuccess: ({ totalPage }) => {
                dispatch({ type: Action.UPDATE, payload: totalPage });
            },
        }
    );

    const [state, dispatch] = useReducer<Reducer<State, ActionType>>(reducer, {
        currentPage: 1,
        totalPages: data?.totalPage || 1,
        refetch: refetch,
    });

    return (
        <div className="flex w-full h-[90vh] justify-center items-center">
            <div className="bg-slate-700 p-2 rounded-2xl h-[70vh] w-[50%] min-w-[550px] flex flex-col justify-start items-center relative">
                <div className="relative flex items-center justify-between w-full px-5">
                    <div className="absolute flex items-center justify-center px-3 rounded-lg group bg-slate-600">
                        <FaSearch
                            className={`absolute w-4 h-4 transition-all group-focus-within:right-3 ${
                                searchText.length && "right-3"
                            }`}
                        />
                        <input
                            className={`bg-transparent group-focus-within:outline-none px-2 z-50 py-1 group-focus-within:w-40 transition-[width] placeholder:text-sm ${
                                search.length ? "w-40 pl-2 pr-5" : "w-2"
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

                    <div className="absolute flex items-center justify-center gap-3 top-1 right-14">
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
                    <div>
                        <button
                            className="absolute p-2 rounded-full bg-slate-600 top-2 right-3"
                            onClick={() => {
                                setFetching(true);
                                refetch();

                                setTimeout(() => {
                                    setFetching(false);
                                }, 1000);
                            }}
                        >
                            <IoReloadSharp
                                className={
                                    isRefetching ? "animate-refetchSpin" : ""
                                }
                            />
                        </button>
                    </div>
                </div>
                {isLoading && (
                    <div className="flex items-center justify-center w-full h-full">
                        <Image
                            width="100px"
                            height="100px"
                            src={"/loading.svg"}
                            alt={"Loading image"}
                        />
                    </div>
                )}

                {!isLoading && (
                    <>
                        <div className="flex flex-col gap-y-4 w-full h-[82%] pt-2 overflow-scroll">
                            {data &&
                                data.pages[state.currentPage - 1]?.map(
                                    (file) => {
                                        return (
                                            <DashboardFile
                                                key={file.fileID}
                                                file={file}
                                                dispatch={dispatch}
                                            />
                                        );
                                    }
                                )}
                            {data && !data.totalPage && (
                                <div className="flex items-center justify-center w-full h-full">
                                    Nothing here to show!
                                </div>
                            )}
                        </div>

                        {data && data.totalPage > 0 && (
                            <div className="absolute flex items-center justify-center w-full gap-x-3 bottom-5">
                                <button
                                    className="flex items-center justify-center w-10 h-10 px-3 py-2 rounded-lg bg-slate-600"
                                    onClick={() =>
                                        dispatch({ type: Action.FIRST })
                                    }
                                >
                                    <FaAngleDoubleLeft />
                                </button>
                                <button
                                    className="flex items-center justify-center w-10 h-10 px-3 py-2 rounded-lg bg-slate-600"
                                    onClick={() =>
                                        dispatch({ type: Action.PREV })
                                    }
                                >
                                    <FaAngleLeft />
                                </button>
                                <div className="flex items-center justify-center w-10 h-10 px-3 py-2 rounded-lg bg-slate-600">
                                    {state.currentPage}/{state.totalPages}
                                </div>
                                <button
                                    className="flex items-center justify-center w-10 h-10 px-3 py-2 rounded-lg bg-slate-600"
                                    onClick={() =>
                                        dispatch({
                                            type: Action.NEXT,
                                            payload: data?.totalPage,
                                        })
                                    }
                                >
                                    <FaAngleRight />
                                </button>
                                <button
                                    className="flex items-center justify-center w-10 h-10 px-3 py-2 rounded-lg bg-slate-600"
                                    onClick={() =>
                                        dispatch({
                                            type: Action.LAST,
                                            payload: data?.totalPage,
                                        })
                                    }
                                >
                                    <FaAngleDoubleRight />
                                </button>
                                <span className="absolute right-10">
                                    Total: {data.totalFiles}
                                </span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
