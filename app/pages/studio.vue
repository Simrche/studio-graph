<template>
    <div class="studio-page">
        <div class="header">
            <h1>🎬 Studio - Graphique Animé</h1>
            <p class="subtitle">Visualisation des données financières</p>
        </div>

        <div class="graph-section">
            <Graph />
        </div>
    </div>
</template>

<script setup lang="ts">
import Graph from "~/components/Graph.vue";
</script>

<style scoped>
.studio-page {
    min-height: 100vh;
    background: linear-gradient(to bottom right, #0f172a, #581c87, #0f172a);
    padding: 2rem;
    display: flex;
    flex-direction: column;
}

.header {
    text-align: center;
    margin-bottom: 2rem;
}

.header h1 {
    color: white;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.subtitle {
    color: #d8b4fe;
    font-size: 1rem;
}

.graph-section {
    flex: 1;
    display: flex;
    min-height: 0;
}
</style>
