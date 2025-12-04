<template>
    <div
        class="flex items-center gap-4 px-6 py-4 bg-white border-b border-slate-200"
    >
        <!-- Device Toggle -->
        <div class="flex items-center gap-3">
            <div class="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                    @click="device = 'mobile'"
                    :class="[
                        'flex items-center justify-center px-3 py-1.5 rounded-md transition-all',
                        device === 'mobile'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900',
                    ]"
                    title="Mode mobile"
                >
                    <PhDeviceMobile class="w-4 h-4" />
                </button>
                <button
                    @click="device = 'desktop'"
                    :class="[
                        'flex items-center justify-center px-3 py-1.5 rounded-md transition-all',
                        device === 'desktop'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900',
                    ]"
                    title="Mode desktop"
                >
                    <PhDesktop class="w-4 h-4" />
                </button>
            </div>
        </div>
        <!-- Play/Pause Button -->
        <button
            @click="$emit('togglePlayPause')"
            class="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors border border-purple-500/20 hover:border-purple-500/30"
            :title="isPlaying ? 'Pause' : 'Play'"
        >
            <PhPause v-if="isPlaying" class="w-5 h-5 text-purple-500" />
            <PhPlay v-else class="w-5 h-5 text-purple-500" />
        </button>

        <!-- Restart Button -->
        <button
            @click="$emit('restart')"
            class="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors border border-purple-500/20 hover:border-purple-500/30"
            title="Recommencer"
        >
            <PhArrowCounterClockwise class="w-5 h-5 text-purple-500" />
        </button>

        <!-- Speed Slider -->
        <div class="flex items-center gap-3 flex-1 max-w-xs">
            <span class="text-sm font-medium text-slate-600 whitespace-nowrap">
                Vitesse
            </span>
            <input
                type="range"
                v-model.number="speed"
                min="0.1"
                max="2"
                step="0.1"
                class="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span class="text-sm font-medium text-slate-700 w-8 text-right">
                {{ speed?.toFixed(1) }}x
            </span>
        </div>

        <!-- Reveal Mode Toggle -->
        <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-slate-600 whitespace-nowrap">
                Mode révélation
            </span>
            <button
                @click="revealMode = !revealMode"
                :class="[
                    'relative w-12 h-6 rounded-full transition-colors',
                    revealMode ? 'bg-purple-500' : 'bg-slate-300',
                ]"
            >
                <span
                    :class="[
                        'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform',
                        revealMode ? 'translate-x-6' : 'translate-x-0',
                    ]"
                ></span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    PhPlay,
    PhPause,
    PhArrowCounterClockwise,
    PhDeviceMobile,
    PhDesktop,
} from "@phosphor-icons/vue";
import type { GraphConfig } from "~/types";

defineProps<{
    isPlaying: boolean;
}>();

const emit = defineEmits<{
    togglePlayPause: [];
    restart: [];
}>();

const speed = defineModel<number>("speed");
const revealMode = defineModel<boolean>("revealMode");
const device = defineModel<"mobile" | "desktop">("device");
</script>

<style scoped>
.slider::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    background: #a855f7;
    cursor: pointer;
    border-radius: 50%;
}

.slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: #a855f7;
    cursor: pointer;
    border-radius: 50%;
    border: none;
}
</style>
