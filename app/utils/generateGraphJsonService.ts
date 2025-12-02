import type {
    GraphData,
    TickerData,
    TickerInfo,
    WeeklyDataPoint,
} from "~/types";
import { datesService } from "./datesService";
import { $fetch } from "ofetch";
import type { ChartResultArray } from "yahoo-finance2/modules/chart";

class GenerateGraphJsonService {
    /**
     * Génère un objet JSON avec les données hebdomadaires de tous les tickers
     */
    async generateJSON(
        tickers: TickerData[],
        startDate: string,
        dataFormat: "price" | "percentage" | "investment",
        title: string = "Graphique Financier",
        investmentAmount: number = 10000
    ): Promise<GraphData> {
        const start = new Date(startDate);
        const end = new Date();

        // Générer toutes les semaines (lundis)
        const allWeeks = datesService.generateWeekRange(start, end);

        // Récupérer les données pour chaque ticker
        const tickersDataMaps = await Promise.all(
            tickers.map(async (ticker) => {
                const historicalData = await $fetch<ChartResultArray>(
                    `/api/get-ticker-historical-data?symbol=${ticker.symbol}&start=${start}&end=${end}`
                );
                let interpolatedData = this.interpolateWeeklyData(
                    allWeeks,
                    historicalData
                );

                // Convertir en pourcentage si nécessaire (pour investment aussi, car c'est la base)
                if (
                    dataFormat === "percentage" ||
                    dataFormat === "investment"
                ) {
                    interpolatedData = this.convertToPercentage(
                        allWeeks,
                        interpolatedData
                    );
                }

                return {
                    symbol: ticker.symbol,
                    name: ticker.name,
                    logoUrl: ticker.logoUrl || "",
                    color: ticker.color,
                    data: interpolatedData,
                };
            })
        );

        // Créer la liste des semaines au format court
        const weeks = allWeeks.map((week) =>
            datesService.formatDateShort(week)
        );

        // Créer la liste des tickers avec leurs données intégrées
        const tickersInfo: TickerInfo[] = tickersDataMaps.map(
            (tickerDataMap) => {
                const data: WeeklyDataPoint[] = allWeeks.map((week) => {
                    const weekKey = datesService.formatDate(week);
                    const value = tickerDataMap.data.get(weekKey);

                    return {
                        week: datesService.formatDateShort(week),
                        value:
                            value !== undefined ? Number(value.toFixed(2)) : 0,
                    };
                });

                return {
                    symbol: tickerDataMap.symbol,
                    name: tickerDataMap.name,
                    color: tickerDataMap.color,
                    logoUrl: tickerDataMap.logoUrl,
                    data,
                };
            }
        );

        // Construire l'objet JSON
        const graphData: GraphData = {
            title,
            tickers: tickersInfo,
            startDate,
            dataFormat,
            weeks,
            investmentAmount,
        };

        return graphData;
    }

    /**
     * Convertit les données en pourcentages par rapport à la première valeur
     */
    private convertToPercentage(
        allWeeks: Date[],
        data: Map<string, number>
    ): Map<string, number> {
        const percentageData = new Map<string, number>();

        // Trouver la première valeur (valeur de base)
        let baseValue: number | null = null;
        for (const week of allWeeks) {
            const weekKey = datesService.formatDate(week);
            const value = data.get(weekKey);
            if (value !== undefined && value !== null) {
                baseValue = value;
                break;
            }
        }

        if (baseValue === null || baseValue === 0) {
            // Pas de valeur de base, retourner des pourcentages à 0
            allWeeks.forEach((week) => {
                const weekKey = datesService.formatDate(week);
                percentageData.set(weekKey, 0);
            });
            return percentageData;
        }

        // Calculer le pourcentage pour chaque semaine
        allWeeks.forEach((week) => {
            const weekKey = datesService.formatDate(week);
            const value = data.get(weekKey);
            if (value !== undefined) {
                const percentage = ((value - baseValue!) / baseValue!) * 100;
                percentageData.set(weekKey, percentage);
            }
        });

        return percentageData;
    }

    /**
     * Interpole les valeurs manquantes dans les données historiques hebdomadaires
     * Utilise l'interpolation linéaire pour les semaines manquantes
     */
    private interpolateWeeklyData(
        allWeeks: Date[],
        historicalData: ChartResultArray
    ): Map<string, number> {
        const result = new Map<string, number>();

        // Créer une map des données existantes (par début de semaine)
        const dataMap = new Map<string, number | null>();
        historicalData.quotes.forEach((point) => {
            // Ignorer les quotes avec un champ close null
            if (point.close === null || point.close === undefined) return;
            const weekStart = datesService.getWeekStart(new Date(point.date));
            const weekKey = datesService.formatDate(weekStart);
            dataMap.set(weekKey, point.close);
        });

        // Pour chaque semaine dans la plage
        for (let i = 0; i < allWeeks.length; i++) {
            const currentWeek = allWeeks[i]!;
            const weekKey = datesService.formatDate(currentWeek);

            if (dataMap.has(weekKey)) {
                // Donnée existante
                result.set(weekKey, dataMap.get(weekKey)!);
            } else {
                // Donnée manquante - interpolation linéaire
                // Trouver la dernière valeur connue avant cette semaine
                let prevValue: number | null = null;
                let prevIndex = i - 1;
                while (prevIndex >= 0 && prevValue === null) {
                    const prevKey = datesService.formatDate(
                        allWeeks[prevIndex]!
                    );
                    if (dataMap.has(prevKey)) {
                        prevValue = dataMap.get(prevKey)!;
                    } else if (result.has(prevKey)) {
                        prevValue = result.get(prevKey)!;
                    }
                    prevIndex--;
                }

                // Trouver la prochaine valeur connue après cette semaine
                let nextValue: number | null = null;
                let nextIndex = i + 1;
                let weeksToNext = 0;
                while (nextIndex < allWeeks.length && nextValue === null) {
                    const nextKey = datesService.formatDate(
                        allWeeks[nextIndex]!
                    );
                    if (dataMap.has(nextKey)) {
                        nextValue = dataMap.get(nextKey)!;
                        weeksToNext = nextIndex - i;
                    }
                    nextIndex++;
                }

                // Calculer la valeur interpolée
                if (prevValue !== null && nextValue !== null) {
                    const weeksFromPrev = i - (prevIndex + 1);
                    const totalWeeks = weeksToNext + weeksFromPrev;
                    const interpolated =
                        prevValue +
                        ((nextValue - prevValue) * weeksFromPrev) / totalWeeks;
                    result.set(weekKey, interpolated);
                } else if (prevValue !== null) {
                    // Seulement une valeur précédente, on la garde
                    result.set(weekKey, prevValue);
                } else if (nextValue !== null) {
                    // Seulement une valeur suivante, on la garde
                    result.set(weekKey, nextValue);
                }
                // Sinon on ne peut pas interpoler (aucune donnée disponible)
            }
        }

        return result;
    }
}

export const generateGraphJsonService = new GenerateGraphJsonService();
