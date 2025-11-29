<template>
    <div class="graph-container">
        <div class="canvas-wrapper">
            <canvas id="graphCanvas" ref="canvas"></canvas>
        </div>

        <!-- Legend Panel -->
        <div class="legend-panel">
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
                        <img :src="company.logo" :alt="company.name" />
                    </div>
                    <span class="legend-name">{{ company.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { StockChart } from "~/utils/StockChart";

const canvas = ref<HTMLCanvasElement | null>(null);
let chart: StockChart | null = null;
const legendData = ref<Array<{ name: string; logo: string; color: string }>>(
    []
);

onMounted(async () => {
    if (!canvas.value || (true as boolean)) return;

    // Créer l'instance du graphique
    chart = new StockChart("graphCanvas");

    // Charger les données depuis le JSON public
    await chart.loadData("/exemple.json");

    // Mettre à jour la légende
    legendData.value = chart.data.map((company) => ({
        name: company.name,
        logo: company.logo,
        color: company.color,
    }));

    // Gérer le redimensionnement
    const handleResize = () => {
        if (chart) {
            chart.setupCanvas();
            chart.draw();
        }
    };

    window.addEventListener("resize", handleResize);

    // Nettoyer l'écouteur lors du démontage
    onUnmounted(() => {
        window.removeEventListener("resize", handleResize);
        if (chart) {
            chart.destroy();
        }
    });
});
</script>

<style scoped>
.graph-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    aspect-ratio: 16 / 9;
    max-height: 100%;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    overflow: hidden;
}

.canvas-wrapper {
    flex: 1;
    position: relative;
    background: #f8fafc;
    min-height: 0;
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
