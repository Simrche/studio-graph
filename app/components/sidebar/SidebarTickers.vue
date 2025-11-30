<template>
    <div class="flex flex-col gap-4">
        <UiSearchTicker @select="addTicker" />

        <div
            v-if="tickers.length === 0"
            class="flex flex-col items-center justify-center p-12 gap-4 bg-purple-500/[0.03] border-2 border-dashed border-purple-500/20 rounded-xl"
        >
            <PhInfo
                :size="48"
                weight="fill"
                class="text-purple-500/30 animate-[float_3s_ease-in-out_infinite]"
            />
            <p class="text-white/50 text-sm font-medium text-center">
                Aucun ticker sélectionné
            </p>
        </div>

        <div v-else class="flex flex-col pb-4">
            <div class="flex flex-col gap-2.5">
                <TickerItem
                    v-for="(ticker, index) in tickers"
                    :key="ticker.symbol"
                    v-model="tickers[index]!"
                    @remove="removeTicker(ticker.symbol)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PhInfo } from "@phosphor-icons/vue";
import type { TickerData } from "~/types";
import { useToastStore } from "~/stores/toast";

const tickers = defineModel<TickerData[]>({ required: true });
const toastStore = useToastStore();

function getTicker(symbol: string) {
    return tickers.value.find((ticker: TickerData) => ticker.symbol === symbol);
}

async function addTicker(tickerToAdd: any) {
    const symbol = tickerToAdd.symbol;
    const name = tickerToAdd.shortname || tickerToAdd.longname || symbol;

    const existingTicker = getTicker(symbol);

    if (existingTicker) {
        toastStore.error("Ce ticker est déjà dans la liste !");
        return;
    }

    const { logoUrl } = await $fetch("/api/get-ticker-logo", {
        params: { symbol },
    });

    tickers.value.push({
        symbol,
        name,
        color: generateRandomColor(),
        logoUrl,
    });
}

function removeTicker(symbol: string) {
    tickers.value = tickers.value.filter((ticker) => ticker.symbol !== symbol);
}
</script>
