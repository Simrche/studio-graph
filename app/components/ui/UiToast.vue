<template>
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        <TransitionGroup name="toast">
            <div
                v-for="toast in toasts"
                :key="toast.id"
                :class="[
                    'flex items-start gap-3 p-4 rounded-xl backdrop-blur-lg border shadow-lg',
                    'transition-all duration-300 min-w-[320px]',
                    variantStyles[toast.type].bg,
                    variantStyles[toast.type].border,
                ]"
            >
                <component
                    :is="variantStyles[toast.type].icon"
                    :size="20"
                    weight="fill"
                    :class="variantStyles[toast.type].iconColor"
                    class="flex-shrink-0 mt-0.5"
                />

                <div class="flex-1 flex flex-col gap-2">
                    <p class="text-white text-sm font-medium">
                        {{ toast.message }}
                    </p>

                    <button
                        v-if="toast.button"
                        :class="[
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                            'self-start',
                            variantStyles[toast.type].button,
                        ]"
                        @click="handleButtonClick(toast)"
                    >
                        {{ toast.button.label }}
                    </button>
                </div>

                <button
                    class="text-white/50 hover:text-white transition-colors flex-shrink-0"
                    @click="removeToast(toast.id)"
                >
                    <PhX :size="20" weight="bold" />
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { PhCheckCircle, PhWarning, PhInfo, PhX } from "@phosphor-icons/vue";
import { storeToRefs } from "pinia";
import { useToastStore } from "~/stores/toast";
import type { Toast } from "~/stores/toast";

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);

const variantStyles = {
    success: {
        bg: "bg-green-500/10",
        border: "border-green-500/30",
        iconColor: "text-green-500",
        button: "bg-green-500/20 hover:bg-green-500/30 text-green-400",
        icon: PhCheckCircle,
    },
    error: {
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        iconColor: "text-red-500",
        button: "bg-red-500/20 hover:bg-red-500/30 text-red-400",
        icon: PhWarning,
    },
    info: {
        bg: "bg-purple-500/10",
        border: "border-purple-500/30",
        iconColor: "text-purple-500",
        button: "bg-purple-500/20 hover:bg-purple-500/30 text-purple-400",
        icon: PhInfo,
    },
};

function removeToast(id: string) {
    toastStore.remove(id);
}

function handleButtonClick(toast: Toast) {
    if (toast.button?.onClick) {
        toast.button.onClick();
    }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
}

.toast-move {
    transition: transform 0.3s ease;
}
</style>
