<template>
    <div
        class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex overflow-hidden"
    >
        <Sidebar
            v-model="config"
            :has-changes="hasChanges"
            :can-restart="canRestart"
            @reload="handleReload"
            @restart="handleRestart"
        />

        <!-- Main Canvas Area -->
        <main
            class="flex-1 p-8 flex flex-col items-center justify-center min-w-0 overflow-auto"
        >
            <div class="w-full max-w-full flex justify-center items-center">
                <Graph ref="graphRef" :config="appliedConfig" />
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
    tickers: [
        {
            symbol: "AIR.PA",
            name: "AIRBUS SE",
            color: "#00205c",
            logoUrl: "https://logo.clearbit.com/airbus.com",
        },
        {
            symbol: "BA",
            name: "Boeing Company (The)",
            color: "#42c4e9",
            logoUrl: "https://logo.clearbit.com/boeing.com",
        },
    ],
});

// Configuration appliquée au graphique
const appliedConfig = ref<GraphConfig>(
    JSON.parse(JSON.stringify(config.value))
);

// Détecter si des changements ont été apportés
const hasChanges = computed(() => {
    return JSON.stringify(config.value) !== JSON.stringify(appliedConfig.value);
});

// Détecter si on peut relancer (animation terminée + pas de changements)
const canRestart = computed(() => {
    return !hasChanges.value && appliedConfig.value.tickers.length > 0;
});

// Gérer le rechargement du graphique
const handleReload = async () => {
    appliedConfig.value = JSON.parse(JSON.stringify(config.value));
    if (graphRef.value) {
        await graphRef.value.reload();
    }
};

// Gérer le redémarrage de l'animation
const handleRestart = () => {
    if (graphRef.value) {
        graphRef.value.restart();
    }
};
</script>
