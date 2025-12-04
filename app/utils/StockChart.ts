export interface ChartData {
    name: string;
    logo: string;
    color: string;
    originalValues: number[];
    values: number[];
}

export interface JsonData {
    weeks: string[];
    tickers: {
        symbol: string;
        name: string;
        color: string;
        logoUrl: string;
        data: { week: string; value: number }[];
    }[];
    dataFormat?: string;
    investmentAmount?: number;
}

export interface StockChartOptions {
    animationSpeed?: number;
    revealMode?: boolean;
    device?: "mobile" | "desktop";
}

export class StockChart {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    data: ChartData[] = [];
    dates: string[] = [];
    currentFrame = 0;
    totalFrames = 0;
    animationSpeed = 0.5;
    device = "desktop";
    isAnimating = false;
    revealMode = true;
    padding = {
        top: 60,
        right: 150,
        bottom: 60,
        left: 100,
    };
    maxScale = 0;
    minScale = 0;
    currentMaxScale = 0;
    currentMinScale = 0;
    targetMaxScale = 0;
    targetMinScale = 0;
    logos: Record<string, HTMLImageElement | null> = {};
    interpolationSteps = 5;
    dataFormat = "percentage";
    investmentAmount = 10000;
    originalDataLength = 0;
    width = 0;
    height = 0;

    constructor(canvasId: string, options?: StockChartOptions) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) throw new Error(`Canvas with id "${canvasId}" not found`);

        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get 2D context");
        this.ctx = ctx;

        if (options?.animationSpeed !== undefined) {
            this.animationSpeed = options.animationSpeed;
        }
        if (options?.revealMode !== undefined) {
            this.revealMode = options.revealMode;
        }
        if (options?.device !== undefined) {
            this.device = options.device;
        }

        // Initialiser le padding en fonction du device
        if (this.device === "mobile") {
            this.padding = {
                top: 30,
                right: 20,
                bottom: 40,
                left: 60,
            };
        }

        this.setupCanvas();
    }

    setupCanvas() {
        const parent = this.canvas.parentElement;
        if (!parent) return;

        const rect = parent.getBoundingClientRect();
        const dpr = window.devicePixelRatio;

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        // Réinitialiser la transformation avant de réappliquer le scale
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);

        this.width = rect.width;
        this.height = rect.height;
    }

    async loadData(dataUrl: string) {
        try {
            const response = await fetch(dataUrl);
            const jsonData: JsonData = await response.json();
            this.parseJSON(jsonData);
            await this.preloadLogos();
        } catch (error) {
            console.error("Erreur de chargement:", error);
        }
    }

    /**
     * Définit les données du graphique directement
     */
    setData(processedData: {
        data: ChartData[];
        dates: string[];
        dataFormat: string;
        investmentAmount: number;
    }) {
        this.dates = processedData.dates;
        this.originalDataLength = this.dates.length;
        this.dataFormat = processedData.dataFormat;
        this.investmentAmount = processedData.investmentAmount;
        this.data = [];
        this.maxScale = -Infinity;
        this.minScale = Infinity;

        for (const company of processedData.data) {
            const chartData: ChartData = {
                name: company.name,
                logo: company.logo,
                color: company.color,
                originalValues: company.originalValues,
                values: [],
            };

            for (const numValue of company.originalValues) {
                if (numValue > this.maxScale) {
                    this.maxScale = numValue;
                }
                if (numValue < this.minScale) {
                    this.minScale = numValue;
                }
            }

            chartData.values = this.interpolateValues(chartData.originalValues);
            this.data.push(chartData);
        }

        this.totalFrames =
            (this.originalDataLength - 1) * this.interpolationSteps + 1;
        this.calculateInitialScale();
    }

    parseJSON(jsonData: JsonData) {
        this.dates = jsonData.weeks || [];
        this.originalDataLength = this.dates.length;

        this.dataFormat = jsonData.dataFormat || "percentage";
        this.investmentAmount = jsonData.investmentAmount || 10000;

        for (const ticker of jsonData.tickers) {
            const company: ChartData = {
                name: ticker.name,
                logo: ticker.logoUrl,
                color: ticker.color,
                originalValues: [],
                values: [],
            };

            for (const dataPoint of ticker.data) {
                let numValue = dataPoint.value;

                if (this.dataFormat === "investment") {
                    numValue = this.investmentAmount * (1 + numValue / 100);
                }

                company.originalValues.push(numValue);

                if (numValue > this.maxScale) {
                    this.maxScale = numValue;
                }
                if (numValue < this.minScale) {
                    this.minScale = numValue;
                }
            }

            company.values = this.interpolateValues(company.originalValues);
            this.data.push(company);
        }

        this.totalFrames =
            (this.originalDataLength - 1) * this.interpolationSteps + 1;
        this.calculateInitialScale();
    }

    interpolateValues(originalValues: number[]): number[] {
        if (originalValues.length < 2) return originalValues;

        const interpolated: number[] = [];

        for (let i = 0; i < originalValues.length - 1; i++) {
            const current = originalValues[i]!;
            const next = originalValues[i + 1];

            interpolated.push(current);

            for (let step = 1; step < this.interpolationSteps; step++) {
                const t = step / this.interpolationSteps;
                const interpolatedValue = current + (next - current) * t;
                interpolated.push(interpolatedValue);
            }
        }

        interpolated.push(originalValues[originalValues.length - 1]);
        return interpolated;
    }

    formatNumber(value: number): string {
        const absValue = Math.abs(value);

        if (absValue >= 1000000) {
            return (value / 1000000).toFixed(2) + "M";
        } else if (absValue >= 10000) {
            return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        } else if (absValue >= 100) {
            return value.toFixed(0);
        } else if (absValue >= 10) {
            return value.toFixed(1);
        } else if (absValue >= 1) {
            return value.toFixed(2);
        } else {
            return value.toFixed(3);
        }
    }

    async preloadLogos() {
        const logoPromises = this.data.map((company) => {
            return new Promise<void>((resolve) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    this.logos[company.name] = img;
                    resolve();
                };
                img.onerror = () => {
                    this.logos[company.name] = null;
                    resolve();
                };
                img.src = company.logo;
            });
        });

        await Promise.all(logoPromises);
        this.startAnimation();
    }

    calculateInitialScale() {
        if (this.data.length === 0) {
            return;
        }

        let min = Infinity;
        let max = -Infinity;

        this.data.forEach((company) => {
            if (company.values.length > 0) {
                const firstValue = company.values[0];
                if (firstValue < min) min = firstValue;
                if (firstValue > max) max = firstValue;
            }
        });

        if (min === max) {
            if (this.dataFormat === "percentage") {
                min = Math.max(min - 50, -100);
                max = max + 50;
            } else {
                const margin = Math.abs(max) * 0.1 || 10;
                min = max - margin;
                max = max + margin;
            }
        }

        if (this.dataFormat === "percentage") {
            max = Math.max(max, 100);
        } else if (
            this.dataFormat === "investment" ||
            this.dataFormat === "price"
        ) {
            const range = max - min;
            const margin = Math.max(range * 0.1, Math.abs(max) * 0.1);
            max = max + margin;
        }

        const roundingFactor = this.getRoundingFactor(min, max);

        this.currentMaxScale = Math.ceil(max / roundingFactor) * roundingFactor;
        this.currentMinScale =
            Math.floor(min / roundingFactor) * roundingFactor;
        this.targetMaxScale = this.currentMaxScale;
        this.targetMinScale = this.currentMinScale;
    }

    getRoundingFactor(min: number, max: number): number {
        const range = Math.abs(max - min);
        const maxAbs = Math.max(Math.abs(min), Math.abs(max));

        if (this.dataFormat === "percentage") {
            if (range < 10) return 1;
            if (range < 50) return 5;
            if (range < 200) return 10;
            return 100;
        }

        if (this.dataFormat === "price" || this.dataFormat === "investment") {
            if (maxAbs < 1) {
                if (range < 0.1) return 0.01;
                if (range < 0.5) return 0.05;
                if (range < 2) return 0.1;
                return 0.5;
            } else if (maxAbs < 10) {
                if (range < 2) return 0.5;
                if (range < 5) return 1;
                return 2;
            } else if (maxAbs < 100) {
                if (range < 10) return 2;
                if (range < 50) return 5;
                return 10;
            } else if (maxAbs < 1000) {
                if (range < 100) return 10;
                if (range < 500) return 25;
                return 50;
            } else if (maxAbs < 10000) {
                if (range < 1000) return 50;
                if (range < 5000) return 100;
                return 250;
            } else {
                if (range < 10000) return 500;
                if (range < 50000) return 1000;
                return 5000;
            }
        }

        if (maxAbs < 1) {
            if (range < 0.1) return 0.01;
            if (range < 0.5) return 0.05;
            if (range < 2) return 0.1;
            return 0.5;
        } else if (maxAbs < 10) {
            if (range < 2) return 0.5;
            if (range < 5) return 1;
            return 2;
        } else if (maxAbs < 100) {
            if (range < 10) return 2;
            if (range < 50) return 5;
            return 10;
        } else if (maxAbs < 1000) {
            if (range < 100) return 10;
            if (range < 500) return 50;
            return 100;
        } else if (maxAbs < 10000) {
            if (range < 1000) return 100;
            if (range < 5000) return 500;
            return 1000;
        } else {
            if (range < 10000) return 1000;
            if (range < 50000) return 5000;
            return 10000;
        }
    }

    calculateDynamicScale() {
        const visiblePoints = Math.floor(this.currentFrame);
        if (visiblePoints < 1) {
            return;
        }

        let max = -Infinity;
        let min = Infinity;

        this.data.forEach((company) => {
            for (
                let i = 0;
                i < visiblePoints && i < company.values.length;
                i++
            ) {
                const value = company.values[i];
                if (value > max) max = value;
                if (value < min) min = value;
            }
        });

        if (max === -Infinity || min === Infinity) {
            return;
        }

        if (this.dataFormat === "percentage") {
            max = Math.max(max, 100);
        } else if (
            this.dataFormat === "investment" ||
            this.dataFormat === "price"
        ) {
            const range = max - min;
            const margin = Math.max(range * 0.1, Math.abs(max) * 0.1);
            max = max + margin;
        }

        const roundingFactor = this.getRoundingFactor(min, max);

        this.targetMaxScale = Math.ceil(max / roundingFactor) * roundingFactor;
        this.targetMinScale = Math.floor(min / roundingFactor) * roundingFactor;

        const smoothingFactor = 0.1;
        this.currentMaxScale +=
            (this.targetMaxScale - this.currentMaxScale) * smoothingFactor;
        this.currentMinScale +=
            (this.targetMinScale - this.currentMinScale) * smoothingFactor;
    }

    startAnimation() {
        this.currentFrame = 0;
        this.calculateInitialScale();
        this.isAnimating = true;
        this.animate();
    }

    restartAnimation() {
        this.startAnimation();
    }

    pauseAnimation() {
        this.isAnimating = false;
    }

    resumeAnimation() {
        if (this.currentFrame < this.totalFrames) {
            this.isAnimating = true;
            this.animate();
        }
    }

    setAnimationSpeed(speed: number) {
        this.animationSpeed = speed;
    }

    setRevealMode(revealMode: boolean) {
        this.revealMode = revealMode;
        this.draw();
    }

    setDevice(device: "mobile" | "desktop") {
        this.device = device;
        this.updatePadding();
        this.draw();
    }

    updatePadding() {
        if (this.device === "mobile") {
            this.padding = {
                top: 30,
                right: 20,
                bottom: 40,
                left: 60,
            };
        } else {
            this.padding = {
                top: 60,
                right: 150,
                bottom: 60,
                left: 100,
            };
        }
    }

    animate() {
        if (!this.isAnimating) return;

        this.draw();

        if (this.currentFrame < this.totalFrames) {
            this.currentFrame += this.animationSpeed;
            if (this.currentFrame > this.totalFrames) {
                this.currentFrame = this.totalFrames;
            }
            requestAnimationFrame(() => this.animate());
        } else {
            this.isAnimating = false;
        }
    }

    draw() {
        this.calculateDynamicScale();

        this.ctx.clearRect(0, 0, this.width, this.height);

        const chartWidth = this.width - this.padding.left - this.padding.right;
        const chartHeight =
            this.height - this.padding.top - this.padding.bottom;

        this.drawGrid(chartWidth, chartHeight);

        this.data.forEach((company) => {
            this.drawLine(company, chartWidth, chartHeight);
        });
    }

    drawGrid(chartWidth: number, chartHeight: number) {
        const ctx = this.ctx;

        ctx.fillStyle = "#fafafa";
        ctx.fillRect(
            this.padding.left,
            this.padding.top,
            chartWidth,
            chartHeight
        );

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
                    ctx.save();
                    ctx.translate(x, this.padding.top + chartHeight + 20);
                    ctx.rotate(-Math.PI / 4);
                    ctx.fillText(this.dates[dateIdx], 0, 0);
                    ctx.restore();
                }
            }
        }
    }

    drawLine(company: ChartData, chartWidth: number, chartHeight: number) {
        const ctx = this.ctx;
        const minValue = this.currentMinScale;
        const maxValue = this.currentMaxScale;
        const range = maxValue - minValue;
        const visiblePoints = Math.floor(this.currentFrame);

        if (visiblePoints < 2) return;

        ctx.strokeStyle = company.color;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();

        const points: { x: number; y: number }[] = [];
        for (let i = 0; i < visiblePoints && i < company.values.length; i++) {
            let x;
            if (this.revealMode && visiblePoints > 1) {
                x = this.padding.left + (chartWidth * i) / (visiblePoints - 1);
            } else {
                x =
                    this.padding.left +
                    (chartWidth * i) / (this.totalFrames - 1);
            }

            const normalizedValue = (company.values[i] - minValue) / range;
            const y =
                this.padding.top + chartHeight - normalizedValue * chartHeight;
            points.push({ x, y });
        }

        if (points.length < 2) return;

        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[Math.max(0, i - 1)];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[Math.min(points.length - 1, i + 2)];

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }

        ctx.stroke();

        if (points.length > 0) {
            const lastPoint = points[points.length - 1];
            const logoSize = 40;

            ctx.fillStyle = company.color;
            ctx.beginPath();
            ctx.arc(lastPoint.x, lastPoint.y, logoSize / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();

            const logo = this.logos[company.name];
            if (logo) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(
                    lastPoint.x,
                    lastPoint.y,
                    logoSize / 2 - 3,
                    0,
                    Math.PI * 2
                );
                ctx.clip();

                const logoDrawSize = logoSize - 6;
                ctx.drawImage(
                    logo,
                    lastPoint.x - logoDrawSize / 2,
                    lastPoint.y - logoDrawSize / 2,
                    logoDrawSize,
                    logoDrawSize
                );
                ctx.restore();
            }

            const currentValue =
                company.values[
                    Math.min(visiblePoints - 1, company.values.length - 1)
                ];
            ctx.fillStyle = "#333";
            ctx.font = "bold 14px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(company.name, lastPoint.x + 30, lastPoint.y - 5);
            ctx.font = "bold 16px sans-serif";
            ctx.fillStyle = company.color;

            let valueText;
            if (this.dataFormat === "investment") {
                valueText = "$" + this.formatNumber(currentValue);
            } else if (this.dataFormat === "percentage") {
                valueText = currentValue.toFixed(0) + "%";
            } else {
                valueText = this.formatNumber(currentValue);
            }

            ctx.fillText(valueText, lastPoint.x + 30, lastPoint.y + 12);
        }
    }

    replay() {
        this.currentFrame = 0;
        this.calculateInitialScale();
        this.isAnimating = true;
        this.animate();
    }

    destroy() {
        this.isAnimating = false;
    }
}
