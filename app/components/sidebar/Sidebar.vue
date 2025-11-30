<template>
    <aside
        class="w-96 h-screen bg-black/20 backdrop-blur-[40px] border-r border-white/10 flex flex-col overflow-hidden"
    >
        <SidebarHeader />

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
                    <SidebarSpeed v-model="config.animation.speed" />
                    <SidebarMode v-model="config.animation.revealMode" />
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
                    <SidebarDataMode v-model="config.data.displayMode" />
                    <SidebarInitialAmount v-model="config.data" />
                    <SidebarDatePicker v-model="config.data.startDate" />
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

                <SidebarTickers v-model="config.tickers" />
            </section>
        </div>

        <div class="p-6 border-t border-white/10 bg-black/20">
            <UiButton
                variant="active"
                :disabled="!hasChanges && !canRestart"
                @click="hasChanges ? $emit('reload') : $emit('restart')"
            >
                <template #icon>
                    <PhArrowsClockwise :size="20" weight="fill" />
                </template>
                Relancer
            </UiButton>
        </div>
    </aside>
</template>

<script setup lang="ts">
import {
    PhPlayCircle,
    PhSlidersHorizontal,
    PhTrendUp,
    PhArrowsClockwise,
} from "@phosphor-icons/vue";
import type { GraphConfig } from "~/types";

const config = defineModel<GraphConfig>({
    required: true,
});

defineProps<{
    hasChanges: boolean;
    canRestart: boolean;
}>();

defineEmits<{
    reload: [];
    restart: [];
}>();
</script>
