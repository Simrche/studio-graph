<template>
    <div class="studio-page">
        <Sidebar />

        <!-- Main Canvas Area -->
        <main class="main-content">
            <div class="graph-section">
                <Graph />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import Graph from "~/components/Graph.vue";
import Sidebar from "~/components/sidebar/Sidebar.vue";
</script>

<style scoped>
.studio-page {
    min-height: 100vh;
    background: linear-gradient(to bottom right, #0f172a, #581c87, #0f172a);
    display: flex;
    overflow: hidden;
}

/* Main Content */
.main-content {
    flex: 1;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 0;
    overflow: auto;
}

.graph-section {
    width: 100%;
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
