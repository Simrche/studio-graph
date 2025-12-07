<template>
    <Teleport to="body">
        <Transition name="overlay">
            <div v-if="visible" class="video-export-overlay">
                <div class="overlay-content">
                    <PhSpinner class="w-12 h-12 text-white animate-spin" />
                    <p class="text-white text-xl font-semibold mt-6">
                        Génération de la vidéo...
                    </p>

                    <div class="progress-container">
                        <div class="progress-bar">
                            <div
                                class="progress-fill"
                                :style="{ width: `${progress}%` }"
                            ></div>
                        </div>
                        <div class="progress-info">
                            <span class="progress-percentage">
                                {{ Math.round(progress) }}%
                            </span>
                            <span class="time-remaining">
                                {{ formattedTimeRemaining }}
                            </span>
                        </div>
                    </div>

                    <button @click="$emit('cancel')" class="cancel-button">
                        Annuler
                    </button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { PhSpinner } from "@phosphor-icons/vue";

const props = defineProps<{
    visible: boolean;
    progress: number;
    estimatedTimeRemaining: number;
}>();

defineEmits<{
    cancel: [];
}>();

const formattedTimeRemaining = computed(() => {
    const seconds = Math.ceil(props.estimatedTimeRemaining);

    if (seconds <= 0 || props.progress === 0) {
        return "Calcul en cours...";
    }

    if (seconds < 60) {
        return `${seconds}s restantes`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (remainingSeconds === 0) {
        return `${minutes}min restantes`;
    }

    return `${minutes}min ${remainingSeconds}s restantes`;
});
</script>

<style scoped>
.video-export-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.overlay-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 400px;
    width: 100%;
    padding: 0 24px;
}

.progress-container {
    width: 100%;
    margin-top: 32px;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #a855f7, #c084fc);
    border-radius: 4px;
    transition: width 0.3s ease-out;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
}

.progress-percentage {
    color: white;
    font-size: 14px;
    font-weight: 600;
}

.time-remaining {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
}

.cancel-button {
    margin-top: 32px;
    padding: 12px 32px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.cancel-button:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
}

/* Transition animations */
.overlay-enter-active,
.overlay-leave-active {
    transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
    opacity: 0;
}
</style>
