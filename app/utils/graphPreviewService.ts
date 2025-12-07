import type { GraphConfig } from "~/types";
import { StockChart } from "~/utils/StockChart";
import { graphDataService } from "~/utils/graphDataService";

class GraphPreviewService {
    /**
     * Génère une preview du graphique en format 16:9
     * @param config Configuration du graphique
     * @param width Largeur de la preview (la hauteur sera calculée en 16:9)
     * @returns Promise d'un buffer de l'image
     */
    async generatePreview(
        config: GraphConfig,
        width: number = 1920
    ): Promise<Buffer> {
        // Calculer la hauteur en respectant le ratio 16:9
        const height = Math.round((width * 9) / 16);

        // Créer un canvas offscreen
        const canvas = this.createOffscreenCanvas(width, height);

        // Créer une instance du chart
        const chart = new StockChart(canvas.id, {
            animationSpeed: 1,
            revealMode: false,
            device: "desktop",
        });

        try {
            // Charger les données
            const processedData = await graphDataService.loadAndProcessData(
                config
            );
            chart.setData(processedData);

            // Précharger les logos
            await chart.preloadLogos();

            // Attendre que l'animation soit terminée pour capturer le graphique final
            chart.currentFrame = chart.totalFrames;
            chart.draw();

            // Convertir le canvas en buffer
            const buffer = await this.canvasToBuffer(canvas);

            // Nettoyer
            chart.destroy();
            this.removeOffscreenCanvas(canvas);

            return buffer;
        } catch (error) {
            chart.destroy();
            this.removeOffscreenCanvas(canvas);
            throw error;
        }
    }

    /**
     * Génère une preview blob pour affichage direct dans le navigateur
     * @param config Configuration du graphique
     * @param width Largeur de la preview
     * @returns Promise d'un Blob de l'image
     */
    async generatePreviewBlob(
        config: GraphConfig,
        width: number = 1920
    ): Promise<Blob> {
        // Calculer la hauteur en respectant le ratio 16:9
        const height = Math.round((width * 9) / 16);

        // Créer un canvas offscreen
        const canvas = this.createOffscreenCanvas(width, height);

        // Créer une instance du chart
        const chart = new StockChart(canvas.id, {
            animationSpeed: 1,
            revealMode: false,
            device: "desktop",
        });

        try {
            // Charger les données
            const processedData = await graphDataService.loadAndProcessData(
                config
            );
            chart.setData(processedData);

            // Précharger les logos
            await chart.preloadLogos();

            // Définir la frame à la fin pour afficher toutes les données
            chart.currentFrame = chart.totalFrames;

            // Recalculer l'échelle dynamique avec toutes les données visibles
            chart.calculateDynamicScale();

            // Forcer la mise à jour des échelles pour qu'elles correspondent aux données finales
            chart.currentMaxScale = chart.targetMaxScale;
            chart.currentMinScale = chart.targetMinScale;

            // Remplir tout le canvas de blanc avant de dessiner
            chart.ctx.fillStyle = "#ffffff";
            chart.ctx.fillRect(0, 0, chart.width, chart.height);

            // Dessiner le graphique avec l'échelle correcte
            chart.draw();

            // Convertir le canvas en blob
            const blob = await this.canvasToBlob(canvas);

            // Nettoyer
            chart.destroy();
            this.removeOffscreenCanvas(canvas);

            return blob;
        } catch (error) {
            chart.destroy();
            this.removeOffscreenCanvas(canvas);
            throw error;
        }
    }

    /**
     * Crée un canvas offscreen dans le DOM
     */
    private createOffscreenCanvas(
        width: number,
        height: number
    ): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        canvas.id = `preview-canvas-${Date.now()}-${Math.random()}`;
        canvas.width = width;
        canvas.height = height;
        canvas.style.position = "absolute";
        canvas.style.left = "-9999px";
        canvas.style.top = "-9999px";
        document.body.appendChild(canvas);
        return canvas;
    }

    /**
     * Supprime le canvas offscreen du DOM
     */
    private removeOffscreenCanvas(canvas: HTMLCanvasElement): void {
        if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }
    }

    /**
     * Convertit un canvas en buffer
     * Note: Cette fonction nécessite un environnement Node.js pour créer un Buffer
     * Dans le navigateur, utiliser generatePreviewBlob à la place
     */
    private async canvasToBuffer(canvas: HTMLCanvasElement): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error("Impossible de créer le blob"));
                    return;
                }

                const reader = new FileReader();
                reader.onloadend = () => {
                    const arrayBuffer = reader.result as ArrayBuffer;
                    const buffer = Buffer.from(arrayBuffer);
                    resolve(buffer);
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(blob);
            }, "image/png");
        });
    }

    /**
     * Convertit un canvas en Blob
     */
    private async canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error("Impossible de créer le blob"));
                    return;
                }
                resolve(blob);
            }, "image/png");
        });
    }

    /**
     * Génère une URL de données pour afficher la preview
     * @param config Configuration du graphique
     * @param width Largeur de la preview
     * @returns Promise d'une URL de données
     */
    async generatePreviewDataUrl(
        config: GraphConfig,
        width: number = 1920
    ): Promise<string> {
        const blob = await this.generatePreviewBlob(config, width);
        return URL.createObjectURL(blob);
    }
}

export const graphPreviewService = new GraphPreviewService();
