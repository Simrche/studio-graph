<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="modelValue"
                class="fixed inset-0 z-50 flex items-center justify-center p-4"
                @click.self="closeOnBackdrop && close()"
            >
                <!-- Backdrop -->
                <div
                    class="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    aria-hidden="true"
                />

                <!-- Modal content -->
                <div
                    class="relative w-full bg-black/40 backdrop-blur-[40px] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    :class="sizeClasses"
                >
                    <!-- Header -->
                    <div
                        v-if="$slots.header || title"
                        class="flex items-center justify-between px-6 py-5 border-b border-white/10"
                    >
                        <slot name="header">
                            <h2 class="text-lg font-semibold text-white">
                                {{ title }}
                            </h2>
                        </slot>
                        <button
                            v-if="showClose"
                            class="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            @click="close"
                        >
                            <PhX :size="18" class="text-white/60" />
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="px-6 py-6">
                        <slot />
                    </div>

                    <!-- Footer -->
                    <div
                        v-if="$slots.footer"
                        class="px-6 py-4 border-t border-white/10 bg-black/20"
                    >
                        <slot name="footer" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";

const props = withDefaults(
    defineProps<{
        modelValue: boolean;
        title?: string;
        size?: "sm" | "md" | "lg" | "xl";
        showClose?: boolean;
        closeOnBackdrop?: boolean;
    }>(),
    {
        size: "md",
        showClose: true,
        closeOnBackdrop: true,
    }
);

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
}>();

const sizeClasses = computed(() => {
    switch (props.size) {
        case "sm":
            return "max-w-sm";
        case "md":
            return "max-w-md";
        case "lg":
            return "max-w-2xl";
        case "xl":
            return "max-w-4xl";
        default:
            return "max-w-md";
    }
});

function close() {
    emit("update:modelValue", false);
}

// Close on Escape key
onMounted(() => {
    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && props.modelValue) {
            close();
        }
    };
    window.addEventListener("keydown", handleEscape);
    onUnmounted(() => {
        window.removeEventListener("keydown", handleEscape);
    });
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
    transform: scale(0.95);
    opacity: 0;
}
</style>
