<template>
    <div class="flex items-center justify-center w-full h-full">
        <div class="flex flex-col items-center gap-4 text-center px-8" style="min-height: 156px;">
            <!-- Animated Chart Icon -->
            <div class="relative">
                <!-- Background Circle -->
                <div class="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                    <!-- Animated Bars -->
                    <div class="flex items-end gap-1.5 h-10">
                        <div
                            class="w-1.5 bg-slate-400 rounded-full animate-pulse"
                            :style="{ height: '30%', animationDelay: '0ms', animationDuration: '1000ms' }"
                        ></div>
                        <div
                            class="w-1.5 bg-slate-400 rounded-full animate-pulse"
                            :style="{ height: '60%', animationDelay: '150ms', animationDuration: '1000ms' }"
                        ></div>
                        <div
                            class="w-1.5 bg-slate-400 rounded-full animate-pulse"
                            :style="{ height: '45%', animationDelay: '300ms', animationDuration: '1000ms' }"
                        ></div>
                        <div
                            class="w-1.5 bg-slate-400 rounded-full animate-pulse"
                            :style="{ height: '80%', animationDelay: '450ms', animationDuration: '1000ms' }"
                        ></div>
                        <div
                            class="w-1.5 bg-slate-400 rounded-full animate-pulse"
                            :style="{ height: '55%', animationDelay: '600ms', animationDuration: '1000ms' }"
                        ></div>
                    </div>
                </div>

                <!-- Spinning Ring -->
                <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-slate-400 animate-spin"></div>
            </div>

            <!-- Loading Text -->
            <div class="flex flex-col items-center gap-2">
                <p class="text-slate-700 font-semibold text-xl">Chargement du graphique</p>
                <div class="flex gap-1 items-center" style="height: 48px;">
                    <span
                        class="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                        :style="{ animationDelay: '0ms' }"
                    ></span>
                    <span
                        class="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                        :style="{ animationDelay: '150ms' }"
                    ></span>
                    <span
                        class="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                        :style="{ animationDelay: '300ms' }"
                    ></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
@keyframes pulse {
    0%, 100% {
        opacity: 1;
        transform: scaleY(1);
    }
    50% {
        opacity: 0.5;
        transform: scaleY(0.6);
    }
}

.animate-pulse {
    animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
