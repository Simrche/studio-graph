import type { TickerData } from "~/types";

const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const BUCKET_NAME = "ticker_images";

export interface TickerImageValidationError {
    type: "size" | "format";
    message: string;
}

/**
 * Valide un fichier image pour un ticker
 */
export function validateTickerImage(
    file: File
): TickerImageValidationError | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return {
            type: "format",
            message: "Format non supporté. Utilisez JPG, PNG, GIF ou WebP.",
        };
    }

    if (file.size > MAX_IMAGE_SIZE) {
        return {
            type: "size",
            message: "L'image ne doit pas dépasser 1MB.",
        };
    }

    return null;
}

/**
 * Génère une URL de prévisualisation pour un fichier local
 */
export function createImagePreviewUrl(file: File): string {
    return URL.createObjectURL(file);
}

/**
 * Libère une URL de prévisualisation
 */
export function revokeImagePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
}

/**
 * Composable pour gérer les images de tickers
 */
export const useTickerImage = () => {
    const supabase = useSupabaseClient<any>();

    /**
     * Upload une image de ticker sur Supabase Storage
     */
    const uploadTickerImage = async (
        file: File,
        tickerSymbol: string
    ): Promise<string> => {
        const extension = file.name.split(".").pop() || "png";
        const fileName = `${tickerSymbol.toLowerCase()}-${Date.now()}.${extension}`;

        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            throw new Error(
                `Erreur lors de l'upload de l'image: ${uploadError.message}`
            );
        }

        const {
            data: { publicUrl },
        } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

        return publicUrl;
    };

    /**
     * Upload toutes les images en attente des tickers et met à jour leurs URLs
     * @returns Les tickers mis à jour avec les nouvelles URLs
     */
    const uploadPendingImages = async (
        tickers: TickerData[]
    ): Promise<TickerData[]> => {
        const updatedTickers = await Promise.all(
            tickers.map(async (ticker) => {
                if (!ticker.pendingImage) {
                    return ticker;
                }

                // Upload la nouvelle image
                const newUrl = await uploadTickerImage(
                    ticker.pendingImage,
                    ticker.symbol
                );

                return {
                    ...ticker,
                    customImageUrl: newUrl,
                    pendingImage: null,
                };
            })
        );

        return updatedTickers;
    };

    return {
        uploadPendingImages,
    };
};
