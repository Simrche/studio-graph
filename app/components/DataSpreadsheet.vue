<template>
    <div
        class="w-full h-full flex flex-col bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden"
    >
        <!-- Toolbar -->
        <div
            class="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20 shrink-0"
        >
            <div class="flex items-center gap-3">
                <span class="text-sm text-white/60">
                    {{ rowCount }} lignes / {{ columnCount }} colonnes
                </span>
            </div>
            <div class="flex items-center gap-2">
                <button
                    @click="addRows(100)"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm transition-colors"
                >
                    <PhPlus :size="14" />
                    +100 Lignes
                </button>
                <button
                    @click="addColumns(26)"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm transition-colors"
                >
                    <PhPlus :size="14" />
                    +26 Colonnes
                </button>
            </div>
        </div>

        <!-- Spreadsheet Container -->
        <div
            class="flex-1 min-h-0 overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-white/30 [&::-webkit-scrollbar-corner]:bg-transparent"
        >
            <table
                class="border-collapse"
                :style="{ width: `${totalWidth}px` }"
            >
                <!-- Header -->
                <thead class="sticky top-0 z-20">
                    <tr class="bg-slate-800/95 backdrop-blur-sm">
                        <!-- Corner cell -->
                        <th
                            class="sticky left-0 z-30 w-12 min-w-[48px] px-2 py-2 text-xs font-medium text-white/20 text-center border-b border-r border-white/10 bg-slate-800/95"
                        >
                            #
                        </th>
                        <!-- Column headers -->
                        <th
                            v-for="col in visibleColumns"
                            :key="col"
                            :class="[
                                'min-w-[100px] w-[100px] px-2 py-2 text-xs font-mono font-medium text-center border-b border-r border-white/10 cursor-context-menu select-none',
                                getColumnClass(col),
                            ]"
                            @contextmenu.prevent="openColumnContextMenu($event, col)"
                        >
                            {{ col }}
                        </th>
                    </tr>
                </thead>

                <!-- Body -->
                <tbody>
                    <tr
                        v-for="rowIndex in visibleRows"
                        :key="rowIndex"
                        :class="[
                            'group',
                            rowIndex === 1 ? 'bg-white/5' : '',
                        ]"
                    >
                        <!-- Row number -->
                        <td
                            :class="[
                                'sticky left-0 z-10 px-2 py-0 text-xs text-center border-r border-b font-mono cursor-context-menu select-none',
                                rowIndex === 1
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-semibold'
                                    : 'bg-slate-800/80 text-white/40 border-white/5',
                            ]"
                            @contextmenu.prevent="openRowContextMenu($event, rowIndex - 1)"
                        >
                            <span v-if="rowIndex === 1" class="flex items-center justify-center gap-1">
                                <PhTextT :size="12" />
                            </span>
                            <span v-else>{{ rowIndex }}</span>
                        </td>

                        <!-- Data cells -->
                        <td
                            v-for="col in visibleColumns"
                            :key="col"
                            :class="[
                                'px-0 py-0 border-r border-b',
                                rowIndex === 1 ? 'border-amber-500/20' : 'border-white/5',
                                rowIndex === 1 && isDataColumn(col) ? 'bg-amber-500/10' : getColumnClass(col),
                            ]"
                        >
                            <input
                                :value="getCellValue(rowIndex - 1, col)"
                                @input="
                                    setCellValue(
                                        rowIndex - 1,
                                        col,
                                        ($event.target as HTMLInputElement)
                                            .value
                                    )
                                "
                                @keydown="
                                    handleKeydown($event, rowIndex - 1, col)
                                "
                                :ref="el => setCellRef(rowIndex - 1, col, el as HTMLInputElement)"
                                type="text"
                                :class="[
                                    'w-full h-full px-2 py-1.5 bg-transparent text-sm placeholder-white/10 focus:outline-none focus:bg-purple-500/10 transition-colors',
                                    rowIndex === 1 && isDataColumn(col) ? 'text-amber-300 font-medium' : 'text-white',
                                ]"
                                :placeholder="rowIndex === 1 && isDataColumn(col) ? 'Label axe X' : col + rowIndex"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Context Menu -->
        <Teleport to="body">
            <div
                v-if="contextMenu.visible"
                class="fixed z-50 min-w-[180px] py-1 bg-slate-800 border border-white/10 rounded-lg shadow-xl"
                :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
            >
                <!-- Menu pour les lignes -->
                <template v-if="contextMenu.type === 'row'">
                    <button
                        @click="insertRowAbove"
                        class="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                    >
                        <PhArrowLineUp :size="16" />
                        Insérer une ligne au-dessus
                    </button>
                    <button
                        @click="insertRowBelow"
                        class="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                    >
                        <PhArrowLineDown :size="16" />
                        Insérer une ligne en-dessous
                    </button>
                    <div class="my-1 border-t border-white/10"></div>
                    <button
                        @click="deleteRow"
                        class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <PhTrash :size="16" />
                        Supprimer la ligne
                    </button>
                </template>

                <!-- Menu pour les colonnes -->
                <template v-else-if="contextMenu.type === 'column'">
                    <button
                        @click="insertColumnLeft"
                        class="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                    >
                        <PhArrowLineLeft :size="16" />
                        Insérer une colonne à gauche
                    </button>
                    <button
                        @click="insertColumnRight"
                        class="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                    >
                        <PhArrowLineRight :size="16" />
                        Insérer une colonne à droite
                    </button>
                    <div class="my-1 border-t border-white/10"></div>
                    <button
                        @click="deleteColumn"
                        class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <PhTrash :size="16" />
                        Supprimer la colonne
                    </button>
                </template>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { PhPlus, PhArrowLineUp, PhArrowLineDown, PhArrowLineLeft, PhArrowLineRight, PhTrash, PhTextT } from "@phosphor-icons/vue";
import type { SpreadsheetCell } from "~/types";

const props = defineProps<{
    labelColumn?: string;
    imageColumn?: string;
    colorColumn?: string;
    dataRangeStart?: string;
    dataRangeEnd?: string;
}>();

const cells = defineModel<SpreadsheetCell[]>({
    required: true,
});

const cellRefs = new Map<string, HTMLInputElement>();

// Configuration initiale
const initialColumns = 26; // A-Z
const initialRows = 100;
const columnCount = ref(initialColumns);
const rowCount = ref(initialRows);

// Dimensions
const columnWidth = 100;
const totalWidth = computed(() => 48 + columnCount.value * columnWidth);

// Générer le nom de colonne (A, B, ..., Z, AA, AB, ...)
function getColumnName(index: number): string {
    let name = "";
    let num = index;
    while (num >= 0) {
        name = String.fromCharCode(65 + (num % 26)) + name;
        num = Math.floor(num / 26) - 1;
    }
    return name;
}

// Obtenir l'index d'une colonne à partir de son nom
function getColumnIndex(name: string): number {
    let index = 0;
    for (let i = 0; i < name.length; i++) {
        index = index * 26 + (name.charCodeAt(i) - 64);
    }
    return index - 1;
}

// Colonnes visibles (pour le viewport)
const visibleColumns = computed(() => {
    const cols: string[] = [];
    for (let i = 0; i < columnCount.value; i++) {
        cols.push(getColumnName(i));
    }
    return cols;
});

// Lignes visibles
const visibleRows = computed(() => {
    const rows: number[] = [];
    for (let i = 1; i <= rowCount.value; i++) {
        rows.push(i);
    }
    return rows;
});

// Computed pour les classes de colonnes (réactif aux props)
const columnClasses = computed(() => {
    const classes: Record<string, string> = {};

    for (let i = 0; i < columnCount.value; i++) {
        const col = getColumnName(i);

        if (props.labelColumn && col === props.labelColumn) {
            classes[col] = "bg-blue-500/20";
        } else if (props.imageColumn && col === props.imageColumn) {
            classes[col] = "bg-green-500/20";
        } else if (props.colorColumn && col === props.colorColumn) {
            classes[col] = "bg-orange-500/20";
        } else if (props.dataRangeStart && props.dataRangeEnd) {
            const colIndex = i;
            const startIndex = getColumnIndex(props.dataRangeStart);
            const endIndex = getColumnIndex(props.dataRangeEnd);
            if (colIndex >= startIndex && colIndex <= endIndex) {
                classes[col] = "bg-purple-500/20";
            }
        }
    }

    return classes;
});

// Classe CSS pour les colonnes (highlight selon config)
function getColumnClass(col: string): string {
    return columnClasses.value[col] ?? "";
}

// Vérifie si une colonne fait partie de la plage de données
function isDataColumn(col: string): boolean {
    if (!props.dataRangeStart || !props.dataRangeEnd) return false;
    const colIndex = getColumnIndex(col);
    const startIndex = getColumnIndex(props.dataRangeStart);
    const endIndex = getColumnIndex(props.dataRangeEnd);
    return colIndex >= startIndex && colIndex <= endIndex;
}

// Obtenir la valeur d'une cellule
function getCellValue(rowIndex: number, col: string): string | number {
    if (!cells.value[rowIndex]) return "";
    return cells.value[rowIndex][col] ?? "";
}

// Définir la valeur d'une cellule
function setCellValue(rowIndex: number, col: string, value: string) {
    // Créer une copie pour déclencher la réactivité
    const newCells = [...cells.value];

    // Étendre le tableau si nécessaire
    while (newCells.length <= rowIndex) {
        newCells.push({});
    }

    if (!newCells[rowIndex]) {
        newCells[rowIndex] = {};
    }

    newCells[rowIndex] = { ...newCells[rowIndex], [col]: value };
    cells.value = newCells;
}

// Gestion des refs pour les cellules
function setCellRef(
    rowIndex: number,
    col: string,
    el: HTMLInputElement | null
) {
    const key = `${rowIndex}-${col}`;
    if (el) {
        cellRefs.set(key, el);
    } else {
        cellRefs.delete(key);
    }
}

// Navigation avec les flèches
function handleKeydown(event: KeyboardEvent, rowIndex: number, col: string) {
    const colIndex = getColumnIndex(col);
    let nextRow = rowIndex;
    let nextCol = colIndex;

    switch (event.key) {
        case "ArrowUp":
            if (rowIndex > 0) nextRow = rowIndex - 1;
            event.preventDefault();
            break;
        case "ArrowDown":
        case "Enter":
            if (rowIndex < rowCount.value - 1) nextRow = rowIndex + 1;
            event.preventDefault();
            break;
        case "ArrowLeft":
            if (colIndex > 0) nextCol = colIndex - 1;
            break;
        case "ArrowRight":
            if (colIndex < columnCount.value - 1) nextCol = colIndex + 1;
            break;
        case "Tab":
            if (event.shiftKey) {
                if (colIndex > 0) nextCol = colIndex - 1;
            } else {
                if (colIndex < columnCount.value - 1) nextCol = colIndex + 1;
            }
            event.preventDefault();
            break;
        default:
            return;
    }

    if (nextRow !== rowIndex || nextCol !== colIndex) {
        const nextColName = getColumnName(nextCol);
        const key = `${nextRow}-${nextColName}`;
        const nextCell = cellRefs.get(key);
        if (nextCell) {
            nextCell.focus();
        }
    }
}

// Ajouter des lignes
function addRows(count: number) {
    rowCount.value += count;
}

// Ajouter des colonnes
function addColumns(count: number) {
    columnCount.value += count;
}

// Context menu via composable
const {
    contextMenu,
    openRowContextMenu,
    openColumnContextMenu,
    insertRowAbove,
    insertRowBelow,
    deleteRow,
    insertColumnLeft,
    insertColumnRight,
    deleteColumn,
} = useSpreadsheetContextMenu(cells, columnCount, rowCount, getColumnName, getColumnIndex);

// Ajuster le nombre de lignes si on a plus de données
onMounted(() => {
    if (cells.value.length > rowCount.value) {
        rowCount.value = cells.value.length;
    }
});
</script>
