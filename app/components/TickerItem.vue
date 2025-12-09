<template>
    <div
        class="group relative flex items-center gap-3.5 overflow-hidden rounded-xl border border-purple-500/10 bg-white/[0.03] p-3.5 transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/5 before:to-pink-500/5 before:opacity-0 before:transition-opacity before:duration-300 hover:border-purple-500/30 hover:bg-white/[0.08] hover:shadow-[0_4px_12px_rgba(168,85,247,0.15)] hover:before:opacity-100"
    >
        <TickerImageUploader
            :image-url="displayImageUrl"
            :pending-image="ticker.pendingImage"
            :symbol="ticker.symbol"
            :fallback-color="ticker.color"
            @update:pending-image="handlePendingImageUpdate"
            @remove-custom-image="handleRemoveCustomImage"
        />
        <div class="relative z-[1] min-w-0 flex-1">
            <div
                class="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold tracking-wide text-white cursor-default select-none"
            >
                {{ ticker.symbol }}
            </div>
            <input
                v-model="ticker.name"
                type="text"
                class="w-full mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-violet-300 opacity-90 bg-transparent border-0 border-b border-b-violet-300/20 outline-none focus:outline-none focus:border-b-violet-300/60 placeholder:text-violet-300/40 transition-colors duration-200 pb-0.5"
                placeholder="Nom du ticker"
                @focus="handleFocus"
                @blur="handleBlur"
                @keydown.enter="handleBlur"
            />
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

// URL à afficher: customImage > logoUrl
const displayImageUrl = computed(() => {
    return ticker.value.customImageUrl || ticker.value.logoUrl;
});

function handlePendingImageUpdate(file: File | null) {
    ticker.value.pendingImage = file;
}

function handleRemoveCustomImage() {
    ticker.value.customImageUrl = null;
    ticker.value.pendingImage = null;
}

function handleFocus() {
    // Optionnel: logique lors du focus
}

function handleBlur(event: Event) {
    (event.target as HTMLInputElement).blur();
}
</script>
