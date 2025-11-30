import type { Ref } from "vue";

/**
 * Composable pour détecter les modifications sur un objet ref
 * @param source - L'objet ref à surveiller
 * @returns Un objet contenant `modified` (ref boolean) et `resetInitial` (fonction)
 */
export function useModification<T extends object>(source: MaybeRefOrGetter<T>) {
    const sourceValue = computed(() => toValue(source));
    const initial = ref<string>("");
    const modified = ref<boolean>(false);

    // Sauvegarder l'état initial
    function resetInitial() {
        initial.value = JSON.stringify(toRaw(sourceValue.value));
        modified.value = false;
    }

    // Initialiser avec l'état actuel
    resetInitial();

    // Surveiller les changements
    watch(
        sourceValue,
        (newValue) => {
            const currentSerialized = JSON.stringify(toRaw(newValue));
            modified.value = currentSerialized !== initial.value;
        },
        { deep: true }
    );

    return {
        modified: readonly(modified),
        resetInitial,
    };
}
