<template>
    <div
        class="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex overflow-hidden"
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
                :type="graphData.type"
                :has-changes="hasChanges"
                :loading="applyLoading"
                @apply="apply"
            />

            <!-- Main Canvas Area -->
            <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
                <!-- Toggle pour mode default -->
                <div
                    v-if="graphData.type === 'default'"
                    class="flex items-center justify-center gap-2 p-4 border-b border-white/10"
                >
                    <button
                        @click="viewMode = 'preview'"
                        :class="[
                            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                            viewMode === 'preview'
                                ? 'bg-purple-500 text-white'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white',
                        ]"
                    >
                        <PhChartLine :size="18" />
                        Graphique
                    </button>
                    <button
                        @click="viewMode = 'data'"
                        :class="[
                            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                            viewMode === 'data'
                                ? 'bg-purple-500 text-white'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white',
                        ]"
                    >
                        <PhTable :size="18" />
                        Données
                    </button>
                </div>

                <!-- Content area -->
                <div
                    :class="[
                        'flex-1 min-h-0 flex flex-col',
                        viewMode === 'data' && graphData.type === 'default'
                            ? 'p-4'
                            : 'p-8 items-center justify-center overflow-auto',
                    ]"
                >
                    <!-- Preview mode ou type stocks -->
                    <div
                        v-if="
                            graphData.type === 'stocks' ||
                            viewMode === 'preview'
                        "
                        class="w-full max-w-full flex justify-center items-center"
                    >
                        <Graph
                            ref="graphRef"
                            v-model:config="graphData.config"
                            :type="graphData.type"
                        />
                    </div>

                    <!-- Data mode (spreadsheet) -->
                    <DataSpreadsheet
                        v-else
                        class="flex-1 min-h-0"
                        v-model="spreadsheetCells"
                        :label-column="
                            graphData.config.default?.labelColumn ?? 'A'
                        "
                        :image-column="
                            graphData.config.default?.imageColumn ?? 'B'
                        "
                        :color-column="graphData.config.default?.colorColumn"
                        :data-range-start="
                            graphData.config.default?.dataRangeStart ?? 'C'
                        "
                        :data-range-end="
                            graphData.config.default?.dataRangeEnd ?? 'Z'
                        "
                    />
                </div>
            </main>
        </template>

        <UiToast />
    </div>
</template>

<script setup lang="ts">
import { PhChartLine, PhTable } from "@phosphor-icons/vue";
import type { Graph, SpreadsheetCell } from "~/types";
import { useDebounceFn } from "@vueuse/core";

const supabase = useSupabaseClient<any>();
const route = useRoute();
const { createPreview, deletePreview } = useGraphPreview();
const { uploadPendingImages } = useTickerImage();

const graphRef = ref<{
    reload: () => Promise<void>;
    restart: () => void;
    isAnimating: Ref<boolean>;
} | null>(null);

const loading = ref(true);
const graphData = ref<Graph | null>(null);
const viewMode = ref<"preview" | "data">("data");

// Computed pour les cells du spreadsheet avec synchro bidirectionnelle
const spreadsheetCells = computed({
    get: () => graphData.value?.config.default?.cells ?? [],
    set: (value: SpreadsheetCell[]) => {
        if (graphData.value) {
            if (!graphData.value.config.default) {
                graphData.value.config.default = {
                    cells: [],
                    labelColumn: "A",
                    imageColumn: "B",
                    dataRangeStart: "C",
                    dataRangeEnd: "Z",
                };
            }
            graphData.value.config.default.cells = value;
        }
    },
});

const graphId = computed(() => {
    const id = route.query.id;
    if (!id) return null;
    return parseInt(id as string);
});

const { modified: hasChanges, resetInitial } = useModification(() => ({
    ...graphData.value?.config.data,
    ...graphData.value?.config.tickers,
    valueSuffix: graphData.value?.config.default?.valueSuffix,
    labelColumn: graphData.value?.config.default?.labelColumn,
    imageColumn: graphData.value?.config.default?.imageColumn,
    colorColumn: graphData.value?.config.default?.colorColumn,
    dataRangeStart: graphData.value?.config.default?.dataRangeStart,
    dataRangeEnd: graphData.value?.config.default?.dataRangeEnd,
}));

const debouncedSave = useDebounceFn(async () => {
    if (!graphData.value || !graphId.value) return;

    await save();
}, 1500);

watch(
    [
        () => graphData.value?.config.animation,
        () => graphData.value?.name,
        () => graphData.value?.config.default?.cells,
    ],
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
        // Upload les images de tickers en attente (mode stocks)
        if (graphData.value.type === "stocks") {
            const updatedTickers = await uploadPendingImages(
                graphData.value.config.tickers
            );
            graphData.value.config.tickers = updatedTickers;
        }

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
