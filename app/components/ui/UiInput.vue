<template>
    <div>
        <label
            v-if="label"
            :for="inputId"
            class="block text-sm font-medium text-white/80 mb-2"
        >
            {{ label }}
        </label>
        <div class="relative">
            <input
                :id="inputId"
                :type="computedType"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :required="required"
                :minlength="minlength"
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                :class="[hasRightSlot && 'pr-12']"
                @input="handleInput"
            />
            <div
                v-if="hasRightSlot"
                class="absolute right-4 top-1/2 -translate-y-1/2"
            >
                <slot name="right"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: string;
    type?: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    minlength?: number;
    id?: string;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: string];
}>();

const slots = useSlots();

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`);
const hasRightSlot = computed(() => !!slots.right);
const computedType = computed(() => props.type || "text");

function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    emit("update:modelValue", target.value);
}
</script>
