import { defineStore } from "pinia";

export type ToastType = "error" | "info" | "success";

export interface ToastButton {
    label: string;
    onClick: () => void;
}

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration: number;
    button?: ToastButton;
}

export interface ToastOptions {
    type?: ToastType;
    duration?: number;
    button?: ToastButton;
}

export const useToastStore = defineStore("toast", () => {
    const toasts = ref<Toast[]>([]);

    function show(message: string, options: ToastOptions = {}) {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const toast: Toast = {
            id,
            message,
            type: options.type || "info",
            duration: options.duration ?? 5000,
            button: options.button,
        };

        toasts.value.push(toast);

        if (toast.duration > 0) {
            setTimeout(() => {
                remove(id);
            }, toast.duration);
        }

        return id;
    }

    function success(
        message: string,
        options: Omit<ToastOptions, "type"> = {}
    ) {
        return show(message, { ...options, type: "success" });
    }

    function error(message: string, options: Omit<ToastOptions, "type"> = {}) {
        return show(message, { ...options, type: "error" });
    }

    function info(message: string, options: Omit<ToastOptions, "type"> = {}) {
        return show(message, { ...options, type: "info" });
    }

    function remove(id: string) {
        const index = toasts.value.findIndex((t) => t.id === id);
        if (index !== -1) {
            toasts.value.splice(index, 1);
        }
    }

    return {
        toasts,
        show,
        success,
        error,
        info,
        remove,
    };
});
