<template>
    <div class="flex flex-col gap-4">
        <UiButton
            :variant="displayMode === 'percentage' ? 'active' : 'secondary'"
            @click="displayMode = 'percentage'"
        >
            <template #icon>
                <PhPercent :size="20" weight="fill" />
            </template>
            Pourcentage
        </UiButton>

        <UiButton
            :variant="displayMode === 'price' ? 'active' : 'secondary'"
            @click="displayMode = 'price'"
        >
            <template #icon>
                <PhCurrencyDollar :size="20" weight="fill" />
            </template>
            Prix
        </UiButton>

        <UiButton
            :variant="displayMode === 'initialAmount' ? 'active' : 'secondary'"
            @click="displayMode = 'initialAmount'"
        >
            <template #icon>
                <PhChartLine :size="20" weight="fill" />
            </template>
            Mise de départ
        </UiButton>
    </div>
</template>

<script setup lang="ts">
import { PhPercent, PhCurrencyDollar, PhChartLine } from "@phosphor-icons/vue";
import type { GraphConfig } from "~/types";

const displayMode = defineModel<GraphConfig["data"]["displayMode"]>({
    required: true,
});
</script>
