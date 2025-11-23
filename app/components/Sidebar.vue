<template>
    <aside class="sidebar">
        <!-- Header -->
        <div class="sidebar-header">
            <h1 class="sidebar-title"><span>🎬</span> Studio</h1>
            <p class="sidebar-subtitle">Visualisation et contrôle</p>
        </div>

        <div class="sidebar-content">
            <!-- Animation Controls -->
            <section class="section">
                <h2 class="section-title">
                    <svg
                        class="section-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        ></path>
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                    Animation
                </h2>

                <div class="controls">
                    <button class="replay-btn">
                        <svg
                            class="btn-icon"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                        >
                            <path
                                d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM164.49,99.51a12,12,0,0,1,0,17l-32,32a12,12,0,0,1-17-17L131,116H104a36,36,0,0,0,0,72,12,12,0,0,1,0,24,60,60,0,0,1,0-120h27l-15.52-15.51a12,12,0,0,1,17-17Z"
                            ></path>
                        </svg>
                        Rejouer l'animation
                    </button>

                    <div class="control-box">
                        <div class="control-header">
                            <span>Vitesse</span>
                            <span class="control-value">0.5x</span>
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value="0.5"
                            class="slider"
                        />
                    </div>

                    <div class="control-box toggle-box">
                        <label for="revealMode" class="toggle-label"
                            >Mode Révélation</label
                        >
                        <div class="toggle-wrapper">
                            <input
                                type="checkbox"
                                id="revealMode"
                                checked
                                class="toggle-input"
                            />
                            <label
                                for="revealMode"
                                class="toggle-switch"
                            ></label>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Configuration -->
            <section class="section">
                <h2 class="section-title">
                    <svg
                        class="section-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        ></path>
                    </svg>
                    Données
                </h2>

                <div class="controls">
                    <button class="format-btn active">
                        <svg
                            class="btn-icon"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                        >
                            <path
                                d="M205.66,61.64l-144,144a8,8,0,0,1-11.32-11.32l144-144a8,8,0,0,1,11.32,11.31ZM50.54,101.44a36,36,0,0,1,50.92-50.91,8,8,0,1,0,11.32-11.32,52,52,0,0,0-73.56,73.56,8,8,0,0,0,11.32-11.32Zm152,53.12a52,52,0,0,0-73.56,0,8,8,0,0,0,11.32,11.32,36,36,0,0,1,50.92,50.91,8,8,0,0,0,11.32,11.32,52,52,0,0,0,0-73.56Z"
                            ></path>
                        </svg>
                        <span>Pourcentage</span>
                    </button>
                    <button class="format-btn">
                        <svg
                            class="btn-icon"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                        >
                            <path
                                d="M152,120h48a8,8,0,0,0,0-16H152a8,8,0,0,0,0,16Zm48,16H152a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16Zm-64,40a8,8,0,0,0,8-8V88a8,8,0,0,0-16,0v80A8,8,0,0,0,136,176ZM72,112H56v-8a8,8,0,0,0-16,0v8H24a8,8,0,0,0,0,16H40v40H24a8,8,0,0,0,0,16H40a32,32,0,0,0,64,0V128A16,16,0,0,0,72,112Zm0,72a16,16,0,0,1-16-16V128h16v56Z"
                            ></path>
                        </svg>
                        <span>Prix</span>
                    </button>
                    <button class="format-btn">
                        <svg
                            class="btn-icon"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                        >
                            <path
                                d="M240,128a8,8,0,0,1-8,8H204.94l-37.78,75.58A8,8,0,0,1,160,216h-.4a8,8,0,0,1-7.08-5.14L95.35,60.76,63.28,131.31A8,8,0,0,1,56,136H24a8,8,0,0,1,0-16H50.85L88.72,36.69a8,8,0,0,1,14.76.46l57.51,151,31.85-63.71A8,8,0,0,1,200,120h32A8,8,0,0,1,240,128Z"
                            ></path>
                        </svg>
                        <span>Mise de départ</span>
                    </button>

                    <div class="date-control">
                        <label class="input-label">Date de début</label>
                        <input
                            type="date"
                            value="2023-01-01"
                            class="date-input"
                        />
                        <div class="date-info">Période: 1 an</div>
                    </div>
                </div>
            </section>

            <!-- Tickers -->
            <section class="section tickers-section">
                <h2 class="section-title">
                    <svg
                        class="section-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        ></path>
                    </svg>
                    Lignes
                    <span v-if="tickers.length > 0" class="ticker-count"
                        >({{ tickers.length }})</span
                    >
                </h2>

                <div class="search-wrapper">
                    <svg
                        class="search-icon"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                    >
                        <path
                            d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                        ></path>
                    </svg>
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Ajouter un ticker..."
                        class="search-input"
                        @focus="showSearchResults = true"
                    />

                    <!-- Dropdown de résultats de recherche -->
                    <Transition name="dropdown">
                        <div
                            v-if="showSearchResults && searchQuery.length >= 2"
                            class="search-results"
                        >
                            <div v-if="isSearching" class="search-state">
                                <div class="loading-spinner"></div>
                                <span>Recherche...</span>
                            </div>
                            <div
                                v-else-if="searchResults.length === 0"
                                class="search-state"
                            >
                                <svg
                                    class="empty-icon"
                                    fill="currentColor"
                                    viewBox="0 0 256 256"
                                >
                                    <path
                                        d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"
                                    ></path>
                                </svg>
                                Aucun résultat
                            </div>
                            <div v-else class="results-container">
                                <div
                                    v-for="ticker in searchResults"
                                    :key="ticker.symbol"
                                    class="search-result-item"
                                    @click="addTicker(ticker)"
                                >
                                    <div class="result-content">
                                        <div class="result-icon">
                                            <span class="result-initials">
                                                {{
                                                    ticker.symbol
                                                        ?.substring(0, 2)
                                                        .toUpperCase()
                                                }}
                                            </span>
                                        </div>
                                        <div class="result-info">
                                            <div class="result-symbol">
                                                {{ ticker.symbol }}
                                            </div>
                                            <div class="result-name">
                                                {{
                                                    ticker.shortname ||
                                                    ticker.longname ||
                                                    ticker.symbol
                                                }}
                                            </div>
                                        </div>
                                    </div>
                                    <svg
                                        class="result-add-icon"
                                        fill="currentColor"
                                        viewBox="0 0 256 256"
                                    >
                                        <path
                                            d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-88a8,8,0,0,1-8,8H136v24a8,8,0,0,1-16,0V136H96a8,8,0,0,1,0-16h24V96a8,8,0,0,1,16,0v24h24A8,8,0,0,1,168,128Z"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>

                <div v-if="tickers.length === 0" class="empty-state">
                    <svg
                        class="empty-state-icon"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                    >
                        <path
                            d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"
                        ></path>
                    </svg>
                    <p class="empty-state-text">Aucun ticker sélectionné</p>
                </div>

                <div v-else class="tickers-list-wrapper">
                    <div class="tickers-list">
                        <TickerItem
                            v-for="(ticker, index) in tickers"
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
        <div class="sidebar-footer">
            <button class="save-btn">
                <svg class="btn-icon" fill="currentColor" viewBox="0 0 256 256">
                    <path
                        d="M219.31,72,184,36.69A15.86,15.86,0,0,0,172.69,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V83.31A15.86,15.86,0,0,0,219.31,72ZM168,208H88V152h80Zm40,0H184V152a16,16,0,0,0-16-16H88a16,16,0,0,0-16,16v56H48V48H172.69L208,83.31ZM160,72a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h56A8,8,0,0,1,160,72Z"
                    ></path>
                </svg>
                Sauvegarder
            </button>
        </div>
    </aside>
</template>

<script setup lang="ts">
import type { TickerData } from "../types";
import TickerItem from "./TickerItem.vue";

// État réactif
const searchQuery = ref("");
const showSearchResults = ref(false);
const searchResults = ref<any[]>([]);
const isSearching = ref(false);
const tickers = ref<TickerData[]>([]);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

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
    if (tickers.value.some((t: TickerData) => t.symbol === symbol)) {
        alert("Ce ticker est déjà dans la liste !");
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

        tickers.value.push({
            symbol,
            name,
            color,
            logoUrl: (logoData as any)?.logoUrl || null,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du logo:", error);
        // Ajouter quand même le ticker sans logo
        tickers.value.push({
            symbol,
            name,
            color,
            logoUrl: null,
        });
    }
};

// Fonction pour supprimer un ticker
const removeTicker = (index: number) => {
    tickers.value.splice(index, 1);
};

// Fonction pour mettre à jour la couleur d'un ticker
const updateTickerColor = (index: number, color: string) => {
    if (tickers.value[index]) {
        tickers.value[index].color = color;
    }
};

// Fermer les résultats de recherche quand on clique ailleurs
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".search-wrapper")) {
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
/* Sidebar */
.sidebar {
    width: 384px;
    height: 100vh;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(40px);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
}

.sidebar-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 0.25rem 0;
}

.sidebar-subtitle {
    color: #d8b4fe;
    font-size: 0.875rem;
    margin: 0;
}

.sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1.5rem 1.5rem 200px 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    min-height: 0;
}

/* Custom scrollbar */
.sidebar-content::-webkit-scrollbar {
    width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* Sections */
.section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.section-title {
    font-size: 0.75rem;
    font-weight: bold;
    color: #d8b4fe;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.section-icon {
    width: 1rem;
    height: 1rem;
}

.ticker-count {
    font-size: 0.75rem;
    opacity: 0.7;
    font-weight: normal;
}

/* Controls */
.controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Replay Button */
.replay-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.75rem;
    color: white;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s;
}

.replay-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
}

.btn-icon {
    width: 1.25rem;
    height: 1.25rem;
}

/* Control Box */
.control-box {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    padding: 1rem;
}

.control-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ddd6fe;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.control-value {
    font-weight: bold;
    color: white;
}

/* Slider */
.slider {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.3);
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    border: none;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

/* Toggle */
.toggle-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.toggle-label {
    color: white;
    font-weight: 500;
    cursor: pointer;
}

.toggle-wrapper {
    position: relative;
    width: 48px;
    height: 24px;
}

.toggle-input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-switch {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #cbd5e0;
    border-radius: 24px;
    transition: 0.3s;
}

.toggle-switch::before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.3s;
}

.toggle-input:checked + .toggle-switch {
    background-color: #a855f7;
}

.toggle-input:checked + .toggle-switch::before {
    transform: translateX(24px);
}

/* Format Buttons */
.format-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    color: white;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s;
    font-size: 0.875rem;
}

.format-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.format-btn.active {
    background: #a855f7;
    border-color: #a855f7;
    box-shadow: 0 10px 25px rgba(168, 85, 247, 0.3);
}

/* Date Control */
.date-control {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.input-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #d8b4fe;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.date-input {
    width: 100%;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    color: white;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s;
    color-scheme: dark;
}

.date-input:focus {
    border-color: #a855f7;
}

.date-info {
    text-align: center;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.05);
    padding: 0.25rem;
    border-radius: 0.25rem;
}

/* Tickers Section */
.tickers-section {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.search-wrapper {
    position: relative;
    z-index: 10;
}

.search-input {
    width: 100%;
    padding: 0.625rem 1rem 0.625rem 2.75rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(168, 85, 247, 0.2);
    border-radius: 0.75rem;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    outline: none;
    transition: all 0.3s ease;
}

.search-input::placeholder {
    color: rgba(255, 255, 255, 0.4);
}

.search-input:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(168, 85, 247, 0.3);
}

.search-input:focus {
    background: rgba(255, 255, 255, 0.1);
    border-color: #a855f7;
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
}

.search-icon {
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.125rem;
    height: 1.125rem;
    color: rgba(168, 85, 247, 0.5);
    transition: color 0.3s ease;
    pointer-events: none;
    z-index: 1;
}

.search-wrapper:has(.search-input:focus) .search-icon {
    color: #a855f7;
}

/* Search Results Dropdown */
.search-results {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    background: rgba(15, 23, 42, 0.98);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(168, 85, 247, 0.2);
    border-radius: 0.75rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(168, 85, 247, 0.1);
    max-height: 16rem;
    overflow: hidden;
    z-index: 50;
}

.results-container {
    max-height: 16rem;
    overflow-y: auto;
}

.results-container::-webkit-scrollbar {
    width: 4px;
}

.results-container::-webkit-scrollbar-track {
    background: transparent;
}

.results-container::-webkit-scrollbar-thumb {
    background: rgba(168, 85, 247, 0.3);
    border-radius: 2px;
}

.results-container::-webkit-scrollbar-thumb:hover {
    background: rgba(168, 85, 247, 0.5);
}

.search-state {
    padding: 1.5rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    flex-direction: column;
}

.loading-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(168, 85, 247, 0.2);
    border-top-color: #a855f7;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.empty-icon {
    width: 2rem;
    height: 2rem;
    color: rgba(255, 255, 255, 0.2);
}

.search-result-item {
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    transition: all 0.2s ease;
    position: relative;
}

.search-result-item:last-child {
    border-bottom: none;
}

.search-result-item::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, #a855f7, #ec4899);
    opacity: 0;
    transition: opacity 0.2s;
}

.search-result-item:hover {
    background: rgba(168, 85, 247, 0.1);
}

.search-result-item:hover::before {
    opacity: 1;
}

.result-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
}

.result-icon {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(168, 85, 247, 0.2);
}

.result-initials {
    color: white;
    font-weight: bold;
    font-size: 0.75rem;
    letter-spacing: 0.5px;
}

.result-info {
    flex: 1;
    min-width: 0;
}

.result-symbol {
    color: white;
    font-weight: 700;
    font-size: 0.875rem;
    letter-spacing: 0.5px;
}

.result-name {
    color: #c4b5fd;
    font-size: 0.75rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 2px;
}

.result-add-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: #a855f7;
    opacity: 0;
    transform: scale(0.8);
    transition: opacity 0.2s, transform 0.2s;
    flex-shrink: 0;
}

.search-result-item:hover .result-add-icon {
    opacity: 1;
    transform: scale(1);
    color: #c084fc;
}

/* Dropdown animation */
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

/* Ticker Logo Image */
.ticker-logo-container {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 0.5rem;
    overflow: hidden;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ticker-logo-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 4px;
}

.ticker-logo-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* List transitions for tickers */
.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.list-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

.list-leave-active {
    position: absolute;
    width: 100%;
}

/* Empty State */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    gap: 1rem;
    background: rgba(168, 85, 247, 0.03);
    border: 2px dashed rgba(168, 85, 247, 0.2);
    border-radius: 0.75rem;
    animation: pulse-border 3s ease-in-out infinite;
}

@keyframes pulse-border {
    0%,
    100% {
        border-color: rgba(168, 85, 247, 0.2);
    }
    50% {
        border-color: rgba(168, 85, 247, 0.35);
    }
}

.empty-state-icon {
    width: 3rem;
    height: 3rem;
    color: rgba(168, 85, 247, 0.3);
    animation: float 3s ease-in-out infinite;
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

.empty-state-text {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
    margin: 0;
}

/* Tickers List */
.tickers-list-wrapper {
    display: flex;
    flex-direction: column;
    padding-bottom: 1rem;
}

.tickers-list {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    padding-right: 0.5rem;
}

.tickers-list-wrapper::-webkit-scrollbar {
    width: 6px;
}

.tickers-list-wrapper::-webkit-scrollbar-track {
    background: rgba(168, 85, 247, 0.05);
    border-radius: 3px;
}

.tickers-list-wrapper::-webkit-scrollbar-thumb {
    background: rgba(168, 85, 247, 0.3);
    border-radius: 3px;
}

.tickers-list-wrapper::-webkit-scrollbar-thumb:hover {
    background: rgba(168, 85, 247, 0.5);
}

.ticker-item {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(168, 85, 247, 0.1);
    border-radius: 0.75rem;
    padding: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.875rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.ticker-item::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
        135deg,
        rgba(168, 85, 247, 0.05) 0%,
        rgba(236, 72, 153, 0.05) 100%
    );
    opacity: 0;
    transition: opacity 0.3s;
}

.ticker-item:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(168, 85, 247, 0.3);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.15);
}

.ticker-item:hover::before {
    opacity: 1;
}

.ticker-initials {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 0.875rem;
    letter-spacing: 0.5px;
}

.ticker-info {
    flex: 1;
    min-width: 0;
    position: relative;
    z-index: 1;
}

.ticker-symbol {
    color: white;
    font-weight: 700;
    font-size: 0.875rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0.5px;
}

.ticker-name {
    color: #c4b5fd;
    font-size: 0.75rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 2px;
    opacity: 0.9;
}

.ticker-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    z-index: 1;
}

/* Color Picker */
.color-picker-wrapper {
    position: relative;
    width: 36px;
    height: 36px;
}

.color-input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
}

.color-display {
    width: 36px;
    height: 36px;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    cursor: pointer;
}

.color-display:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(168, 85, 247, 0.4);
    transform: scale(1.05);
}

.color-circle {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
}

.color-display:hover .color-circle {
    transform: scale(1.1);
}

/* Delete Button */
.delete-btn {
    width: 36px;
    height: 36px;
    border-radius: 0.5rem;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #fca5a5;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.delete-btn:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);
    color: #f87171;
    transform: scale(1.05);
}

.delete-btn:active {
    transform: scale(0.95);
}

.delete-btn svg {
    width: 1.125rem;
    height: 1.125rem;
}

/* Sidebar Footer */
.sidebar-footer {
    padding: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
}

/* Save Button */
.save-btn {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(to right, #a855f7, #9333ea);
    border: none;
    border-radius: 0.75rem;
    color: white;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 10px 25px rgba(168, 85, 247, 0.3);
    transition: all 0.2s;
}

.save-btn:hover {
    background: linear-gradient(to right, #9333ea, #7e22ce);
    transform: scale(1.02);
}

.save-btn:active {
    transform: scale(0.98);
}
</style>
