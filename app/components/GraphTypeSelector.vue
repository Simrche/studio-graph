<template>
    <div class="space-y-6">
        <p class="text-white/50 text-sm text-center">
            Choisissez le type de graphique à créer
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Default Graph Option -->
            <button
                class="group relative p-5 rounded-xl border transition-all duration-200 text-left"
                :class="
                    selectedType === 'default'
                        ? 'border-violet-500/50 bg-violet-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                "
                @click="selectedType = 'default'"
            >
                <!-- Selection indicator -->
                <div
                    class="absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                    :class="
                        selectedType === 'default'
                            ? 'border-violet-500 bg-violet-500'
                            : 'border-white/20'
                    "
                >
                    <PhCheck
                        v-if="selectedType === 'default'"
                        :size="12"
                        weight="bold"
                        class="text-white"
                    />
                </div>

                <!-- Icon -->
                <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                    :class="
                        selectedType === 'default'
                            ? 'bg-violet-500/20'
                            : 'bg-white/5'
                    "
                >
                    <PhChartLineUp
                        :size="24"
                        weight="duotone"
                        :class="
                            selectedType === 'default'
                                ? 'text-violet-400'
                                : 'text-white/50'
                        "
                    />
                </div>

                <!-- Text -->
                <h3
                    class="text-base font-semibold mb-1.5 transition-colors"
                    :class="
                        selectedType === 'default'
                            ? 'text-white'
                            : 'text-white/70'
                    "
                >
                    Graphique Normal
                </h3>
                <p class="text-xs text-white/40 leading-relaxed">
                    Créez des graphiques personnalisés avec vos propres données.
                </p>

                <!-- Features list -->
                <ul class="mt-4 space-y-1.5">
                    <li class="flex items-center gap-2 text-xs text-white/30">
                        <PhCheckCircle :size="12" class="text-violet-400/60" />
                        Données personnalisables
                    </li>
                    <li class="flex items-center gap-2 text-xs text-white/30">
                        <PhCheckCircle :size="12" class="text-violet-400/60" />
                        Animations fluides
                    </li>
                    <li class="flex items-center gap-2 text-xs text-white/30">
                        <PhCheckCircle :size="12" class="text-violet-400/60" />
                        Export vidéo
                    </li>
                </ul>
            </button>

            <!-- Stocks Graph Option -->
            <button
                class="group relative p-5 rounded-xl border transition-all duration-200 text-left"
                :class="
                    selectedType === 'stocks'
                        ? 'border-emerald-500/50 bg-emerald-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                "
                @click="selectedType = 'stocks'"
            >
                <!-- Selection indicator -->
                <div
                    class="absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                    :class="
                        selectedType === 'stocks'
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-white/20'
                    "
                >
                    <PhCheck
                        v-if="selectedType === 'stocks'"
                        :size="12"
                        weight="bold"
                        class="text-white"
                    />
                </div>

                <!-- Icon -->
                <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                    :class="
                        selectedType === 'stocks'
                            ? 'bg-emerald-500/20'
                            : 'bg-white/5'
                    "
                >
                    <PhTrendUp
                        :size="24"
                        weight="duotone"
                        :class="
                            selectedType === 'stocks'
                                ? 'text-emerald-400'
                                : 'text-white/50'
                        "
                    />
                </div>

                <!-- Text -->
                <h3
                    class="text-base font-semibold mb-1.5 transition-colors"
                    :class="
                        selectedType === 'stocks'
                            ? 'text-white'
                            : 'text-white/70'
                    "
                >
                    Graphique Bourse
                </h3>
                <p class="text-xs text-white/40 leading-relaxed">
                    Visualisez les performances avec des données financières.
                </p>

                <!-- Features list -->
                <ul class="mt-4 space-y-1.5">
                    <li class="flex items-center gap-2 text-xs text-white/30">
                        <PhCheckCircle :size="12" class="text-emerald-400/60" />
                        Données boursières
                    </li>
                    <li class="flex items-center gap-2 text-xs text-white/30">
                        <PhCheckCircle :size="12" class="text-emerald-400/60" />
                        Comparaison de tickers
                    </li>
                    <li class="flex items-center gap-2 text-xs text-white/30">
                        <PhCheckCircle :size="12" class="text-emerald-400/60" />
                        Analyse des performances
                    </li>
                </ul>
            </button>
        </div>

        <!-- Action button -->
        <div class="pt-2">
            <UiButton
                variant="active"
                :loading="loading"
                @click="$emit('create', selectedType)"
            >
                <template #icon>
                    <PhPlus :size="18" weight="bold" />
                </template>
                Créer le graphique
            </UiButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    PhChartLineUp,
    PhTrendUp,
    PhCheck,
    PhCheckCircle,
    PhPlus,
} from "@phosphor-icons/vue";
import type { GraphType } from "~/types";

defineProps<{
    loading?: boolean;
}>();

defineEmits<{
    create: [type: GraphType];
}>();

const selectedType = ref<GraphType>("default");
</script>
