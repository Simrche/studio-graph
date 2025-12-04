<template>
    <div
        class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8"
    >
        <BackgroundAnimation />

        <!-- Header -->
        <header class="max-w-7xl mx-auto mb-12">
            <div class="flex items-start justify-between">
                <div>
                    <h1 class="text-4xl font-bold text-white mb-2">
                        Mes Graphiques
                    </h1>
                    <p class="text-white/60">
                        Gérez et créez vos graphiques animés
                    </p>
                </div>
                <div class="shrink-0">
                    <UiButton
                        variant="primary"
                        size="sm"
                        @click="createNewGraph"
                    >
                        <template #icon>
                            <PhPlus :size="16" weight="bold" />
                        </template>
                        Nouveau graphique
                    </UiButton>
                </div>
            </div>
        </header>

        <!-- Graphs Grid -->
        <div class="max-w-7xl mx-auto">
            <div
                v-if="graphs?.length === 0"
                class="flex flex-col items-center justify-center py-24"
            >
                <PhChartLine
                    :size="80"
                    weight="thin"
                    class="text-white/20 mb-6"
                />
                <h2 class="text-2xl font-semibold text-white/60 mb-2">
                    Aucun graphique
                </h2>
                <p class="text-white/40 mb-8">
                    Créez votre premier graphique pour commencer
                </p>

                <div class="w-64">
                    <UiButton variant="primary" @click="createNewGraph">
                        <template #icon>
                            <PhPlus :size="20" weight="bold" />
                        </template>
                        Créer un graphique
                    </UiButton>
                </div>
            </div>

            <div
                v-else-if="graphs"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <GraphCard
                    v-for="graph in graphs"
                    :key="graph.id"
                    :graph="graph"
                    @click="openGraph(graph.id)"
                    @delete="deleteGraph(graph.id)"
                />
            </div>

            <div v-else>
                <p>Chargement...</p>
            </div>
        </div>

        <UiToast />
    </div>
</template>

<script setup lang="ts">
import { PhPlus, PhChartLine } from "@phosphor-icons/vue";
import type { Graph, GraphConfig } from "~/types";

const supabase = useSupabaseClient<any>();
const user = useSupabaseUser();

const { data: graphs, refresh } = await useAsyncData("graphs", async () => {
    const { data, error } = await supabase
        .from("graphs")
        .select("*")
        .is("deleted_at", null);

    if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message });
    }

    return data as unknown as Graph[];
});

async function createNewGraph() {
    if (!user.value?.sub) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const config: GraphConfig = {
        animation: {
            speed: 0.5,
            revealMode: true,
            device: "desktop",
        },
        data: {
            displayMode: "percentage" as
                | "percentage"
                | "price"
                | "initialAmount",
            startDate: "2023-01-01",
            initialAmount: 1000,
        },
        tickers: [],
    };

    const { data, error } = await supabase
        .from("graphs")
        .insert({
            user_id: user.value.sub,
            updated_at: new Date().toISOString(),
            config,
        })
        .select()
        .single();

    if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message });
    }

    navigateTo(`/studio?id=${data.id}`);
}

function openGraph(id: number) {
    navigateTo(`/studio?id=${id}`);
}

async function deleteGraph(id: number) {
    const { error } = await supabase
        .from("graphs")
        .update({
            deleted_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message });
    }

    refresh();
}
</script>
