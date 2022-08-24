import { useCallback, useEffect, useRef } from "react";

export default function useTimeout(callback: (...args: unknown[]) => unknown, delay: number) {
    const callbackRef = useRef<(...args: unknown[]) => unknown>(callback);
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const set = useCallback(() => {
        timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
    }, [delay]);

    const clear = useCallback(() => {
        timeoutRef.current && clearTimeout(timeoutRef.current);
    }, []);

    useEffect(() => {
        set();
        return clear;
    }, [delay, set, clear]);

    const reset = useCallback(() => {
        clear();
        set();
    }, [clear, set]);

    return { reset, clear };
}
