/**
 * Service de génération de vidéos haute qualité pour les graphiques
 *
 * Utilise webm-muxer pour encoder chaque frame individuellement,
 * garantissant une fluidité parfaite sans dépendre du timing temps réel.
 */

import { Muxer, ArrayBufferTarget } from "webm-muxer";
import type { GraphConfig } from "~/types";
import { StockChart } from "~/utils/StockChart";
import { graphDataService } from "~/utils/graphDataService";

interface VideoOptions {
    width?: number;
    fps?: number;
    videoBitrate?: number;
    signal?: AbortSignal;
    onProgress?: (progress: number, estimatedTimeRemaining: number) => void;
}

class GraphVideoService {
    /**
     * Génère une vidéo du graphique avec l'animation complète
     * Utilise l'encodage frame-by-frame pour une fluidité parfaite
     */
    async generateVideo(
        config: GraphConfig,
        options: VideoOptions = {}
    ): Promise<Blob> {
        const {
            width = 1920,
            fps = 60,
            videoBitrate = 25000000,
            signal,
            onProgress,
        } = options;

        // Vérifier si annulé dès le début
        if (signal?.aborted) {
            throw new DOMException("Génération annulée", "AbortError");
        }

        // Calculer la hauteur selon le device
        const isDesktop = config.animation.device === "desktop";
        const height = isDesktop
            ? Math.round((width * 9) / 16)
            : Math.round((width * 16) / 9);

        // Créer un canvas offscreen (avec wrapper pour mobile)
        const isMobile = !isDesktop;
        const canvas = this.createOffscreenCanvas(width, height, isMobile);

        // Créer une instance du chart
        const chart = new StockChart(canvas.id, {
            animationSpeed: config.animation.speed,
            revealMode: config.animation.revealMode,
            device: config.animation.device,
        });

        // Pour le mobile, on applique un scale pour que les éléments soient plus gros
        if (!isDesktop) {
            canvas.width = width;
            canvas.height = height;
            chart.ctx.setTransform(1, 0, 0, 1, 0, 0);

            const previewWidth = 350;
            const scaleFactor = width / previewWidth;
            chart.ctx.scale(scaleFactor, scaleFactor);
            chart.width = previewWidth;
            chart.height = Math.round(previewWidth * (16 / 9));
        }

        try {
            // Charger les données
            const processedData = await graphDataService.loadAndProcessData(
                config
            );
            chart.setData(processedData);

            // Précharger les logos
            await chart.preloadLogos();

            // Override drawGrid pour utiliser un fond blanc
            chart.drawGrid = this.createWhiteBackgroundDrawGrid(chart);

            // Reset l'animation
            chart.currentFrame = 0;
            chart.calculateInitialScale();

            const totalFrames = chart.totalFrames;

            // Calculer la durée de l'animation (en secondes)
            // L'animation originale tourne à ~60 FPS avec animationSpeed
            const animationDurationSec =
                totalFrames / chart.animationSpeed / 60;
            const totalVideoFrames = Math.ceil(animationDurationSec * fps);

            // Créer le muxer WebM avec VideoEncoder
            const muxer = new Muxer({
                target: new ArrayBufferTarget(),
                video: {
                    codec: "V_VP9",
                    width,
                    height,
                    frameRate: fps,
                },
                firstTimestampBehavior: "offset",
            });

            // Créer l'encodeur vidéo
            const encoder = new VideoEncoder({
                output: (chunk, meta) => {
                    muxer.addVideoChunk(chunk, meta);
                },
                error: (e) => {
                    console.error("Encoder error:", e);
                },
            });

            encoder.configure({
                codec: "vp09.00.10.08",
                width,
                height,
                bitrate: videoBitrate,
                framerate: fps,
            });

            // Variables pour estimer le temps restant
            const startTime = performance.now();
            let lastProgressUpdate = 0;

            // Générer chaque frame
            for (
                let frameIndex = 0;
                frameIndex <= totalVideoFrames;
                frameIndex++
            ) {
                // Vérifier si annulé
                if (signal?.aborted) {
                    encoder.close();
                    throw new DOMException("Génération annulée", "AbortError");
                }

                // Attendre si la file d'attente de l'encodeur est trop pleine
                // Cela évite les problèmes de mémoire et de freeze
                while (encoder.encodeQueueSize > 10) {
                    await new Promise((resolve) => setTimeout(resolve, 1));
                }

                // Calculer la progression de l'animation
                const progress = frameIndex / totalVideoFrames;

                // Mettre à jour la progression toutes les 2%
                if (onProgress && progress - lastProgressUpdate >= 0.02) {
                    lastProgressUpdate = progress;
                    const elapsedTime = performance.now() - startTime;
                    const estimatedTotalTime = elapsedTime / progress;
                    const estimatedTimeRemaining = Math.max(
                        0,
                        (estimatedTotalTime - elapsedTime) / 1000
                    );
                    onProgress(progress * 100, estimatedTimeRemaining);
                }
                chart.currentFrame = Math.min(
                    progress * totalFrames,
                    totalFrames
                );

                // Dessiner la frame
                chart.draw();

                // Créer un VideoFrame à partir du canvas
                const frame = new VideoFrame(canvas, {
                    timestamp: (frameIndex * 1000000) / fps, // timestamp en microsecondes
                    duration: 1000000 / fps,
                });

                // Encoder la frame (keyframe toutes les 60 frames)
                const keyFrame = frameIndex % 60 === 0;
                encoder.encode(frame, { keyFrame });

                // Libérer le frame immédiatement
                frame.close();
            }

            // Attendre que l'encodage soit terminé
            await encoder.flush();
            encoder.close();

            // Finaliser le muxer
            muxer.finalize();

            // Récupérer le buffer
            const { buffer } = muxer.target as ArrayBufferTarget;

            // Nettoyer
            chart.destroy();
            this.removeOffscreenCanvas(canvas, isMobile);

            return new Blob([buffer], { type: "video/webm" });
        } catch (error) {
            chart.destroy();
            this.removeOffscreenCanvas(canvas, isMobile);
            throw error;
        }
    }

    /**
     * Crée une fonction drawGrid personnalisée avec fond blanc
     */
    private createWhiteBackgroundDrawGrid(
        _chart: StockChart
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
     * Crée un canvas offscreen dans le DOM
     * Pour mobile, utilise un wrapper parent car StockChart.setupCanvas() utilise parent.getBoundingClientRect()
     */
    private createOffscreenCanvas(
        width: number,
        height: number,
        useWrapper: boolean = false
    ): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        canvas.id = `video-canvas-${Date.now()}-${Math.random()}`;
        canvas.width = width;
        canvas.height = height;

        if (useWrapper) {
            // Mobile: créer un wrapper parent avec les dimensions exactes
            const wrapper = document.createElement("div");
            wrapper.id = `video-canvas-wrapper-${Date.now()}-${Math.random()}`;
            wrapper.style.position = "absolute";
            wrapper.style.left = "-9999px";
            wrapper.style.top = "-9999px";
            wrapper.style.width = `${width}px`;
            wrapper.style.height = `${height}px`;
            document.body.appendChild(wrapper);

            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            wrapper.appendChild(canvas);
        } else {
            // Desktop: canvas directement dans le body
            canvas.style.position = "absolute";
            canvas.style.left = "-9999px";
            canvas.style.top = "-9999px";
            document.body.appendChild(canvas);
        }

        return canvas;
    }

    /**
     * Supprime le canvas offscreen du DOM
     */
    private removeOffscreenCanvas(
        canvas: HTMLCanvasElement,
        hasWrapper: boolean = false
    ): void {
        if (hasWrapper) {
            const wrapper = canvas.parentNode;
            if (wrapper && wrapper.parentNode) {
                wrapper.parentNode.removeChild(wrapper);
            }
        } else {
            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        }
    }

    /**
     * Génère une URL pour télécharger la vidéo
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

        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
}

export const graphVideoService = new GraphVideoService();
