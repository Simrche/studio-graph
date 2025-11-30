<template>
    <div class="relative z-10">
        <PhMagnifyingGlass
            :size="18"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500/50 pointer-events-none z-10 transition-colors duration-300"
            :class="{ 'text-purple-500': showResults }"
        />
        <input
            v-model="query"
            type="text"
            placeholder="Ajouter un ticker..."
            @focus="handleFocus"
            class="w-full py-2.5 pl-11 pr-4 bg-white/5 border border-purple-500/20 rounded-xl text-white text-sm font-medium outline-none transition-all duration-300 placeholder:text-white/40 hover:bg-white/8 hover:border-purple-500/30 focus:bg-white/10 focus:border-purple-500 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.1)]"
        />

        <!-- Dropdown de résultats de recherche -->
        <Transition name="dropdown">
            <div
                v-if="showResults && query.length >= 2"
                class="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-black/80 backdrop-blur-[40px] border border-white/10 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(168,85,247,0.1)] max-h-64 overflow-hidden z-50"
            >
                <div
                    v-if="isSearching"
                    class="p-6 text-center text-white/50 text-sm flex items-center justify-center gap-3 flex-col"
                >
                    <div
                        class="w-6 h-6 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"
                    ></div>
                    <span>Recherche...</span>
                </div>
                <div
                    v-else-if="results.length === 0"
                    class="p-6 text-center text-white/50 text-sm flex items-center justify-center gap-3 flex-col"
                >
                    <PhInfo :size="32" class="text-white/20" weight="fill" />
                    Aucun résultat
                </div>
                <div
                    v-else
                    class="max-h-64 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-purple-500/30 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-purple-500/50"
                >
                    <div
                        v-for="ticker in results"
                        :key="ticker.symbol as string"
                        @click="selectTicker(ticker)"
                        class="px-4 py-3 flex items-center justify-between cursor-pointer border-b border-white/[0.03] last:border-b-0 transition-all duration-200 relative before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:to-pink-500 before:opacity-0 before:transition-opacity hover:bg-purple-500/10 hover:before:opacity-100"
                    >
                        <div class="flex items-center gap-3 flex-1 min-w-0">
                            <div
                                class="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_4px_10px_rgba(168,85,247,0.2)]"
                            >
                                <span
                                    class="text-white font-bold text-xs tracking-wide"
                                >
                                    {{
                                        (ticker.symbol as string | undefined)
                                            ?.substring(0, 2)
                                            .toUpperCase()
                                    }}
                                </span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <div
                                    class="text-white font-bold text-sm tracking-wide"
                                >
                                    {{ ticker.symbol }}
                                </div>
                                <div
                                    class="text-violet-300 text-xs overflow-hidden text-ellipsis whitespace-nowrap mt-0.5"
                                >
                                    {{
                                        ticker.shortname ||
                                        ticker.longname ||
                                        ticker.symbol
                                    }}
                                </div>
                            </div>
                        </div>
                        <PhPlusCircle
                            :size="24"
                            weight="fill"
                            class="text-purple-500 flex-shrink-0 opacity-0 scale-80 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-hover:text-purple-400"
                        />
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { PhMagnifyingGlass, PhInfo, PhPlusCircle } from "@phosphor-icons/vue";
import { useDebounceFn } from "@vueuse/core";
import type { SearchResult } from "yahoo-finance2/modules/search";

interface Props {
    debounceMs?: number;
}

const props = withDefaults(defineProps<Props>(), {
    debounceMs: 500,
});

const emit = defineEmits<{
    select: [ticker: SearchResult["quotes"][number]];
}>();

const query = ref("");
const showResults = ref(false);
const results = ref<SearchResult["quotes"]>([]);
const isSearching = ref(false);

const searchTickers = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
        results.value = [];
        showResults.value = false;
        isSearching.value = false;
        return;
    }

    isSearching.value = true;
    showResults.value = true;

    try {
        const response = await $fetch<SearchResult>("/api/get-tickers", {
            params: { search: searchQuery },
        });

        results.value = response.quotes || [];
    } catch (error) {
        results.value = [];
    } finally {
        isSearching.value = false;
    }
};

const debouncedSearch = useDebounceFn(searchTickers, props.debounceMs);

watch(query, (newQuery) => {
    if (newQuery.length < 2) {
        results.value = [];
        showResults.value = false;
        isSearching.value = false;
        return;
    }

    debouncedSearch(newQuery);
});

const handleFocus = () => {
    if (query.value.length >= 2) {
        showResults.value = true;
    }
};

const selectTicker = (ticker: SearchResult["quotes"][number]) => {
    emit("select", ticker);
    query.value = "";
    results.value = [];
    showResults.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".relative.z-10")) {
        showResults.value = false;
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.3s ease;
}

.dropdown-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}
</style>
