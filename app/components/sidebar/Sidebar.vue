<template>
    <aside
        class="w-96 h-screen bg-black/20 backdrop-blur-[40px] border-r border-white/10 flex flex-col overflow-hidden"
    >
        <SidebarHeader v-model="name" />

        <SidebarStocks v-if="type === 'stocks'" v-model="config" />
        <SidebarDefault v-else v-model="config" />

        <div class="p-6 border-t border-white/10 bg-black/20">
            <UiButton
                variant="active"
                :disabled="!hasChanges"
                :loading="loading"
                @click="$emit('apply')"
            >
                <template #icon>
                    <PhCheck :size="20" weight="bold" />
                </template>
                Appliquer
            </UiButton>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { PhCheck } from "@phosphor-icons/vue";
import type { GraphConfig, GraphType } from "~/types";

const config = defineModel<GraphConfig>({
    required: true,
});

const name = defineModel<string | null>("name");

defineProps<{
    type: GraphType;
    hasChanges: boolean;
    loading: boolean;
}>();

defineEmits<{
    apply: [];
}>();
</script>
