import { useToastStore } from "~/stores/toast";

/**
 * Composable pour afficher des toasts facilement
 */
export const useToast = () => {
    const toastStore = useToastStore();

    return {
        showSuccess: toastStore.success,
        showError: toastStore.error,
        showInfo: toastStore.info,
    };
};
