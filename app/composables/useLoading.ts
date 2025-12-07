export function useLoading<T extends (...args: any[]) => Promise<any>>(fn: T) {
    const loading = ref(false);

    const wrappedFunction = async (
        ...args: Parameters<T>
    ): Promise<Awaited<ReturnType<T>>> => {
        loading.value = true;
        try {
            const result = await fn(...args);
            return result;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading: readonly(loading),
        handle: wrappedFunction as T,
    };
}
