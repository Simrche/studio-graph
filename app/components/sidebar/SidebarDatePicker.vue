<template>
    <div class="flex flex-col gap-2">
        <label
            class="text-xs font-semibold text-violet-300 uppercase tracking-wider"
        >
            Date de début
        </label>
        <input
            type="date"
            v-model="startDate"
            class="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm outline-none transition-all duration-200 [color-scheme:dark] focus:border-purple-500"
        />
        <div class="text-center text-xs text-white/50 bg-white/5 py-1 rounded">
            Période: {{ datePeriod }}
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GraphConfig } from "~/types";

const startDate = defineModel<GraphConfig["data"]["startDate"]>({
    required: true,
});

const datePeriod = computed(() => {
    const start = new Date(startDate.value);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0) {
        return months > 0
            ? `${years} an${years > 1 ? "s" : ""} ${months} mois`
            : `${years} an${years > 1 ? "s" : ""}`;
    }
    return months > 0 ? `${months} mois` : `${diffDays} jours`;
});
</script>
