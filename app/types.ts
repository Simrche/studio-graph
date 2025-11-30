/**
 * Types et interfaces pour l'application Finance Videos
 */

/**
 * Point de données hebdomadaire
 */
export interface WeeklyDataPoint {
    week: string;
    value: number;
}

/**
 * Information sur un ticker avec ses données historiques
 */
export interface TickerInfo {
    symbol: string;
    name: string;
    color: string;
    logoUrl: string;
    data: WeeklyDataPoint[];
}

export interface GraphConfig {
    animation: {
        speed: number;
        revealMode: boolean;
    };
    data: {
        displayMode: "percentage" | "price" | "initialAmount";
        startDate: string;
        initialAmount: number;
    };
    tickers: TickerData[];
}

/**
 * Données complètes du graphique
 */
export interface GraphData {
    title: string;
    tickers: TickerInfo[];
    startDate: string;
    dataFormat: "price" | "percentage" | "investment";
    weeks: string[];
    investmentAmount?: number;
}

/**
 * Données de ticker utilisées en interne pour la génération
 */
export interface TickerData {
    symbol: string;
    name: string;
    color: string;
    logoUrl: string | null;
}
