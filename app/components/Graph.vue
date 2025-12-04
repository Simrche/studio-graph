<template>
    <div class="graph-container">
        <!-- Loader - visible seulement pendant le chargement -->
        <div v-if="isLoading && !canvas">
            <GraphLoader />
        </div>

        <!-- Message sans ticker - visible seulement si aucun ticker -->
        <div v-if="!isLoading && config.tickers.length === 0">
            <div class="flex items-center justify-center w-full h-full">
                <div
                    class="flex flex-col items-center gap-4 text-center justify-center px-8"
                    style="min-height: 500px"
                >
                    <div
                        class="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center"
                    >
                        <PhChartLine class="w-10 h-10 text-slate-400" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <h3 class="text-xl font-semibold text-slate-700">
                            Aucun ticker sélectionné
                        </h3>
                        <p
                            class="text-slate-500 max-w-md"
                            style="
                                height: 48px;
                                display: flex;
                                align-items: center;
                            "
                        >
                            Ajoutez des tickers dans la barre latérale pour
                            commencer à visualiser les données
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Graph Controls - visible seulement si des données sont chargées -->
        <GraphControls
            v-if="!isLoading && config.tickers.length > 0"
            :is-playing="isAnimating"
            v-model:speed="config.animation.speed"
            v-model:revealMode="config.animation.revealMode"
            v-model:device="config.animation.device"
            @toggle-play-pause="handleTogglePlayPause"
            @restart="restart"
        />

        <!-- Canvas - toujours présent dans le DOM, caché si nécessaire -->
        <div
            class="canvas-wrapper"
            :class="{
                hidden: config.tickers.length === 0,
                'mobile-mode': config.animation.device === 'mobile'
            }"
            :style="{ aspectRatio }"
        >
            <canvas id="graphCanvas" ref="canvas"></canvas>
        </div>

        <!-- Legend Panel - caché si pas de données -->
        <div
            class="legend-panel"
            :class="{
                hidden: isLoading || config.tickers.length === 0,
                'mobile-mode': config.animation.device === 'mobile'
            }"
        >
            <div class="legend-content">
                <div
                    v-for="(company, index) in legendData"
                    :key="index"
                    class="legend-item"
                >
                    <div
                        class="legend-color"
                        :style="{ backgroundColor: company.color }"
                    ></div>
                    <div
                        class="legend-logo-circle"
                        :style="{
                            borderColor: company.color,
                            backgroundColor: company.color,
                        }"
                    >
                        <img
                            v-if="company.logo"
                            :src="company.logo"
                            :alt="company.name"
                        />
                    </div>
                    <span class="legend-name">{{ company.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PhChartLine } from "@phosphor-icons/vue";
import type { GraphConfig } from "~/types";
import { StockChart } from "~/utils/StockChart";
import { graphDataService } from "~/utils/graphDataService";

const config = defineModel<GraphConfig>("config", {
    required: true,
});

const canvas = ref<HTMLCanvasElement | null>(null);
const isLoading = ref(true);
const isAnimating = ref(false);
let chart: StockChart | null = null;
const legendData = ref<Array<{ name: string; logo: string; color: string }>>(
    []
);

// Computed property pour l'aspect ratio basé sur le device
const aspectRatio = computed(() => {
    return config.value.animation.device === 'mobile' ? '9 / 16' : '16 / 9';
});

// Exposer la fonction de rechargement au parent
const reload = async () => {
    if (chart) {
        chart.destroy();
    }
    await initializeGraph();
};

// Redémarrer l'animation
const restart = () => {
    if (chart) {
        chart.restartAnimation();
        isAnimating.value = true;
        // Suivre l'état de l'animation
        checkAnimationState();
    }
};

// Vérifier l'état de l'animation
const checkAnimationState = () => {
    if (chart && chart.isAnimating) {
        requestAnimationFrame(checkAnimationState);
    } else {
        isAnimating.value = false;
    }
};

// Gérer le play/pause
function handleTogglePlayPause() {
    if (!chart) return;

    if (isAnimating.value) {
        chart.pauseAnimation();
        isAnimating.value = false;
    } else {
        // Si l'animation est terminée, on relance au lieu de reprendre
        if (chart.currentFrame >= chart.totalFrames) {
            chart.restartAnimation();
        } else {
            chart.resumeAnimation();
        }
        isAnimating.value = true;
        checkAnimationState();
    }
}

// Watchers pour synchroniser les changements avec le chart
watch(() => config.value.animation.speed, (newSpeed) => {
    if (chart) {
        chart.setAnimationSpeed(newSpeed);
    }
});

watch(() => config.value.animation.revealMode, (newRevealMode) => {
    if (chart) {
        chart.setRevealMode(newRevealMode);
    }
});

watch(() => config.value.animation.device, async (newDevice) => {
    if (chart) {
        chart.setDevice(newDevice);
        // Attendre le prochain tick pour que le DOM soit mis à jour avec le nouvel aspect ratio
        await nextTick();
        chart.setupCanvas();
        chart.draw();
    }
});

defineExpose({
    reload,
    restart,
    isAnimating,
});

const initializeGraph = async () => {
    // Si aucun ticker n'est sélectionné, ne pas charger
    if (config.value.tickers.length === 0) {
        isLoading.value = false;
        return;
    }

    isLoading.value = true;

    // Attendre que le DOM soit mis à jour pour que le canvas soit disponible
    await nextTick();

    if (!canvas.value) {
        isLoading.value = false;
        return;
    }

    try {
        // Créer l'instance du graphique
        chart = new StockChart("graphCanvas", {
            animationSpeed: config.value.animation.speed,
            revealMode: config.value.animation.revealMode,
        });

        // Calculer les données à partir du JSON et de la config
        const processedData = await graphDataService.loadAndProcessData(
            config.value
        );

        // Charger les données dans le chart
        chart.setData(processedData);

        // Mettre à jour la légende
        legendData.value = chart.data.map((company) => ({
            name: company.name,
            logo: company.logo,
            color: company.color,
        }));

        // Précharger les logos et démarrer l'animation
        await chart.preloadLogos();

        // Suivre l'état de l'animation
        isAnimating.value = true;
        checkAnimationState();
    } catch (error) {
        console.error("Erreur lors du chargement du graphique:", error);
    } finally {
        isLoading.value = false;
    }
};

// Gérer le redimensionnement
const handleResize = () => {
    if (chart && !isLoading.value) {
        chart.setupCanvas();
        chart.draw();
    }
};

onMounted(async () => {
    await initializeGraph();
    window.addEventListener("resize", handleResize);
});

// Nettoyer lors du démontage
onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
    if (chart) {
        chart.destroy();
    }
});
</script>

<style scoped>
.graph-container {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    overflow: hidden;
}

.canvas-wrapper {
    position: relative;
    background: #f8fafc;
    width: 100%;
    max-width: 100%;
}

.canvas-wrapper.mobile-mode {
    max-width: 400px;
    margin: 0 auto;
}

.canvas-wrapper.hidden {
    visibility: hidden;
    pointer-events: none;
}

#graphCanvas {
    width: 100%;
    height: 100%;
    display: block;
}

.legend-panel {
    background: white;
    border-top: 1px solid #e2e8f0;
    padding: 2rem;
}

.legend-panel.mobile-mode {
    padding: 1rem;
}

.legend-panel.hidden {
    display: none;
}

.legend-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
}

.legend-color {
    width: 30px;
    height: 3px;
    border-radius: 2px;
}

.legend-logo-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.legend-logo-circle img {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    object-fit: contain;
}

.legend-name {
    font-weight: 500;
    color: #1e293b;
}
</style>
