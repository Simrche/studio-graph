<template>
    <div
        class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex overflow-hidden"
    >
        <Sidebar v-model="config" />

        <!-- Main Canvas Area -->
        <main
            class="flex-1 p-8 flex flex-col items-center justify-center min-w-0 overflow-auto"
        >
            <div class="w-full max-w-full flex justify-center items-center">
                <Graph />
            </div>
        </main>

        <UiToast />
    </div>
</template>

<script setup lang="ts">
import type { GraphConfig } from "~/types";

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
</script>
