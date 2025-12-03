<template>
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
            v-for="icon in icons"
            :key="icon.id"
            class="absolute text-purple-300/10"
            :style="{
                y: `${icon.y}px`,
                left: `${icon.x}%`,
                animation: `fall-${icon.id} ${icon.duration}s linear infinite`,
                animationDelay: `${icon.delay}s`,
                opacity: 0,
                '--start-rotation': `${icon.rotation}deg`,
                '--icon-size': `${icon.size}px`,
            }"
        >
            <component :is="icon.component" :size="icon.size" weight="thin" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { shallowRef, markRaw } from "vue";
import {
    PhChartLine,
    PhTrendUp,
    PhTrendDown,
    PhCurrencyDollar,
    PhChartLineUp,
    PhChartBar,
    PhCalendar,
    PhTarget,
    PhArrowsClockwise,
    PhPercent,
} from "@phosphor-icons/vue";

interface FallingIcon {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    rotation: number;
    component: any;
}

const iconComponents = [
    PhChartLine,
    PhTrendUp,
    PhTrendDown,
    PhCurrencyDollar,
    PhChartLineUp,
    PhChartBar,
    PhCalendar,
    PhTarget,
    PhArrowsClockwise,
    PhPercent,
];

const icons = shallowRef<FallingIcon[]>([]);

const createIcon = (id: number): FallingIcon => {
    const randomComponent =
        iconComponents[Math.floor(Math.random() * iconComponents.length)];
    return {
        id,
        x: Math.random() * 100,
        y: -200,
        delay: Math.random() * 20,
        size: Math.random() * 40 + 30, // Entre 30 et 70px
        duration: 20,
        rotation: Math.random() * 360,
        component: markRaw(randomComponent as any),
    };
};

onMounted(() => {
    // Créer 30 icônes pour un meilleur espacement
    icons.value = Array.from({ length: 100 }, (_, i) => createIcon(i));

    // Injecter les keyframes dynamiquement
    const style = document.createElement("style");
    style.textContent = icons.value
        .map(
            (icon) => `
        @keyframes fall-${icon.id} {
            0% {
                transform: translateY(-200px) rotate(${icon.rotation}deg);
                opacity: 0;
            }
            5% {
                transform: translateY(-150px) rotate(${icon.rotation + 20}deg);
                opacity: 1;
            }
            95% {
                transform: translateY(calc(100vh + 150px)) rotate(${
                    icon.rotation + 160
                }deg);
                opacity: 1;
            }
            100% {
                transform: translateY(calc(100vh + 200px)) rotate(${
                    icon.rotation + 180
                }deg);
                opacity: 0;
            }
        }
    `
        )
        .join("\n");
    document.head.appendChild(style);
});
</script>

<style scoped>
/* Les keyframes sont injectées dynamiquement dans onMounted */
</style>
