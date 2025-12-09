import type { SpreadsheetCell } from "~/types";
import * as XLSX from "xlsx";

export interface ImportResult {
    cells: SpreadsheetCell[];
    rowCount: number;
    columnCount: number;
}

/**
 * Service pour importer des fichiers CSV et Excel dans le spreadsheet
 */
export const spreadsheetImportService = {
    /**
     * Importer un fichier (CSV ou Excel)
     */
    async importFile(file: File): Promise<ImportResult> {
        const extension = file.name.split(".").pop()?.toLowerCase();

        if (extension === "csv") {
            return this.importCSV(file);
        } else if (["xlsx", "xls"].includes(extension ?? "")) {
            return this.importExcel(file);
        }

        throw new Error(
            "Format de fichier non supporté. Utilisez CSV, XLS ou XLSX."
        );
    },

    /**
     * Importer un fichier CSV
     */
    async importCSV(file: File): Promise<ImportResult> {
        const text = await file.text();
        return this.parseCSV(text);
    },

    /**
     * Importer un fichier Excel
     */
    async importExcel(file: File): Promise<ImportResult> {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        // Prendre la première feuille
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convertir en tableau 2D
        const data: (string | number)[][] = XLSX.utils.sheet_to_json(
            worksheet,
            {
                header: 1,
                defval: "",
            }
        );

        return this.convertToSpreadsheetCells(data);
    },

    /**
     * Parser le contenu CSV
     */
    parseCSV(text: string): ImportResult {
        const lines = text.split(/\r?\n/);
        const data: (string | number)[][] = [];

        for (const line of lines) {
            if (line.trim() === "") continue;

            const row = this.parseCSVLine(line);
            data.push(row);
        }

        return this.convertToSpreadsheetCells(data);
    },

    /**
     * Parser une ligne CSV (gère les guillemets et les virgules dans les valeurs)
     */
    parseCSVLine(line: string): (string | number)[] {
        const result: (string | number)[] = [];
        let current = "";
        let inQuotes = false;

        // Détecter le séparateur (virgule ou point-virgule)
        const separator = line.includes(";") && !line.includes(",") ? ";" : ",";

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    // Guillemet échappé
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === separator && !inQuotes) {
                result.push(this.parseValue(current.trim()));
                current = "";
            } else {
                current += char;
            }
        }

        result.push(this.parseValue(current.trim()));
        return result;
    },

    /**
     * Convertir une valeur string en number si possible
     */
    parseValue(value: string): string | number {
        if (value === "") return "";

        // Nettoyer la valeur (remplacer virgule par point pour les décimaux)
        const cleanValue = value.replace(",", ".");
        const num = parseFloat(cleanValue);

        if (!isNaN(num) && isFinite(num)) {
            return num;
        }

        return value;
    },

    /**
     * Convertir un tableau 2D en SpreadsheetCell[]
     */
    convertToSpreadsheetCells(data: (string | number)[][]): ImportResult {
        const cells: SpreadsheetCell[] = [];
        let maxColumns = 0;

        for (const row of data) {
            const cell: SpreadsheetCell = {};

            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const colName = this.getColumnName(colIndex);
                const value = row[colIndex];

                if (value !== "" && value !== undefined && value !== null) {
                    cell[colName] = value;
                }
            }

            cells.push(cell);
            maxColumns = Math.max(maxColumns, row.length);
        }

        return {
            cells,
            rowCount: cells.length,
            columnCount: maxColumns,
        };
    },

    /**
     * Générer le nom de colonne (A, B, ..., Z, AA, AB, ...)
     */
    getColumnName(index: number): string {
        let name = "";
        let num = index;
        while (num >= 0) {
            name = String.fromCharCode(65 + (num % 26)) + name;
            num = Math.floor(num / 26) - 1;
        }
        return name;
    },

    /**
     * Obtenir les extensions de fichiers supportées
     */
    getSupportedExtensions(): string[] {
        return [".csv", ".xlsx", ".xls"];
    },

    /**
     * Obtenir le type MIME accepté pour l'input file
     */
    getAcceptedMimeTypes(): string {
        return ".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel";
    },
};
