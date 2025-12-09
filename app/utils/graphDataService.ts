import type { GraphConfig, GraphType } from "~/types";
import type { ChartData } from "~/utils/StockChart";
import { generateGraphJsonService } from "~/utils/generateGraphJsonService";

// Couleurs par défaut pour les lignes du graphique
const DEFAULT_COLORS = [
    "#8B5CF6", // violet
    "#EC4899", // pink
    "#3B82F6", // blue
    "#10B981", // green
    "#F59E0B", // amber
    "#EF4444", // red
    "#06B6D4", // cyan
    "#84CC16", // lime
    "#F97316", // orange
    "#6366F1", // indigo
];

class GraphDataService {
    /**
     * Charge et traite les données du graphique en fonction de la configuration et du type
     */
    async loadAndProcessData(
        config: GraphConfig,
        type: GraphType = "stocks"
    ): Promise<{
        data: ChartData[];
        dates: string[];
        dataFormat: string;
        investmentAmount: number;
        valueSuffix?: string;
    }> {
        if (type === "default") {
            return this.loadDefaultData(config);
        }
        return this.loadStocksData(config);
    }

    /**
     * Charge les données pour le type "default" (spreadsheet)
     */
    private loadDefaultData(config: GraphConfig): {
        data: ChartData[];
        dates: string[];
        dataFormat: string;
        investmentAmount: number;
        valueSuffix?: string;
    } {
        const defaultConfig = config.default;
        if (!defaultConfig || !defaultConfig.cells.length) {
            return {
                data: [],
                dates: [],
                dataFormat: "percentage",
                investmentAmount: config.data.initialAmount,
            };
        }

        const labelCol = defaultConfig.labelColumn ?? "A";
        const imageCol = defaultConfig.imageColumn ?? "B";
        const colorCol = defaultConfig.colorColumn;
        const rangeStart = defaultConfig.dataRangeStart ?? "C";
        const rangeEnd = defaultConfig.dataRangeEnd ?? "Z";
        const cells = defaultConfig.cells;

        if (cells.length < 2) {
            return {
                data: [],
                dates: [],
                dataFormat: "percentage",
                investmentAmount: config.data.initialAmount,
            };
        }

        const startIndex = this.getColumnIndex(rangeStart);
        const endIndex = this.getColumnIndex(rangeEnd);

        // La première ligne contient les labels de l'axe X
        const headerRow = cells[0];
        const dates: string[] = [];
        for (let i = startIndex; i <= endIndex; i++) {
            const colName = this.getColumnName(i);
            const headerValue = headerRow[colName];
            // Utiliser la valeur de l'en-tête ou le nom de colonne par défaut
            dates.push(headerValue ? String(headerValue).trim() : colName);
        }

        // Convertir chaque ligne (à partir de la 2ème) en une série de données
        const data: ChartData[] = [];
        let colorIndex = 0;
        for (let rowIdx = 1; rowIdx < cells.length; rowIdx++) {
            const row = cells[rowIdx];
            const label = row[labelCol];
            if (!label || String(label).trim() === "") continue;

            const values: number[] = [];
            let hasAtLeastOneValue = false;

            for (let i = startIndex; i <= endIndex; i++) {
                const colName = this.getColumnName(i);
                const value = row[colName];

                // Vérifier si la cellule a une vraie valeur (pas vide)
                if (value !== undefined && value !== null && String(value).trim() !== "") {
                    hasAtLeastOneValue = true;
                }

                const numValue = typeof value === "number" ? value : parseFloat(String(value)) || 0;
                values.push(numValue);
            }

            // Ne pas ajouter si aucune valeur réelle dans la plage de données
            if (!hasAtLeastOneValue) continue;

            // Utiliser la couleur de la colonne si définie, sinon couleur par défaut
            let color = DEFAULT_COLORS[colorIndex % DEFAULT_COLORS.length];
            if (colorCol) {
                const customColor = row[colorCol];
                if (customColor && String(customColor).trim() !== "") {
                    color = String(customColor).trim();
                }
            }

            data.push({
                name: String(label),
                logo: String(row[imageCol] ?? ""),
                color,
                originalValues: values,
                values: [],
            });
            colorIndex++;
        }

        const valueSuffix = defaultConfig.valueSuffix ?? "";

        return {
            data,
            dates,
            dataFormat: valueSuffix ? "custom" : "raw",
            investmentAmount: config.data.initialAmount,
            valueSuffix,
        };
    }

    /**
     * Charge les données pour le type "stocks" (API)
     */
    private async loadStocksData(config: GraphConfig): Promise<{
        data: ChartData[];
        dates: string[];
        dataFormat: string;
        investmentAmount: number;
    }> {
        // Générer les données à partir de la config en utilisant le service
        const graphData = await generateGraphJsonService.generateJSON(
            config.tickers,
            config.data.startDate,
            this.getDataFormatForGeneration(config.data.displayMode),
            "Graphique Financier",
            config.data.initialAmount
        );

        // Convertir les données du format GraphData vers ChartData
        const data: ChartData[] = graphData.tickers.map((ticker) => {
            const values = ticker.data.map((point) =>
                this.convertValue(
                    point.value,
                    config.data.displayMode,
                    config.data.initialAmount
                )
            );

            return {
                name: ticker.name,
                logo: ticker.logoUrl,
                color: ticker.color,
                originalValues: values,
                values: [],
            };
        });

        // Déterminer le dataFormat pour StockChart
        const dataFormat = this.getDataFormat(config.data.displayMode);

        return {
            data,
            dates: graphData.weeks,
            dataFormat,
            investmentAmount: config.data.initialAmount,
        };
    }

    /**
     * Génère le nom de colonne (A, B, ..., Z, AA, AB, ...)
     */
    private getColumnName(index: number): string {
        let name = "";
        let num = index;
        while (num >= 0) {
            name = String.fromCharCode(65 + (num % 26)) + name;
            num = Math.floor(num / 26) - 1;
        }
        return name;
    }

    /**
     * Obtient l'index d'une colonne à partir de son nom
     */
    private getColumnIndex(name: string): number {
        let index = 0;
        for (let i = 0; i < name.length; i++) {
            index = index * 26 + (name.charCodeAt(i) - 64);
        }
        return index - 1;
    }

    /**
     * Convertit une valeur selon le mode d'affichage
     */
    private convertValue(
        value: number,
        displayMode: "percentage" | "price" | "initialAmount",
        initialAmount: number
    ): number {
        switch (displayMode) {
            case "percentage":
                return value;
            case "initialAmount":
                return initialAmount * (1 + value / 100);
            case "price":
                return value;
            default:
                return value;
        }
    }

    /**
     * Détermine le format de données pour la génération
     */
    private getDataFormatForGeneration(
        displayMode: "percentage" | "price" | "initialAmount"
    ): "percentage" | "price" | "investment" {
        switch (displayMode) {
            case "percentage":
            case "initialAmount":
                return "percentage";
            case "price":
                return "price";
            default:
                return "percentage";
        }
    }

    /**
     * Détermine le format de données pour StockChart
     */
    private getDataFormat(
        displayMode: "percentage" | "price" | "initialAmount"
    ): string {
        switch (displayMode) {
            case "percentage":
                return "percentage";
            case "initialAmount":
                return "investment";
            case "price":
                return "price";
            default:
                return "percentage";
        }
    }
}

export const graphDataService = new GraphDataService();
