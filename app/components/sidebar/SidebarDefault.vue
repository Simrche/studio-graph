<template>
    <div class="flex-1 overflow-y-auto overflow-x-hidden p-6 flex flex-col gap-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-white/30">
        <!-- Configuration des colonnes -->
        <section class="flex flex-col gap-4">
            <h2 class="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-2">
                <PhColumns :size="16" />
                Mapping des colonnes
            </h2>

            <!-- Label Column -->
            <div class="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded bg-blue-500"></div>
                    <label class="text-sm font-medium text-white">Colonne Label</label>
                </div>
                <input
                    v-model="labelColumn"
                    type="text"
                    placeholder="Ex: A"
                    class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase font-mono"
                    @input="formatColumnInput($event, 'label')"
                />
            </div>

            <!-- Image Column -->
            <div class="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded bg-green-500"></div>
                    <label class="text-sm font-medium text-white">Colonne Image (URL)</label>
                </div>
                <input
                    v-model="imageColumn"
                    type="text"
                    placeholder="Ex: B"
                    class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-green-500 uppercase font-mono"
                    @input="formatColumnInput($event, 'image')"
                />
            </div>

            <!-- Color Column -->
            <div class="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded bg-orange-500"></div>
                    <label class="text-sm font-medium text-white">Colonne Couleur</label>
                </div>
                <input
                    v-model="colorColumn"
                    type="text"
                    placeholder="Ex: C"
                    class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-orange-500 uppercase font-mono"
                    @input="formatColumnInput($event, 'color')"
                />
                <p class="text-xs text-white/40">
                    Nom CSS (red, blue...) ou HEX (#FF0000)
                </p>
            </div>

            <!-- Data Range -->
            <div class="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded bg-purple-500"></div>
                    <label class="text-sm font-medium text-white">Plage de données</label>
                </div>
                <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <input
                        v-model="dataRangeStart"
                        type="text"
                        placeholder="C"
                        class="min-w-0 px-2 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500 uppercase font-mono text-center"
                        @input="formatColumnInput($event, 'dataStart')"
                    />
                    <span class="text-white/40">à</span>
                    <input
                        v-model="dataRangeEnd"
                        type="text"
                        placeholder="Z"
                        class="min-w-0 px-2 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500 uppercase font-mono text-center"
                        @input="formatColumnInput($event, 'dataEnd')"
                    />
                </div>
                <p class="text-xs text-white/40">
                    Ex: C à E pour les colonnes C, D, E
                </p>
            </div>

            <!-- Value Suffix -->
            <div class="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                    <PhHash :size="16" class="text-amber-500" />
                    <label class="text-sm font-medium text-white">Suffix des valeurs</label>
                </div>
                <input
                    v-model="valueSuffix"
                    type="text"
                    placeholder="Ex: %, €, k"
                    class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <p class="text-xs text-white/40">
                    Affiché après chaque valeur (laisser vide pour aucun)
                </p>
            </div>
        </section>

        <!-- Séparateur visuel -->
        <div class="border-t border-white/10"></div>

        <!-- Légende -->
        <section class="flex flex-col gap-3">
            <h2 class="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-2">
                <PhInfo :size="16" />
                Légende
            </h2>

            <div class="flex flex-col gap-2 text-sm">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-4 rounded bg-blue-500/20 border border-blue-500/30"></div>
                    <span class="text-white/70">Colonne Label</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-8 h-4 rounded bg-green-500/20 border border-green-500/30"></div>
                    <span class="text-white/70">Colonne Image</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-8 h-4 rounded bg-orange-500/20 border border-orange-500/30"></div>
                    <span class="text-white/70">Colonne Couleur</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-8 h-4 rounded bg-purple-500/20 border border-purple-500/30"></div>
                    <span class="text-white/70">Plage de données</span>
                </div>
            </div>
        </section>

        <!-- Stats -->
        <section class="flex flex-col gap-3">
            <div class="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20">
                    <PhTable :size="20" class="text-purple-400" />
                </div>
                <div class="flex-1">
                    <p class="text-white text-sm font-medium">{{ filledCellsCount }} cellule{{ filledCellsCount > 1 ? 's' : '' }} remplie{{ filledCellsCount > 1 ? 's' : '' }}</p>
                    <p class="text-white/50 text-xs">{{ filledRowsCount }} ligne{{ filledRowsCount > 1 ? 's' : '' }} avec des données</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { PhColumns, PhHash, PhInfo, PhTable } from "@phosphor-icons/vue";
import type { GraphConfig } from "~/types";

const config = defineModel<GraphConfig>({
    required: true,
});

// Initialiser la config default si elle n'existe pas
if (!config.value.default) {
    config.value.default = {
        cells: [],
        labelColumn: "A",
        imageColumn: "B",
        dataRangeStart: "C",
        dataRangeEnd: "Z",
    };
}

const labelColumn = computed({
    get: () => config.value.default?.labelColumn ?? "A",
    set: (value: string) => {
        if (config.value.default) {
            config.value.default.labelColumn = value.toUpperCase();
        }
    },
});

const imageColumn = computed({
    get: () => config.value.default?.imageColumn ?? "B",
    set: (value: string) => {
        if (config.value.default) {
            config.value.default.imageColumn = value.toUpperCase();
        }
    },
});

const colorColumn = computed({
    get: () => config.value.default?.colorColumn ?? "",
    set: (value: string) => {
        if (config.value.default) {
            config.value.default.colorColumn = value.toUpperCase() || undefined;
        }
    },
});

const dataRangeStart = computed({
    get: () => config.value.default?.dataRangeStart ?? "C",
    set: (value: string) => {
        if (config.value.default) {
            config.value.default.dataRangeStart = value.toUpperCase();
        }
    },
});

const dataRangeEnd = computed({
    get: () => config.value.default?.dataRangeEnd ?? "Z",
    set: (value: string) => {
        if (config.value.default) {
            config.value.default.dataRangeEnd = value.toUpperCase();
        }
    },
});

const valueSuffix = computed({
    get: () => config.value.default?.valueSuffix ?? "",
    set: (value: string) => {
        if (config.value.default) {
            config.value.default.valueSuffix = value;
        }
    },
});

// Formater l'input pour n'accepter que des lettres
function formatColumnInput(event: Event, _type: string) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase().replace(/[^A-Z]/g, "");
}

// Stats
const filledCellsCount = computed(() => {
    let count = 0;
    const cells = config.value.default?.cells ?? [];
    cells.forEach((row) => {
        Object.values(row).forEach((value) => {
            if (value !== "" && value !== undefined && value !== null) {
                count++;
            }
        });
    });
    return count;
});

const filledRowsCount = computed(() => {
    const cells = config.value.default?.cells ?? [];
    return cells.filter((row) => {
        return Object.values(row).some((value) => value !== "" && value !== undefined && value !== null);
    }).length;
});
</script>
