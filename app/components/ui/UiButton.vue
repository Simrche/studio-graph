<template>
    <button
        :class="[
            'w-full px-4 py-3 rounded-xl font-medium transition-all duration-200',
            'flex items-center justify-center gap-2',
            variantClasses,
            (disabled || loading) && 'opacity-50 cursor-not-allowed',
        ]"
        :disabled="disabled || loading"
        @click="$emit('click')"
    >
        <PhSpinner v-if="loading" :size="20" class="animate-spin" />
        <template v-else>
            <component v-if="iconLeft" :is="iconLeft" :size="iconSize" />
            <slot name="icon"></slot>
            <span><slot></slot></span>
            <component v-if="iconRight" :is="iconRight" :size="iconSize" />
        </template>
    </button>
</template>

<script setup lang="ts">
import { PhSpinner } from "@phosphor-icons/vue";
import type { Component } from "vue";

const props = defineProps<{
    variant?: "primary" | "secondary" | "active";
    disabled?: boolean;
    loading?: boolean;
    iconLeft?: Component;
    iconRight?: Component;
    iconSize?: number;
}>();

defineEmits<{
    click: [];
}>();

const variantClasses = computed(() => {
    if (props.disabled) {
        return "bg-white/5 border border-white/10 text-white/50";
    }

    switch (props.variant) {
        case "primary":
            return "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-[1.02]";
        case "active":
            return "bg-purple-500 border border-purple-500 text-white shadow-[0_10px_25px_rgba(168,85,247,0.3)]";
        case "secondary":
        default:
            return "bg-white/5 border border-white/10 text-white hover:bg-white/10";
    }
});
</script>
