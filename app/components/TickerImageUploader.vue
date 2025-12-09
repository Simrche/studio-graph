<template>
    <div class="relative h-10 w-10 shrink-0 group/image">
        <input
            ref="inputRef"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            class="hidden"
            @change="handleFileSelect"
        />

        <!-- Image display -->
        <div
            class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-purple-500/50"
            @click="openFilePicker"
        >
            <img
                v-if="displayUrl && !imageError"
                :src="displayUrl"
                :alt="symbol"
                class="h-full w-full object-contain p-1"
                @error="imageError = true"
            />
            <div
                v-else
                class="flex h-full w-full items-center justify-center"
                :style="{ backgroundColor: fallbackColor }"
            >
                <span
                    class="flex h-full w-full items-center justify-center text-sm font-bold tracking-wide text-white"
                >
                    {{ symbol?.substring(0, 2).toUpperCase() }}
                </span>
            </div>
        </div>

        <!-- Overlay avec icône -->
        <div
            class="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 pointer-events-none"
        >
            <PhCamera :size="16" class="text-white" />
        </div>

        <!-- Bouton supprimer image custom -->
        <button
            v-if="hasCustomImage"
            class="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 hover:bg-red-600 z-10"
            @click.stop="removeImage"
            title="Supprimer l'image"
        >
            <PhX :size="12" weight="bold" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { PhCamera, PhX } from "@phosphor-icons/vue";
import {
    validateTickerImage,
    createImagePreviewUrl,
    revokeImagePreviewUrl,
} from "~/composables/useTickerImage";

const props = defineProps<{
    /** URL de l'image (logoUrl ou customImageUrl) */
    imageUrl: string | null;
    /** Image en attente d'upload */
    pendingImage?: File | null;
    /** Symbole du ticker pour le fallback */
    symbol: string;
    /** Couleur de fallback */
    fallbackColor: string;
}>();

const emit = defineEmits<{
    "update:pendingImage": [file: File | null];
    removeCustomImage: [];
}>();

const { showError } = useToast();

const inputRef = ref<HTMLInputElement | null>(null);
const imageError = ref(false);
const localPreviewUrl = ref<string | null>(null);

// URL à afficher (priorité: pending > custom > logo)
const displayUrl = computed(() => {
    if (localPreviewUrl.value) return localPreviewUrl.value;
    return props.imageUrl;
});

// Vérifie si une image custom est présente
const hasCustomImage = computed(() => {
    return !!props.pendingImage || !!props.imageUrl;
});

function openFilePicker() {
    inputRef.value?.click();
}

function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const validationError = validateTickerImage(file);
    if (validationError) {
        showError(validationError.message);
        input.value = "";
        return;
    }

    // Libérer l'ancienne URL de prévisualisation
    if (localPreviewUrl.value) {
        revokeImagePreviewUrl(localPreviewUrl.value);
    }

    // Créer une nouvelle URL de prévisualisation
    localPreviewUrl.value = createImagePreviewUrl(file);
    imageError.value = false;

    emit("update:pendingImage", file);
    input.value = "";
}

function removeImage() {
    if (localPreviewUrl.value) {
        revokeImagePreviewUrl(localPreviewUrl.value);
        localPreviewUrl.value = null;
    }

    emit("update:pendingImage", null);
    emit("removeCustomImage");
}

// Nettoyer l'URL de prévisualisation lors du démontage
onUnmounted(() => {
    if (localPreviewUrl.value) {
        revokeImagePreviewUrl(localPreviewUrl.value);
    }
});

// Synchroniser la preview URL avec le pendingImage
watch(
    () => props.pendingImage,
    (newFile) => {
        if (!newFile && localPreviewUrl.value) {
            revokeImagePreviewUrl(localPreviewUrl.value);
            localPreviewUrl.value = null;
        }
    }
);
</script>
