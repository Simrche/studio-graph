import type { GraphConfig } from "~/types";
import type { ChartData } from "~/utils/StockChart";
import { generateGraphJsonService } from "~/utils/generateGraphJsonService";

class GraphDataService {
    /**
     * Charge et traite les données du graphique en fonction de la configuration
     */
    async loadAndProcessData(config: GraphConfig): Promise<{
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
