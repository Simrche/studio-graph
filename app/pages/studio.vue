<template>
    <div
        class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex overflow-hidden"
    >
        <BackgroundAnimation />

        <Sidebar
            v-model="config"
            :has-changes="hasChanges"
            @apply="handleApply"
        />

        <!-- Main Canvas Area -->
        <main
            class="flex-1 p-8 flex flex-col items-center justify-center min-w-0 overflow-auto"
        >
            <div class="w-full max-w-full flex justify-center items-center">
                <Graph ref="graphRef" v-model:config="config" />
            </div>
        </main>

        <UiToast />
    </div>
</template>

<script setup lang="ts">
import type { GraphConfig } from "~/types";

const graphRef = ref<{
    reload: () => Promise<void>;
    restart: () => void;
    isAnimating: Ref<boolean>;
} | null>(null);

const config = ref<GraphConfig>({
    animation: {
        speed: 0.5,
        revealMode: true,
    },
    data: {
        displayMode: "percentage" as "percentage" | "price" | "initialAmount",
        startDate: "2023-01-01",
        initialAmount: 1000,
    },
    tickers: [],
});

// Utiliser la composable pour détecter les modifications
const { modified: hasChanges, resetInitial } = useModification(() => ({
    ...config.value.data,
    ...config.value.tickers,
}));

// Gérer l'application des modifications
async function handleApply() {
    if (graphRef.value) {
        await graphRef.value.reload();
        // Réinitialiser l'état initial après le rechargement réussi
        resetInitial();
    }
}
</script>
