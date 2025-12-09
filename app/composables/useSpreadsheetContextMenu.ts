import type { SpreadsheetCell } from "~/types";

export interface ContextMenuState {
    visible: boolean;
    x: number;
    y: number;
    type: "row" | "column" | null;
    index: number;
    columnName?: string;
}

export function useSpreadsheetContextMenu(
    cells: Ref<SpreadsheetCell[]>,
    columnCount: Ref<number>,
    rowCount: Ref<number>,
    getColumnName: (index: number) => string,
    getColumnIndex: (name: string) => number
) {
    const contextMenu = ref<ContextMenuState>({
        visible: false,
        x: 0,
        y: 0,
        type: null,
        index: 0,
    });

    // ========== Context Menu Functions ==========

    function closeContextMenu() {
        contextMenu.value.visible = false;
    }

    function openRowContextMenu(event: MouseEvent, rowIndex: number) {
        event.stopPropagation();
        contextMenu.value = {
            visible: true,
            x: event.clientX,
            y: event.clientY,
            type: "row",
            index: rowIndex,
        };
    }

    function openColumnContextMenu(event: MouseEvent, col: string) {
        event.stopPropagation();
        contextMenu.value = {
            visible: true,
            x: event.clientX,
            y: event.clientY,
            type: "column",
            index: getColumnIndex(col),
            columnName: col,
        };
    }

    // ========== Row Operations ==========

    function insertRowAt(index: number) {
        const newCells = [...cells.value];
        newCells.splice(index, 0, {});
        cells.value = newCells;
        rowCount.value = Math.max(rowCount.value, newCells.length);
    }

    function insertRowAbove() {
        insertRowAt(contextMenu.value.index);
        closeContextMenu();
    }

    function insertRowBelow() {
        insertRowAt(contextMenu.value.index + 1);
        closeContextMenu();
    }

    function deleteRow() {
        const rowIndex = contextMenu.value.index;
        if (cells.value.length > 0) {
            const newCells = [...cells.value];
            newCells.splice(rowIndex, 1);
            cells.value = newCells;
        }
        closeContextMenu();
    }

    // ========== Column Operations ==========

    function insertColumnAt(index: number) {
        const newCells = cells.value.map((row) => {
            const newRow: SpreadsheetCell = {};

            for (let i = columnCount.value - 1; i >= 0; i--) {
                const colName = getColumnName(i);
                const value = row[colName];

                if (i >= index) {
                    const newColName = getColumnName(i + 1);
                    if (value !== undefined && value !== "") {
                        newRow[newColName] = value;
                    }
                } else {
                    if (value !== undefined && value !== "") {
                        newRow[colName] = value;
                    }
                }
            }

            return newRow;
        });

        cells.value = newCells;
        columnCount.value += 1;
    }

    function insertColumnLeft() {
        insertColumnAt(contextMenu.value.index);
        closeContextMenu();
    }

    function insertColumnRight() {
        insertColumnAt(contextMenu.value.index + 1);
        closeContextMenu();
    }

    function deleteColumn() {
        const colIndex = contextMenu.value.index;

        const newCells = cells.value.map((row) => {
            const newRow: SpreadsheetCell = {};

            for (let i = 0; i < columnCount.value; i++) {
                const colName = getColumnName(i);
                const value = row[colName];

                if (i < colIndex) {
                    if (value !== undefined && value !== "") {
                        newRow[colName] = value;
                    }
                } else if (i > colIndex) {
                    const newColName = getColumnName(i - 1);
                    if (value !== undefined && value !== "") {
                        newRow[newColName] = value;
                    }
                }
            }

            return newRow;
        });

        cells.value = newCells;
        if (columnCount.value > 1) {
            columnCount.value -= 1;
        }
        closeContextMenu();
    }

    // ========== Event Listeners ==========

    onMounted(() => {
        document.addEventListener("click", closeContextMenu);
        document.addEventListener("contextmenu", closeContextMenu);
    });

    onUnmounted(() => {
        document.removeEventListener("click", closeContextMenu);
        document.removeEventListener("contextmenu", closeContextMenu);
    });

    return {
        contextMenu: readonly(contextMenu),
        openRowContextMenu,
        openColumnContextMenu,
        closeContextMenu,
        insertRowAbove,
        insertRowBelow,
        deleteRow,
        insertColumnLeft,
        insertColumnRight,
        deleteColumn,
    };
}
