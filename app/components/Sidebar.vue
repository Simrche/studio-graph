<template>
    <aside
        class="w-96 h-screen bg-black/20 backdrop-blur-[40px] border-r border-white/10 flex flex-col overflow-hidden"
    >
        <!-- Header -->
        <div class="p-6 border-b border-white/10 bg-white/5">
            <h1
                class="text-2xl font-bold text-white flex items-center gap-2 mb-1"
            >
                <span>🎬</span> Studio
            </h1>
            <p class="text-violet-300 text-sm">Visualisation et contrôle</p>
        </div>

        <div
            class="flex-1 overflow-y-auto overflow-x-hidden px-6 pb-[300px] pt-6 flex flex-col gap-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-white/30"
        >
            <!-- Animation Controls -->
            <section class="flex flex-col gap-4">
                <h2
                    class="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-2"
                >
                    <PhPlayCircle :size="16" />
                    Animation
                </h2>

                <div class="flex flex-col gap-4">
                    <UiSlider
                        label="Vitesse"
                        v-model="config.animation.speed"
                        :min="0.1"
                        :max="3"
                        :step="0.1"
                        suffix="x"
                    />

                    <UiToggle
                        label="Mode Révélation"
                        v-model="config.animation.revealMode"
                    />
                </div>
            </section>

            <!-- Configuration -->
            <section class="flex flex-col gap-4">
                <h2
                    class="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-2"
                >
                    <PhSlidersHorizontal :size="16" />
                    Données
                </h2>

                <div class="flex flex-col gap-4">
                    <UiButton
                        :variant="
                            config.data.displayMode === 'percentage'
                                ? 'active'
                                : 'secondary'
                        "
                        @click="config.data.displayMode = 'percentage'"
                    >
                        <template #icon>
                            <PhPercent :size="20" weight="fill" />
                        </template>
                        Pourcentage
                    </UiButton>

                    <UiButton
                        :variant="
                            config.data.displayMode === 'price'
                                ? 'active'
                                : 'secondary'
                        "
                        @click="config.data.displayMode = 'price'"
                    >
                        <template #icon>
                            <PhCurrencyDollar :size="20" weight="fill" />
                        </template>
                        Prix
                    </UiButton>

                    <UiButton
                        :variant="
                            config.data.displayMode === 'initial'
                                ? 'active'
                                : 'secondary'
                        "
                        @click="config.data.displayMode = 'initial'"
                    >
                        <template #icon>
                            <PhChartLine :size="20" weight="fill" />
                        </template>
                        Mise de départ
                    </UiButton>

                    <Transition
                        enter-active-class="transition-all duration-300 ease-out"
                        enter-from-class="opacity-0 -translate-y-2 max-h-0"
                        enter-to-class="opacity-100 translate-y-0 max-h-96"
                        leave-active-class="transition-all duration-200 ease-in"
                        leave-from-class="opacity-100 translate-y-0 max-h-96"
                        leave-to-class="opacity-0 -translate-y-2 max-h-0"
                    >
                        <div
                            v-if="config.data.displayMode === 'initial'"
                            class="flex flex-col gap-2 overflow-hidden"
                        >
                            <label
                                class="text-xs font-semibold text-violet-300 uppercase tracking-wider"
                            >
                                Montant initial ($)
                            </label>
                            <div class="relative">
                                <PhCurrencyDollar
                                    :size="18"
                                    weight="bold"
                                    class="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500/50 pointer-events-none"
                                />
                                <input
                                    type="number"
                                    v-model.number="config.data.initialAmount"
                                    min="0"
                                    step="100"
                                    class="w-full px-4 pl-10 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm outline-none transition-all duration-200 [color-scheme:dark] focus:border-purple-500 focus:bg-white/10"
                                    placeholder="1000"
                                />
                            </div>
                        </div>
                    </Transition>

                    <div class="flex flex-col gap-2">
                        <label
                            class="text-xs font-semibold text-violet-300 uppercase tracking-wider"
                        >
                            Date de début
                        </label>
                        <input
                            type="date"
                            v-model="config.data.startDate"
                            class="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm outline-none transition-all duration-200 [color-scheme:dark] focus:border-purple-500"
                        />
                        <div
                            class="text-center text-xs text-white/50 bg-white/5 py-1 rounded"
                        >
                            Période: {{ datePeriod }}
                        </div>
                    </div>
                </div>
            </section>

            <!-- Tickers -->
            <section class="flex-1 min-h-0 flex flex-col gap-4">
                <h2
                    class="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-2"
                >
                    <PhTrendUp :size="16" />
                    Lignes
                    <span
                        v-if="config.tickers.length > 0"
                        class="text-xs opacity-70 font-normal"
                    >
                        ({{ config.tickers.length }})
                    </span>
                </h2>

                <div class="relative z-10">
                    <PhMagnifyingGlass
                        :size="18"
                        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500/50 pointer-events-none z-10 transition-colors duration-300"
                        :class="{ 'text-purple-500': showSearchResults }"
                    />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Ajouter un ticker..."
                        @focus="showSearchResults = true"
                        class="w-full py-2.5 pl-11 pr-4 bg-white/5 border border-purple-500/20 rounded-xl text-white text-sm font-medium outline-none transition-all duration-300 placeholder:text-white/40 hover:bg-white/8 hover:border-purple-500/30 focus:bg-white/10 focus:border-purple-500 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.1)]"
                    />

                    <!-- Dropdown de résultats de recherche -->
                    <Transition name="dropdown">
                        <div
                            v-if="showSearchResults && searchQuery.length >= 2"
                            class="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-slate-900/98 backdrop-blur-xl border border-purple-500/20 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(168,85,247,0.1)] max-h-64 overflow-hidden z-50"
                        >
                            <div
                                v-if="isSearching"
                                class="p-6 text-center text-white/50 text-sm flex items-center justify-center gap-3 flex-col"
                            >
                                <div
                                    class="w-6 h-6 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"
                                ></div>
                                <span>Recherche...</span>
                            </div>
                            <div
                                v-else-if="searchResults.length === 0"
                                class="p-6 text-center text-white/50 text-sm flex items-center justify-center gap-3 flex-col"
                            >
                                <PhInfo
                                    :size="32"
                                    class="text-white/20"
                                    weight="fill"
                                />
                                Aucun résultat
                            </div>
                            <div
                                v-else
                                class="max-h-64 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-purple-500/30 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-purple-500/50"
                            >
                                <div
                                    v-for="ticker in searchResults"
                                    :key="ticker.symbol"
                                    @click="addTicker(ticker)"
                                    class="px-4 py-3 flex items-center justify-between cursor-pointer border-b border-white/[0.03] last:border-b-0 transition-all duration-200 relative before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:to-pink-500 before:opacity-0 before:transition-opacity hover:bg-purple-500/10 hover:before:opacity-100"
                                >
                                    <div
                                        class="flex items-center gap-3 flex-1 min-w-0"
                                    >
                                        <div
                                            class="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_4px_10px_rgba(168,85,247,0.2)]"
                                        >
                                            <span
                                                class="text-white font-bold text-xs tracking-wide"
                                            >
                                                {{
                                                    ticker.symbol
                                                        ?.substring(0, 2)
                                                        .toUpperCase()
                                                }}
                                            </span>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div
                                                class="text-white font-bold text-sm tracking-wide"
                                            >
                                                {{ ticker.symbol }}
                                            </div>
                                            <div
                                                class="text-violet-300 text-xs overflow-hidden text-ellipsis whitespace-nowrap mt-0.5"
                                            >
                                                {{
                                                    ticker.shortname ||
                                                    ticker.longname ||
                                                    ticker.symbol
                                                }}
                                            </div>
                                        </div>
                                    </div>
                                    <PhPlusCircle
                                        :size="24"
                                        weight="fill"
                                        class="text-purple-500 flex-shrink-0 opacity-0 scale-80 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-hover:text-purple-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>

                <div
                    v-if="config.tickers.length === 0"
                    class="flex flex-col items-center justify-center p-12 gap-4 bg-purple-500/[0.03] border-2 border-dashed border-purple-500/20 rounded-xl animate-[pulse-border_3s_ease-in-out_infinite]"
                >
                    <PhInfo
                        :size="48"
                        weight="fill"
                        class="text-purple-500/30 animate-[float_3s_ease-in-out_infinite]"
                    />
                    <p class="text-white/50 text-sm font-medium text-center">
                        Aucun ticker sélectionné
                    </p>
                </div>

                <div v-else class="flex flex-col pb-4">
                    <div class="flex flex-col gap-2.5">
                        <TickerItem
                            v-for="(ticker, index) in config.tickers"
                            :key="ticker.symbol"
                            :ticker="ticker"
                            @remove="removeTicker(index)"
                            @update-color="
                                (color) => updateTickerColor(index, color)
                            "
                        />
                    </div>
                </div>
            </section>
        </div>

        <!-- Save Button (fixed at bottom) -->
        <div class="p-6 border-t border-white/10 bg-black/20">
            <UiButton variant="active">
                <template #icon>
                    <PhFloppyDisk :size="20" weight="fill" />
                </template>
                Sauvegarder
            </UiButton>
        </div>
    </aside>
</template>

<script setup lang="ts">
import {
    PhPlayCircle,
    PhArrowClockwise,
    PhSlidersHorizontal,
    PhPercent,
    PhCurrencyDollar,
    PhChartLine,
    PhTrendUp,
    PhMagnifyingGlass,
    PhInfo,
    PhPlusCircle,
    PhFloppyDisk,
} from "@phosphor-icons/vue";
import type { TickerData } from "../types";
import TickerItem from "./TickerItem.vue";
import UiButton from "./ui/UiButton.vue";
import UiSlider from "./ui/UiSlider.vue";
import UiToggle from "./ui/UiToggle.vue";

// Configuration centralisée
const config = ref({
    animation: {
        speed: 0.5,
        revealMode: true,
    },
    data: {
        displayMode: "percentage" as "percentage" | "price" | "initial",
        startDate: "2023-01-01",
        initialAmount: 1000,
    },
    tickers: [] as TickerData[],
});

// États pour la recherche
const searchQuery = ref("");
const showSearchResults = ref(false);
const searchResults = ref<any[]>([]);
const isSearching = ref(false);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

// Période calculée
const datePeriod = computed(() => {
    const start = new Date(config.value.data.startDate);
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

// Fonction pour générer une couleur aléatoire
const generateRandomColor = () => {
    return (
        "#" +
        Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
    );
};

// Watcher pour la recherche avec debounce
watch(searchQuery, (newQuery) => {
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    if (newQuery.length < 2) {
        searchResults.value = [];
        showSearchResults.value = false;
        return;
    }

    isSearching.value = true;
    showSearchResults.value = true;

    searchTimeout = setTimeout(async () => {
        try {
            const response = await $fetch("/api/get-tickers", {
                params: { search: newQuery },
            });

            searchResults.value = (response as any).quotes || [];
            isSearching.value = false;
        } catch (error) {
            console.error("Erreur lors de la recherche:", error);
            searchResults.value = [];
            isSearching.value = false;
        }
    }, 500);
});

// Fonction pour ajouter un ticker
const addTicker = async (tickerResult: any) => {
    const symbol = tickerResult.symbol;
    const name = tickerResult.shortname || tickerResult.longname || symbol;

    // Vérifier si le ticker n'est pas déjà ajouté
    if (config.value.tickers.some((t: TickerData) => t.symbol === symbol)) {
        // error("Ce ticker est déjà dans la liste !");
        return;
    }

    // Masquer les résultats et réinitialiser la recherche
    showSearchResults.value = false;
    searchQuery.value = "";

    // Générer une couleur aléatoire
    const color = generateRandomColor();

    try {
        // Récupérer le logo
        const logoData = await $fetch("/api/get-ticker-logo", {
            params: { symbol },
        });

        config.value.tickers.push({
            symbol,
            name,
            color,
            logoUrl: (logoData as any)?.logoUrl || null,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du logo:", error);
        // Ajouter quand même le ticker sans logo
        config.value.tickers.push({
            symbol,
            name,
            color,
            logoUrl: null,
        });
    }
};

// Fonction pour supprimer un ticker
const removeTicker = (index: number) => {
    config.value.tickers.splice(index, 1);
};

// Fonction pour mettre à jour la couleur d'un ticker
const updateTickerColor = (index: number, color: string) => {
    if (config.value.tickers[index]) {
        config.value.tickers[index].color = color;
    }
};

// Fermer les résultats de recherche quand on clique ailleurs
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".relative.z-10")) {
        showSearchResults.value = false;
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
@keyframes pulse-border {
    0%,
    100% {
        border-color: rgba(168, 85, 247, 0.2);
    }
    50% {
        border-color: rgba(168, 85, 247, 0.35);
    }
}

@keyframes float {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-8px);
    }
}

.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.3s ease;
}

.dropdown-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}
</style>
