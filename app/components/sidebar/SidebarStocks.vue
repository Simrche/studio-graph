<template>
    <div class="flex-1 overflow-y-auto overflow-x-hidden p-6 flex flex-col gap-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-white/30">
        <!-- Tickers -->
        <section class="flex flex-col gap-4">
            <h2 class="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-2">
                <PhTrendUp :size="16" />
                Lignes
                <span v-if="config.tickers.length > 0" class="text-xs opacity-70 font-normal">
                    ({{ config.tickers.length }})
                </span>
            </h2>

            <SidebarTickers v-model="config.tickers" />
        </section>

        <!-- Configuration -->
        <section class="flex flex-col gap-4">
            <h2 class="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-2">
                <PhSlidersHorizontal :size="16" />
                Données
            </h2>

            <div class="flex flex-col gap-4">
                <SidebarDataMode v-model="config.data.displayMode" />
                <SidebarInitialAmount v-model="config.data" />
                <SidebarDatePicker v-model="config.data.startDate" />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { PhSlidersHorizontal, PhTrendUp } from "@phosphor-icons/vue";
import type { GraphConfig } from "~/types";

const config = defineModel<GraphConfig>({
    required: true,
});
</script>
