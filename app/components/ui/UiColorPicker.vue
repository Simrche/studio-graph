<template>
    <div class="relative h-9 w-9">
        <input
            type="color"
            :value="color"
            class="absolute inset-0 z-[2] h-full w-full cursor-pointer opacity-0"
            @input="color = ($event.target as HTMLInputElement).value"
        />
        <div
            class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all duration-300 hover:scale-105 hover:border-purple-500/40 hover:bg-white/10"
        >
            <div
                class="h-[18px] w-[18px] rounded-full shadow-[0_0_0_2px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.2)]"
                :style="{ backgroundColor: color }"
            ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
const color = defineModel<string>();
</script>
