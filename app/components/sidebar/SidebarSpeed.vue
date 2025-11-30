<template>
    <UiSlider
        label="Vitesse"
        v-model="speed"
        :min="0.1"
        :max="3"
        :step="0.1"
        suffix="x"
    />
</template>

<script setup lang="ts">
import type { GraphConfig } from "~/types";

const speed = defineModel<GraphConfig["animation"]["speed"]>({
    required: true,
});
</script>
