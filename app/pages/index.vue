<template>
    <div
        class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8"
    >
        <BackgroundAnimation />

        <!-- Header -->
        <header class="max-w-7xl mx-auto mb-12">
            <div class="flex items-start justify-between">
                <div>
                    <h1 class="text-4xl font-bold text-white mb-2">
                        Mes Graphiques
                    </h1>
                    <p class="text-white/60">
                        Gérez et créez vos graphiques de comparaison
                    </p>
                </div>
                <div class="shrink-0">
                    <UiButton
                        variant="primary"
                        size="sm"
                        @click="createNewGraph"
                    >
                        <template #icon>
                            <PhPlus :size="16" weight="bold" />
                        </template>
                        Nouveau graphique
                    </UiButton>
                </div>
            </div>
        </header>

        <!-- Graphs Grid -->
        <div class="max-w-7xl mx-auto">
            <div
                v-if="graphs.length === 0"
                class="flex flex-col items-center justify-center py-24"
            >
                <PhChartLine
                    :size="80"
                    weight="thin"
                    class="text-white/20 mb-6"
                />
                <h2 class="text-2xl font-semibold text-white/60 mb-2">
                    Aucun graphique
                </h2>
                <p class="text-white/40 mb-8">
                    Créez votre premier graphique pour commencer
                </p>
                <UiButton variant="primary" @click="createNewGraph">
                    <template #icon>
                        <PhPlus :size="20" weight="bold" />
                    </template>
                    Créer un graphique
                </UiButton>
            </div>

            <div
                v-else
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <GraphCard
                    v-for="graph in graphs"
                    :key="graph.id"
                    :graph="graph"
                    @click="openGraph(graph.id)"
                    @delete="deleteGraph(graph.id)"
                />
            </div>
        </div>

        <UiToast />
    </div>
</template>

<script setup lang="ts">
import { PhPlus, PhChartLine } from "@phosphor-icons/vue";

interface GraphPreview {
    id: string;
    title: string;
    tickersCount: number;
    tickers: Array<{
        symbol: string;
        name: string;
        color: string;
        logoUrl?: string;
    }>;
    startDate: string;
    updatedAt: Date;
    views: number;
    mockChartData: number[];
}

const graphs = ref<GraphPreview[]>([
    {
        id: "1",
        title: "Aéronautique: Airbus vs Boeing",
        tickersCount: 2,
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
        startDate: "2023-01-01",
        updatedAt: new Date("2024-11-28"),
        views: 1243,
        mockChartData: [45, 60, 55, 70, 65, 75, 80, 85, 90, 88],
    },
    {
        id: "2",
        title: "Tech Giants FAANG",
        tickersCount: 5,
        tickers: [
            {
                symbol: "META",
                name: "Meta Platforms",
                color: "#0081FB",
                logoUrl: "https://logo.clearbit.com/meta.com",
            },
            {
                symbol: "AAPL",
                name: "Apple Inc.",
                color: "#000000",
                logoUrl: "https://logo.clearbit.com/apple.com",
            },
            {
                symbol: "AMZN",
                name: "Amazon.com Inc.",
                color: "#FF9900",
                logoUrl: "https://logo.clearbit.com/amazon.com",
            },
            {
                symbol: "NFLX",
                name: "Netflix Inc.",
                color: "#E50914",
                logoUrl: "https://logo.clearbit.com/netflix.com",
            },
            {
                symbol: "GOOGL",
                name: "Alphabet Inc.",
                color: "#4285F4",
                logoUrl: "https://logo.clearbit.com/google.com",
            },
        ],
        startDate: "2022-06-15",
        updatedAt: new Date("2024-11-30"),
        views: 3567,
        mockChartData: [30, 45, 50, 55, 60, 58, 65, 70, 72, 75],
    },
    {
        id: "3",
        title: "Constructeurs Automobiles",
        tickersCount: 3,
        tickers: [
            {
                symbol: "TSLA",
                name: "Tesla Inc.",
                color: "#CC0000",
                logoUrl: "https://logo.clearbit.com/tesla.com",
            },
            {
                symbol: "F",
                name: "Ford Motor Company",
                color: "#003478",
                logoUrl: "https://logo.clearbit.com/ford.com",
            },
            {
                symbol: "GM",
                name: "General Motors",
                color: "#0057A5",
                logoUrl: "https://logo.clearbit.com/gm.com",
            },
        ],
        startDate: "2023-03-20",
        updatedAt: new Date("2024-11-25"),
        views: 892,
        mockChartData: [50, 55, 52, 58, 65, 70, 68, 75, 80, 78],
    },
]);

function createNewGraph() {
    navigateTo("/studio");
}

function openGraph(id: string) {
    navigateTo(`/studio?id=${id}`);
}

function deleteGraph(id: string) {
    const index = graphs.value.findIndex((g) => g.id === id);
    if (index !== -1) {
        graphs.value.splice(index, 1);
    }
}
</script>
