<template>
    <div class="ticker-item">
        <div class="ticker-logo-container">
            <img
                v-if="ticker.logoUrl && !logoError"
                :src="ticker.logoUrl"
                :alt="ticker.symbol"
                class="ticker-logo-img"
                @error="logoError = true"
            />
            <div
                v-else
                class="ticker-logo-fallback"
                :style="{ backgroundColor: ticker.color }"
            >
                <span class="ticker-initials">
                    {{ ticker.symbol?.substring(0, 2).toUpperCase() }}
                </span>
            </div>
        </div>
        <div class="ticker-info">
            <div class="ticker-symbol">{{ ticker.symbol }}</div>
            <div class="ticker-name">{{ ticker.name }}</div>
        </div>
        <div class="ticker-actions">
            <div class="color-picker-wrapper">
                <input
                    type="color"
                    :value="ticker.color"
                    class="color-input"
                    @input="handleColorChange"
                />
                <div class="color-display">
                    <div
                        class="color-circle"
                        :style="{ backgroundColor: ticker.color }"
                    ></div>
                </div>
            </div>
            <button
                class="delete-btn"
                @click="$emit('remove')"
                title="Supprimer"
            >
                <svg fill="currentColor" viewBox="0 0 256 256">
                    <path
                        d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
                    ></path>
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TickerData } from "../types";

interface Props {
    ticker: TickerData;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    remove: [];
    "update-color": [color: string];
}>();

const logoError = ref(false);

const handleColorChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    emit("update-color", target.value);
};
</script>

<style scoped>
.ticker-item {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(168, 85, 247, 0.1);
    border-radius: 0.75rem;
    padding: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.875rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.ticker-item::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
        135deg,
        rgba(168, 85, 247, 0.05) 0%,
        rgba(236, 72, 153, 0.05) 100%
    );
    opacity: 0;
    transition: opacity 0.3s;
}

.ticker-item:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(168, 85, 247, 0.3);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.15);
}

.ticker-item:hover::before {
    opacity: 1;
}

/* Logo Container */
.ticker-logo-container {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 0.5rem;
    overflow: hidden;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ticker-logo-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 4px;
}

.ticker-logo-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ticker-initials {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 0.875rem;
    letter-spacing: 0.5px;
}

/* Ticker Info */
.ticker-info {
    flex: 1;
    min-width: 0;
    position: relative;
    z-index: 1;
}

.ticker-symbol {
    color: white;
    font-weight: 700;
    font-size: 0.875rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0.5px;
}

.ticker-name {
    color: #c4b5fd;
    font-size: 0.75rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 2px;
    opacity: 0.9;
}

/* Actions */
.ticker-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    z-index: 1;
}

/* Color Picker */
.color-picker-wrapper {
    position: relative;
    width: 36px;
    height: 36px;
}

.color-input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
}

.color-display {
    width: 36px;
    height: 36px;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    cursor: pointer;
}

.color-display:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(168, 85, 247, 0.4);
    transform: scale(1.05);
}

.color-circle {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
}

.color-display:hover .color-circle {
    transform: scale(1.1);
}

/* Delete Button */
.delete-btn {
    width: 36px;
    height: 36px;
    border-radius: 0.5rem;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #fca5a5;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.delete-btn:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);
    color: #f87171;
    transform: scale(1.05);
}

.delete-btn:active {
    transform: scale(0.95);
}

.delete-btn svg {
    width: 1.125rem;
    height: 1.125rem;
}
</style>
