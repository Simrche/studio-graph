<template>
    <div class="flex-1 overflow-y-auto overflow-x-hidden p-6 flex flex-col gap-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-white/30">
        <!-- Placeholder pour le type default -->
        <section class="flex flex-col gap-4">
            <h2 class="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-2">
                <PhChartLine :size="16" />
                Configuration
            </h2>

            <div class="text-white/60 text-sm">
                Configuration du graphique par défaut à venir...
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { PhChartLine } from "@phosphor-icons/vue";
import type { GraphConfig } from "~/types";

const config = defineModel<GraphConfig>({
    required: true,
});
</script>
