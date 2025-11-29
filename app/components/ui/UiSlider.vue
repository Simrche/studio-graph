<template>
    <div class="bg-white/5 border border-white/10 rounded-xl p-4">
        <div
            class="flex justify-between items-center text-violet-200 text-sm mb-2"
        >
            <span>{{ label }}</span>
            <span class="font-bold text-white">{{ displayValue }}</span>
        </div>
        <input
            type="range"
            :min="min"
            :max="max"
            :step="step"
            :value="modelValue"
            @input="
                $emit(
                    'update:modelValue',
                    parseFloat(($event.target as HTMLInputElement).value)
                )
            "
            class="w-full h-1 rounded-sm bg-white/30 outline-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    label: string;
    modelValue: number;
    min: number;
    max: number;
    step: number;
    suffix?: string;
}>();

defineEmits<{
    "update:modelValue": [value: number];
}>();

const displayValue = computed(() => {
    return `${props.modelValue}${props.suffix || ""}`;
});
</script>
