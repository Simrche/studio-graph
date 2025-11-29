<template>
    <div
        class="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center"
    >
        <label :for="id" class="text-white font-medium cursor-pointer">
            {{ label }}
        </label>
        <div class="relative w-12 h-6">
            <input
                :id="id"
                type="checkbox"
                :checked="modelValue"
                @change="
                    $emit(
                        'update:modelValue',
                        ($event.target as HTMLInputElement).checked
                    )
                "
                class="opacity-0 w-0 h-0 peer"
            />
            <label
                :for="id"
                class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-400 rounded-3xl transition-all duration-300 peer-checked:bg-purple-500 before:absolute before:content-[''] before:h-[18px] before:w-[18px] before:left-[3px] before:bottom-[3px] before:bg-white before:rounded-full before:transition-all before:duration-300 peer-checked:before:translate-x-6"
            ></label>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    label: string;
    modelValue: boolean;
    id?: string;
}>();

defineEmits<{
    "update:modelValue": [value: boolean];
}>();

const id = computed(
    () => props.id || `toggle-${Math.random().toString(36).substr(2, 9)}`
);
</script>
