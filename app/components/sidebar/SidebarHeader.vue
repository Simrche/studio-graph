<template>
    <div class="p-6 border-b border-white/10 bg-white/5">
        <div class="flex items-center gap-2 mb-1">
            <span class="text-2xl">🎬</span>
            <input
                v-model="title"
                type="text"
                class="text-2xl font-bold text-white bg-transparent border-none outline-none focus:outline-none flex-1 placeholder:text-white/40"
                placeholder="Titre du projet"
                @focus="handleFocus"
                @blur="handleBlur"
                @keydown.enter="handleBlur"
            />
        </div>
        <p class="text-violet-300 text-sm">Visualisation et contrôle</p>
    </div>
</template>

<script setup lang="ts">
const title = defineModel<string>({
    required: false,
});

const isFocused = ref(false);

function handleFocus() {
    isFocused.value = true;
}

function handleBlur(event: Event) {
    isFocused.value = false;
    (event.target as HTMLInputElement).blur();
}
</script>
