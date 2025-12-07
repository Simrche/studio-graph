import type { GraphConfig } from "~/types";
import { StockChart } from "~/utils/StockChart";
import { graphDataService } from "~/utils/graphDataService";

interface VideoOptions {
    width?: number;
    fps?: number;
    videoBitrate?: number;
}

class GraphVideoService {
    /**
     * Génère une vidéo du graphique avec l'animation complète
     * @param config Configuration du graphique
     * @param options Options pour la vidéo (width, fps, bitrate)
     * @returns Promise d'un Blob contenant la vidéo
     */
    async generateVideo(
        config: GraphConfig,
        options: VideoOptions = {}
    ): Promise<Blob> {
        const {
            width = 1920,
            fps = 60,
            videoBitrate = 10000000, // 10 Mbps pour une haute qualité
        } = options;

        // Calculer la hauteur selon le device
        const isDesktop = config.animation.device === "desktop";
        const height = isDesktop
            ? Math.round((width * 9) / 16)
            : Math.round((width * 16) / 9);

        // Créer un canvas offscreen
        const canvas = this.createOffscreenCanvas(width, height);

        // Créer une instance du chart avec les paramètres de la config
        const chart = new StockChart(canvas.id, {
            animationSpeed: config.animation.speed,
            revealMode: config.animation.revealMode,
            device: config.animation.device,
        });

        try {
            // Charger les données
            const processedData = await graphDataService.loadAndProcessData(
                config
            );
            chart.setData(processedData);

            // Précharger les logos
            await chart.preloadLogos();

            // Override drawGrid pour utiliser un fond blanc au lieu de gris
            const originalDrawGrid = chart.drawGrid.bind(chart);
            chart.drawGrid = this.createWhiteBackgroundDrawGrid(
                chart,
                originalDrawGrid
            );

            // Créer le stream vidéo
            const stream = canvas.captureStream(fps);
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: this.getSupportedMimeType(),
                videoBitsPerSecond: videoBitrate,
            });

            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            // Démarrer l'enregistrement
            mediaRecorder.start();

            // Reset l'animation au début
            chart.currentFrame = 0;
            chart.calculateInitialScale();
            chart.isAnimating = true;

            // Calculer le nombre de frames total basé sur la durée de l'animation
            const totalFrames = chart.totalFrames;
            const frameDuration = 1000 / fps; // Durée d'une frame en ms

            // Animer frame par frame
            await this.animateChart(chart, totalFrames, frameDuration);

            // Arrêter l'enregistrement
            mediaRecorder.stop();

            // Attendre que toutes les données soient disponibles
            const videoBlob = await new Promise<Blob>((resolve, reject) => {
                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, {
                        type: this.getSupportedMimeType(),
                    });
                    resolve(blob);
                };
                mediaRecorder.onerror = reject;
            });

            // Nettoyer
            chart.destroy();
            this.removeOffscreenCanvas(canvas);

            return videoBlob;
        } catch (error) {
            chart.destroy();
            this.removeOffscreenCanvas(canvas);
            throw error;
        }
    }

    /**
     * Anime le chart frame par frame
     */
    private async animateChart(
        chart: StockChart,
        totalFrames: number,
        frameDuration: number
    ): Promise<void> {
        return new Promise((resolve) => {
            const animate = () => {
                if (chart.currentFrame < totalFrames) {
                    chart.draw();
                    chart.currentFrame += chart.animationSpeed;

                    if (chart.currentFrame > totalFrames) {
                        chart.currentFrame = totalFrames;
                    }

                    setTimeout(() => {
                        requestAnimationFrame(animate);
                    }, frameDuration);
                } else {
                    // Dessiner la dernière frame
                    chart.currentFrame = totalFrames;
                    chart.draw();

                    // Attendre un peu avant de terminer pour s'assurer que la dernière frame est bien capturée
                    setTimeout(resolve, frameDuration * 10);
                }
            };

            animate();
        });
    }

    /**
     * Crée une fonction drawGrid personnalisée avec fond blanc
     */
    private createWhiteBackgroundDrawGrid(
        chart: StockChart,
        originalDrawGrid: (chartWidth: number, chartHeight: number) => void
    ): (chartWidth: number, chartHeight: number) => void {
        return function (
            this: StockChart,
            chartWidth: number,
            chartHeight: number
        ) {
            const ctx = this.ctx;

            // Remplir tout le canvas de blanc
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, this.width, this.height);

            // Dessiner la grille
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
                            ctx.translate(
                                x,
                                this.padding.top + chartHeight + 20
                            );
                            ctx.rotate(-Math.PI / 4);
                            ctx.fillText(dateText, 0, 0);
                            ctx.restore();
                        }
                    }
                }
            }
        };
    }

    /**
     * Retourne le type MIME supporté pour l'enregistrement vidéo
     */
    private getSupportedMimeType(): string {
        const types = [
            "video/webm;codecs=vp9",
            "video/webm;codecs=vp8",
            "video/webm",
            "video/mp4",
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }

        return "video/webm";
    }

    /**
     * Crée un canvas offscreen dans le DOM
     */
    private createOffscreenCanvas(
        width: number,
        height: number
    ): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        canvas.id = `video-canvas-${Date.now()}-${Math.random()}`;
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
     * Génère une URL pour télécharger la vidéo
     * @param config Configuration du graphique
     * @param options Options pour la vidéo
     * @returns Promise d'une URL de téléchargement
     */
    async generateVideoUrl(
        config: GraphConfig,
        options: VideoOptions = {}
    ): Promise<string> {
        const blob = await this.generateVideo(config, options);
        return URL.createObjectURL(blob);
    }

    /**
     * Télécharge directement la vidéo générée
     * @param config Configuration du graphique
     * @param filename Nom du fichier de sortie
     * @param options Options pour la vidéo
     */
    async downloadVideo(
        config: GraphConfig,
        filename: string = "graph-animation.webm",
        options: VideoOptions = {}
    ): Promise<void> {
        const blob = await this.generateVideo(config, options);
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Nettoyer l'URL après un délai
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
}

export const graphVideoService = new GraphVideoService();
