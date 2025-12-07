import type { GraphConfig } from "~/types";
import { graphPreviewService } from "~/utils/graphPreviewService";

export const useGraphPreview = () => {
    const supabase = useSupabaseClient<any>();

    /**
     * Génère et upload une nouvelle preview du graphique
     * @param config Configuration du graphique
     * @param graphId ID du graphique
     * @param width Largeur de la preview (défaut: 1920 pour 16:9)
     * @returns URL publique de la preview uploadée
     */
    const createPreview = async (
        config: GraphConfig,
        graphId: number,
        width: number = 1920
    ): Promise<string> => {
        // Générer la preview en blob (1920x1080 - format 16:9)
        const previewBlob = await graphPreviewService.generatePreviewBlob(
            config,
            width
        );

        console.log(previewBlob);

        // Upload de la preview sur Supabase Storage
        const fileName = `graph-${graphId}-${Date.now()}.png`;
        const { error: uploadError } = await supabase.storage
            .from("graph-previews")
            .upload(fileName, previewBlob, {
                contentType: "image/png",
                upsert: true,
            });

        if (uploadError) {
            throw new Error(
                `Erreur lors de l'upload de la preview: ${uploadError.message}`
            );
        }

        // Récupérer l'URL publique de la preview
        const {
            data: { publicUrl },
        } = supabase.storage.from("graph-previews").getPublicUrl(fileName);

        return publicUrl;
    };

    /**
     * Supprime une preview du storage Supabase
     * @param previewUrl URL de la preview à supprimer
     */
    const deletePreview = async (previewUrl: string): Promise<void> => {
        try {
            // Extraire le nom du fichier de l'URL
            const fileName = previewUrl.split("/").pop();

            if (!fileName) {
                console.warn(
                    "Impossible d'extraire le nom du fichier de l'URL"
                );
                return;
            }

            const { error: deleteError } = await supabase.storage
                .from("graph-previews")
                .remove([fileName]);

            if (deleteError) {
                throw new Error(
                    `Erreur lors de la suppression: ${deleteError.message}`
                );
            }
        } catch (error) {
            console.error(
                "Erreur lors de la suppression de la preview:",
                error
            );
            throw error;
        }
    };

    return {
        createPreview,
        deletePreview,
    };
};
