<template>
    <div class="p-6 border-t border-white/10 bg-black/20">
        <UiButton variant="active">
            <template #icon>
                <PhFloppyDisk :size="20" weight="fill" />
            </template>
            Sauvegarder
        </UiButton>
    </div>
</template>

<script setup lang="ts">
import { PhFloppyDisk } from "@phosphor-icons/vue";
</script>
