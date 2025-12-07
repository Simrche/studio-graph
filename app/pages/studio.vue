<template>
    <div
        class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex overflow-hidden"
    >
        <BackgroundAnimation />

        <template v-if="loading">
            <div
                class="flex-1 flex items-center justify-center text-white text-xl"
            >
                Chargement du graphique...
            </div>
        </template>

        <template v-else-if="graphData">
            <Sidebar
                v-model="graphData.config"
                v-model:name="graphData.name"
                :has-changes="hasChanges"
                :loading="applyLoading"
                @apply="apply"
            />

            <!-- Main Canvas Area -->
            <main
                class="flex-1 p-8 flex flex-col items-center justify-center min-w-0 overflow-auto"
            >
                <div class="w-full max-w-full flex justify-center items-center">
                    <Graph ref="graphRef" v-model:config="graphData.config" />
                </div>
            </main>
        </template>

        <UiToast />
    </div>
</template>

<script setup lang="ts">
import type { Graph } from "~/types";
import { useDebounceFn } from "@vueuse/core";

const supabase = useSupabaseClient<any>();
const route = useRoute();
const { createPreview, deletePreview } = useGraphPreview();

const graphRef = ref<{
    reload: () => Promise<void>;
    restart: () => void;
    isAnimating: Ref<boolean>;
} | null>(null);

const loading = ref(true);
const graphData = ref<Graph | null>(null);

const graphId = computed(() => {
    const id = route.query.id;
    if (!id) return null;
    return parseInt(id as string);
});

const { modified: hasChanges, resetInitial } = useModification(() => ({
    ...graphData.value?.config.data,
    ...graphData.value?.config.tickers,
}));

const debouncedSave = useDebounceFn(async () => {
    if (!graphData.value || !graphId.value) return;

    await save();
}, 1500);

watch(
    [() => graphData.value?.config.animation, () => graphData.value?.name],
    async () => {
        if (!graphData.value) return;

        debouncedSave();
    },
    { deep: true }
);

// Charger le graphique
onMounted(async () => {
    if (!graphId.value) {
        loading.value = false;
        return;
    }

    try {
        const { data, error } = await supabase
            .from("graphs")
            .select("*")
            .eq("id", graphId.value)
            .single();

        if (error) throw error;

        graphData.value = data as unknown as Graph;
    } catch (error) {
        console.error("Erreur lors du chargement du graphique:", error);
    } finally {
        loading.value = false;
        // Réinitialiser useModification après le chargement
        if (graphData.value) {
            resetInitial();
        }
    }
});

async function save() {
    if (!graphData.value) return;

    await supabase
        .from("graphs")
        .update({
            name: graphData.value.name,
            config: graphData.value.config,
            preview_url: graphData.value.preview_url,
            updated_at: new Date(),
        })
        .eq("id", graphData.value.id);
}

const { loading: applyLoading, handle: apply } = useLoading(handleApply);

async function handleApply() {
    if (!graphData.value || !graphId.value) return;

    // Sauvegarder l'ancienne URL pour la supprimer après le save
    const oldPreviewUrl = graphData.value.preview_url;

    try {
        // Créer la nouvelle preview (sans supprimer l'ancienne)
        const newPreviewUrl = await createPreview(
            graphData.value.config,
            graphId.value
        );

        // Mettre à jour l'URL de la preview
        graphData.value.preview_url = newPreviewUrl;

        // Sauvegarder avec la preview_url
        await save();

        // Supprimer l'ancienne preview uniquement après le save réussi
        if (oldPreviewUrl) {
            try {
                await deletePreview(oldPreviewUrl);
            } catch (deleteError) {
                // Ne pas bloquer si la suppression échoue
                console.error(
                    "Erreur lors de la suppression de l'ancienne preview:",
                    deleteError
                );
            }
        }

        if (graphRef.value) {
            await graphRef.value.reload();
            resetInitial();
        }
    } catch (error) {
        console.error("Erreur lors de la génération de la preview:", error);
        // On sauvegarde quand même même si la preview a échoué
        await save();

        if (graphRef.value) {
            await graphRef.value.reload();
            resetInitial();
        }
    }
}
</script>
