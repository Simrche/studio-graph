<template>
    <div
        class="group relative flex items-center gap-3.5 overflow-hidden rounded-xl border border-purple-500/10 bg-white/[0.03] p-3.5 transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/5 before:to-pink-500/5 before:opacity-0 before:transition-opacity before:duration-300 hover:border-purple-500/30 hover:bg-white/[0.08] hover:shadow-[0_4px_12px_rgba(168,85,247,0.15)] hover:before:opacity-100"
    >
        <div
            class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
        >
            <img
                v-if="ticker.logoUrl && !logoError"
                :src="ticker.logoUrl"
                :alt="ticker.symbol"
                class="h-full w-full object-contain p-1"
                @error="logoError = true"
            />
            <div
                v-else
                class="flex h-full w-full items-center justify-center"
                :style="{ backgroundColor: ticker.color }"
            >
                <span
                    class="flex h-full w-full items-center justify-center text-sm font-bold tracking-wide text-white"
                >
                    {{ ticker.symbol?.substring(0, 2).toUpperCase() }}
                </span>
            </div>
        </div>
        <div class="relative z-[1] min-w-0 flex-1">
            <div
                class="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold tracking-wide text-white"
            >
                {{ ticker.symbol }}
            </div>
            <div
                class="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-violet-300 opacity-90"
            >
                {{ ticker.name }}
            </div>
        </div>
        <div class="relative z-[1] flex items-center gap-2">
            <UiColorPicker v-model="ticker.color" />
            <button
                class="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/[0.08] text-red-300 transition-all duration-300 hover:scale-105 hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-400 active:scale-95"
                @click="$emit('remove')"
                title="Supprimer"
            >
                <PhTrash :size="18" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TickerData } from "../types";
import { PhTrash } from "@phosphor-icons/vue";

const ticker = defineModel<TickerData>({ required: true });

defineEmits<{
    remove: [];
}>();

const logoError = ref(false);
</script>
