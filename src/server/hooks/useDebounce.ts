import { DependencyList, useEffect } from "react";
import useTimeout from "./useTimeout";

export default function useDebounce(
    callback: (...args: any[]) => any,
    delay: number,
    dependencies: DependencyList
) {
    const { reset, clear } = useTimeout(callback, delay);
    useEffect(reset, [...dependencies, reset]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(clear, []);
}
