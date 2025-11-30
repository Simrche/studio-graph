<template>
    <UiToggle label="Mode Révélation" v-model="revealMode" />
</template>

<script setup lang="ts">
import type { GraphConfig } from "~/types";

const revealMode = defineModel<GraphConfig["animation"]["revealMode"]>({
    required: true,
});
</script>
