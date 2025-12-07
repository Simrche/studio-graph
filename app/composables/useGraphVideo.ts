import type { GraphConfig } from "~/types";
import { graphVideoService } from "~/utils/graphVideoService";

export const useGraphVideo = () => {
    const isGenerating = ref(false);
    const progress = ref(0);
    const estimatedTimeRemaining = ref(0);
    const error = ref<string | null>(null);
    let abortController: AbortController | null = null;

    /**
     * Génère une vidéo du graphique
     */
    const generateVideo = async (
        config: GraphConfig,
        options?: {
            width?: number;
            fps?: number;
            videoBitrate?: number;
        }
    ): Promise<Blob | null> => {
        isGenerating.value = true;
        error.value = null;
        progress.value = 0;

        try {
            const blob = await graphVideoService.generateVideo(config, options);
            progress.value = 100;
            return blob;
        } catch (err) {
            console.error("Erreur lors de la génération de la vidéo:", err);
            error.value =
                err instanceof Error
                    ? err.message
                    : "Erreur lors de la génération de la vidéo";
            return null;
        } finally {
            isGenerating.value = false;
        }
    };

    /**
     * Génère et télécharge directement la vidéo
     */
    const downloadVideo = async (
        config: GraphConfig,
        filename?: string,
        options?: {
            width?: number;
            fps?: number;
            videoBitrate?: number;
        }
    ): Promise<boolean> => {
        isGenerating.value = true;
        error.value = null;
        progress.value = 0;
        estimatedTimeRemaining.value = 0;
        abortController = new AbortController();

        try {
            await graphVideoService.downloadVideo(config, filename, {
                ...options,
                signal: abortController.signal,
                onProgress: (prog, timeRemaining) => {
                    progress.value = prog;
                    estimatedTimeRemaining.value = timeRemaining;
                },
            });
            progress.value = 100;
            estimatedTimeRemaining.value = 0;
            return true;
        } catch (err) {
            // Ne pas logger l'erreur si c'est une annulation
            if (err instanceof DOMException && err.name === "AbortError") {
                return false;
            }
            console.error("Erreur lors du téléchargement de la vidéo:", err);
            error.value =
                err instanceof Error
                    ? err.message
                    : "Erreur lors du téléchargement de la vidéo";
            return false;
        } finally {
            isGenerating.value = false;
            abortController = null;
        }
    };

    /**
     * Annule la génération de vidéo en cours
     */
    const cancel = () => {
        if (abortController) {
            abortController.abort();
            abortController = null;
        }
    };

    /**
     * Génère une URL pour prévisualiser la vidéo
     */
    const generateVideoUrl = async (
        config: GraphConfig,
        options?: {
            width?: number;
            fps?: number;
            videoBitrate?: number;
        }
    ): Promise<string | null> => {
        isGenerating.value = true;
        error.value = null;
        progress.value = 0;

        try {
            const url = await graphVideoService.generateVideoUrl(
                config,
                options
            );
            progress.value = 100;
            return url;
        } catch (err) {
            console.error("Erreur lors de la génération de l'URL vidéo:", err);
            error.value =
                err instanceof Error
                    ? err.message
                    : "Erreur lors de la génération de l'URL vidéo";
            return null;
        } finally {
            isGenerating.value = false;
        }
    };

    /**
     * Réinitialise l'état
     */
    const reset = () => {
        isGenerating.value = false;
        progress.value = 0;
        estimatedTimeRemaining.value = 0;
        error.value = null;
    };

    return {
        isGenerating: readonly(isGenerating),
        progress: readonly(progress),
        estimatedTimeRemaining: readonly(estimatedTimeRemaining),
        error: readonly(error),
        generateVideo,
        downloadVideo,
        generateVideoUrl,
        cancel,
        reset,
    };
};
