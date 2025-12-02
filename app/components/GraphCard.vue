<template>
    <div
        class="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer hover:scale-[1.02]"
        @click="$emit('click')"
    >
        <!-- Graph Card Header -->
        <div class="flex items-start justify-between mb-4">
            <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-white mb-1 truncate">
                    {{ graph.title }}
                </h3>
                <p class="text-sm text-white/50">
                    {{ graph.tickersCount }} tickers · {{ formatDate(graph.updatedAt) }}
                </p>
            </div>
            <button
                class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg"
                @click.stop="$emit('delete')"
            >
                <PhTrash :size="18" class="text-white/60" />
            </button>
        </div>

        <!-- Tickers Preview -->
        <div class="flex items-center gap-2 mb-4">
            <div
                v-for="ticker in graph.tickers.slice(0, 4)"
                :key="ticker.symbol"
                class="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg"
            >
                <img
                    v-if="ticker.logoUrl"
                    :src="ticker.logoUrl"
                    :alt="ticker.symbol"
                    class="w-4 h-4 rounded"
                />
                <span class="text-xs text-white/80">{{ ticker.symbol }}</span>
            </div>
            <div v-if="graph.tickers.length > 4" class="text-xs text-white/50">
                +{{ graph.tickers.length - 4 }}
            </div>
        </div>

        <!-- Mock Chart Preview -->
        <div
            class="h-32 bg-white/5 rounded-lg flex items-end justify-around p-4 gap-1"
        >
            <div
                v-for="(height, index) in graph.mockChartData"
                :key="index"
                class="flex-1 rounded-t transition-all duration-300"
                :style="{
                    height: `${height}%`,
                    backgroundColor:
                        graph.tickers[index % graph.tickers.length]?.color ||
                        '#8b5cf6',
                    opacity: 0.6,
                }"
            ></div>
        </div>

        <!-- Graph Stats -->
        <div
            class="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50"
        >
            <span>Modifié le {{ graph.startDate }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PhTrash } from "@phosphor-icons/vue";

interface Ticker {
    symbol: string;
    name: string;
    color: string;
    logoUrl?: string;
}

interface GraphPreview {
    id: string;
    title: string;
    tickersCount: number;
    tickers: Ticker[];
    startDate: string;
    updatedAt: Date;
    views: number;
    mockChartData: number[];
}

defineProps<{
    graph: GraphPreview;
}>();

defineEmits<{
    click: [];
    delete: [];
}>();

function formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
    return `Il y a ${Math.floor(diffDays / 365)} ans`;
}
</script>
