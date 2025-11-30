<template>
    <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2 max-h-0"
        enter-to-class="opacity-100 translate-y-0 max-h-96"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 max-h-96"
        leave-to-class="opacity-0 -translate-y-2 max-h-0"
    >
        <div
            v-if="graphConfigData.displayMode === 'initialAmount'"
            class="flex flex-col gap-2 overflow-hidden"
        >
            <label
                class="text-xs font-semibold text-violet-300 uppercase tracking-wider"
            >
                Montant initial ($)
            </label>
            <div class="relative">
                <PhCurrencyDollar
                    :size="18"
                    weight="bold"
                    class="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500/50 pointer-events-none"
                />
                <input
                    type="number"
                    v-model.number="graphConfigData.initialAmount"
                    min="0"
                    step="100"
                    class="w-full px-4 pl-10 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm outline-none transition-all duration-200 [color-scheme:dark] focus:border-purple-500 focus:bg-white/10"
                    placeholder="1000"
                />
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { PhCurrencyDollar } from "@phosphor-icons/vue";
import type { GraphConfig } from "~/types";

const graphConfigData = defineModel<GraphConfig["data"]>({
    required: true,
});
</script>
