<template>
    <div
        class="flex items-center gap-4 px-6 py-4 bg-white border-b border-slate-200"
    >
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
                @input="$emit('speedChange', speed)"
                min="0.1"
                max="2"
                step="0.1"
                class="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span class="text-sm font-medium text-slate-700 w-8 text-right">
                {{ speed.toFixed(1) }}x
            </span>
        </div>

        <!-- Reveal Mode Toggle -->
        <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-slate-600 whitespace-nowrap">
                Mode révélation
            </span>
            <button
                @click="toggleRevealMode"
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
import { PhPlay, PhPause, PhArrowCounterClockwise } from "@phosphor-icons/vue";

const props = defineProps<{
    isPlaying: boolean;
    animationSpeed: number;
    revealMode: boolean;
}>();

const emit = defineEmits<{
    togglePlayPause: [];
    restart: [];
    speedChange: [speed: number];
    revealModeChange: [revealMode: boolean];
}>();

const speed = ref(props.animationSpeed);
const revealMode = ref(props.revealMode);

// Synchroniser avec les props
watch(
    () => props.animationSpeed,
    (newSpeed) => {
        speed.value = newSpeed;
    }
);

watch(
    () => props.revealMode,
    (newRevealMode) => {
        revealMode.value = newRevealMode;
    }
);

function toggleRevealMode() {
    revealMode.value = !revealMode.value;
    emit("revealModeChange", revealMode.value);
}
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
