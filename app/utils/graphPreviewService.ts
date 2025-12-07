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

            // Sauvegarder le drawGrid original
            const originalDrawGrid = chart.drawGrid.bind(chart);

            // Override drawGrid pour utiliser un fond blanc
            chart.drawGrid = function(chartWidth: number, chartHeight: number) {
                const ctx = this.ctx;

                // Remplir tout le canvas de blanc (pas seulement la zone du graphique)
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, this.width, this.height);

                // Appeler le drawGrid original mais sans le fillRect du fond gris
                ctx.strokeStyle = "#e0e0e0";
                ctx.lineWidth = 1;

                const steps = 10;
                const minValue = this.currentMinScale;
                const maxValue = this.currentMaxScale;
                const range = maxValue - minValue;

                for (let i = 0; i <= steps; i++) {
                    const y = this.padding.top + (chartHeight * i) / steps;
                    const value = maxValue - (range * i) / steps;

                    ctx.beginPath();
                    ctx.moveTo(this.padding.left, y);
                    ctx.lineTo(this.padding.left + chartWidth, y);

                    if (Math.abs(value) < range / steps / 2) {
                        ctx.strokeStyle = "#999";
                        ctx.lineWidth = 2;
                    } else {
                        ctx.strokeStyle = "#e0e0e0";
                        ctx.lineWidth = 1;
                    }
                    ctx.stroke();

                    ctx.fillStyle = "#666";
                    ctx.font = "12px sans-serif";
                    ctx.textAlign = "right";

                    let labelText;
                    if (this.dataFormat === "investment") {
                        labelText = "$" + this.formatNumber(value);
                    } else if (this.dataFormat === "percentage") {
                        labelText = value.toFixed(0) + "%";
                    } else {
                        labelText = this.formatNumber(value);
                    }

                    ctx.fillText(labelText, this.padding.left - 10, y + 4);
                }

                const dateDisplayStep = Math.ceil(this.originalDataLength / 10);
                ctx.fillStyle = "#666";
                ctx.font = "11px sans-serif";
                ctx.textAlign = "center";

                const visiblePoints = Math.floor(this.currentFrame);

                for (
                    let dateIdx = 0;
                    dateIdx < this.originalDataLength;
                    dateIdx += dateDisplayStep
                ) {
                    const frameIdx = dateIdx * this.interpolationSteps;

                    if (frameIdx <= visiblePoints) {
                        let x;
                        if (this.revealMode && visiblePoints > 1) {
                            x =
                                this.padding.left +
                                (chartWidth * frameIdx) / (visiblePoints - 1);
                        } else {
                            x =
                                this.padding.left +
                                (chartWidth * frameIdx) / (this.totalFrames - 1);
                        }

                        if (dateIdx < this.dates.length) {
                            const dateText = this.dates[dateIdx];
                            if (dateText) {
                                ctx.save();
                                ctx.translate(x, this.padding.top + chartHeight + 20);
                                ctx.rotate(-Math.PI / 4);
                                ctx.fillText(dateText, 0, 0);
                                ctx.restore();
                            }
                        }
                    }
                }
            };

            // Dessiner le graphique avec l'échelle correcte
            chart.draw();

            // Restaurer le drawGrid original
            chart.drawGrid = originalDrawGrid;

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
