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
export type GraphType = "default" | "stocks";

export interface Graph {
    id: number;
    name?: string | null;
    user_id: string;
    created_at: string;
    updated_at: string;
    config: GraphConfig;
    preview_url?: string | null;
    type: GraphType;
}

export interface SpreadsheetCell {
    [column: string]: string | number; // A, B, C, ... AA, AB, etc.
}

export interface DefaultGraphConfig {
    cells: SpreadsheetCell[]; // Chaque élément = une ligne
    labelColumn: string; // Ex: "A"
    imageColumn: string; // Ex: "B"
    colorColumn?: string; // Ex: "C" - Couleur de la ligne (nom CSS ou HEX)
    dataRangeStart: string; // Ex: "D"
    dataRangeEnd: string; // Ex: "F"
    valueSuffix?: string; // Ex: "%", "€", "k"
}

export interface GraphConfig {
    animation: {
        speed: number;
        revealMode: boolean;
        device: "mobile" | "desktop";
    };
    data: {
        displayMode: "percentage" | "price" | "initialAmount";
        startDate: string;
        initialAmount: number;
    };
    tickers: TickerData[];
    default?: DefaultGraphConfig;
}

/**
 * Données de ticker utilisées en interne pour la génération
 */
export interface TickerData {
    symbol: string;
    name: string;
    color: string;
    logoUrl: string | null;
    /** Image personnalisée en attente d'upload (avant "Appliquer") */
    pendingImage?: File | null;
    /** URL de l'image personnalisée uploadée sur le bucket */
    customImageUrl?: string | null;
}
