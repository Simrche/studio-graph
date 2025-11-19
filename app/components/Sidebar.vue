<template>
    <aside class="sidebar">
        <!-- Header -->
        <div class="sidebar-header">
            <h1 class="sidebar-title"><span>🎬</span> Studio</h1>
            <p class="sidebar-subtitle">Visualisation et contrôle</p>
        </div>

        <div class="sidebar-content">
            <!-- Animation Controls -->
            <section class="section">
                <h2 class="section-title">
                    <svg
                        class="section-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        ></path>
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                    Animation
                </h2>

                <div class="controls">
                    <button class="replay-btn">
                        <svg
                            class="btn-icon"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                        >
                            <path
                                d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM164.49,99.51a12,12,0,0,1,0,17l-32,32a12,12,0,0,1-17-17L131,116H104a36,36,0,0,0,0,72,12,12,0,0,1,0,24,60,60,0,0,1,0-120h27l-15.52-15.51a12,12,0,0,1,17-17Z"
                            ></path>
                        </svg>
                        Rejouer l'animation
                    </button>

                    <div class="control-box">
                        <div class="control-header">
                            <span>Vitesse</span>
                            <span class="control-value">0.5x</span>
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value="0.5"
                            class="slider"
                        />
                    </div>

                    <div class="control-box toggle-box">
                        <label for="revealMode" class="toggle-label"
                            >Mode Révélation</label
                        >
                        <div class="toggle-wrapper">
                            <input
                                type="checkbox"
                                id="revealMode"
                                checked
                                class="toggle-input"
                            />
                            <label
                                for="revealMode"
                                class="toggle-switch"
                            ></label>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Configuration -->
            <section class="section">
                <h2 class="section-title">
                    <svg
                        class="section-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        ></path>
                    </svg>
                    Données
                </h2>

                <div class="controls">
                    <button class="format-btn active">
                        <svg
                            class="btn-icon"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                        >
                            <path
                                d="M205.66,61.64l-144,144a8,8,0,0,1-11.32-11.32l144-144a8,8,0,0,1,11.32,11.31ZM50.54,101.44a36,36,0,0,1,50.92-50.91,8,8,0,1,0,11.32-11.32,52,52,0,0,0-73.56,73.56,8,8,0,0,0,11.32-11.32Zm152,53.12a52,52,0,0,0-73.56,0,8,8,0,0,0,11.32,11.32,36,36,0,0,1,50.92,50.91,8,8,0,0,0,11.32,11.32,52,52,0,0,0,0-73.56Z"
                            ></path>
                        </svg>
                        <span>Pourcentage</span>
                    </button>
                    <button class="format-btn">
                        <svg
                            class="btn-icon"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                        >
                            <path
                                d="M152,120h48a8,8,0,0,0,0-16H152a8,8,0,0,0,0,16Zm48,16H152a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16Zm-64,40a8,8,0,0,0,8-8V88a8,8,0,0,0-16,0v80A8,8,0,0,0,136,176ZM72,112H56v-8a8,8,0,0,0-16,0v8H24a8,8,0,0,0,0,16H40v40H24a8,8,0,0,0,0,16H40a32,32,0,0,0,64,0V128A16,16,0,0,0,72,112Zm0,72a16,16,0,0,1-16-16V128h16v56Z"
                            ></path>
                        </svg>
                        <span>Prix</span>
                    </button>
                    <button class="format-btn">
                        <svg
                            class="btn-icon"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                        >
                            <path
                                d="M240,128a8,8,0,0,1-8,8H204.94l-37.78,75.58A8,8,0,0,1,160,216h-.4a8,8,0,0,1-7.08-5.14L95.35,60.76,63.28,131.31A8,8,0,0,1,56,136H24a8,8,0,0,1,0-16H50.85L88.72,36.69a8,8,0,0,1,14.76.46l57.51,151,31.85-63.71A8,8,0,0,1,200,120h32A8,8,0,0,1,240,128Z"
                            ></path>
                        </svg>
                        <span>Mise de départ</span>
                    </button>

                    <div class="date-control">
                        <label class="input-label">Date de début</label>
                        <input
                            type="date"
                            value="2023-01-01"
                            class="date-input"
                        />
                        <div class="date-info">Période: 1 an</div>
                    </div>
                </div>
            </section>

            <!-- Tickers -->
            <section class="section tickers-section">
                <h2 class="section-title">
                    <svg
                        class="section-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        ></path>
                    </svg>
                    Lignes
                </h2>

                <div class="search-wrapper">
                    <input
                        type="text"
                        placeholder="Ajouter un ticker..."
                        class="search-input"
                    />
                    <svg
                        class="search-icon"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                    >
                        <path
                            d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                        ></path>
                    </svg>
                </div>

                <div class="tickers-list">
                    <!-- Ticker 1 -->
                    <div class="ticker-item">
                        <div class="ticker-logo">
                            <span
                                class="ticker-initials"
                                style="background-color: #00205c"
                                >AI</span
                            >
                        </div>
                        <div class="ticker-info">
                            <div class="ticker-symbol">AIR.PA</div>
                            <div class="ticker-name">AIRBUS SE</div>
                        </div>
                        <div class="ticker-actions">
                            <div class="color-picker-wrapper">
                                <input
                                    type="color"
                                    value="#00205c"
                                    class="color-input"
                                />
                                <div class="color-display">
                                    <div
                                        class="color-circle"
                                        style="background-color: #00205c"
                                    ></div>
                                </div>
                            </div>
                            <button class="delete-btn">
                                <svg fill="currentColor" viewBox="0 0 256 256">
                                    <path
                                        d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Ticker 2 -->
                    <div class="ticker-item">
                        <div class="ticker-logo">
                            <span
                                class="ticker-initials"
                                style="background-color: #e50914"
                                >NE</span
                            >
                        </div>
                        <div class="ticker-info">
                            <div class="ticker-symbol">NFLX</div>
                            <div class="ticker-name">Netflix Inc.</div>
                        </div>
                        <div class="ticker-actions">
                            <div class="color-picker-wrapper">
                                <input
                                    type="color"
                                    value="#e50914"
                                    class="color-input"
                                />
                                <div class="color-display">
                                    <div
                                        class="color-circle"
                                        style="background-color: #e50914"
                                    ></div>
                                </div>
                            </div>
                            <button class="delete-btn">
                                <svg fill="currentColor" viewBox="0 0 256 256">
                                    <path
                                        d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Save Button (fixed at bottom) -->
        <div class="sidebar-footer">
            <button class="save-btn">
                <svg class="btn-icon" fill="currentColor" viewBox="0 0 256 256">
                    <path
                        d="M219.31,72,184,36.69A15.86,15.86,0,0,0,172.69,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V83.31A15.86,15.86,0,0,0,219.31,72ZM168,208H88V152h80Zm40,0H184V152a16,16,0,0,0-16-16H88a16,16,0,0,0-16,16v56H48V48H172.69L208,83.31ZM160,72a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h56A8,8,0,0,1,160,72Z"
                    ></path>
                </svg>
                Sauvegarder
            </button>
        </div>
    </aside>
</template>

<script setup lang="ts"></script>

<style scoped>
/* Sidebar */
.sidebar {
    width: 384px;
    height: 100vh;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(40px);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
}

.sidebar-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 0.25rem 0;
}

.sidebar-subtitle {
    color: #d8b4fe;
    font-size: 0.875rem;
    margin: 0;
}

.sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    min-height: 0;
}

/* Custom scrollbar */
.sidebar-content::-webkit-scrollbar {
    width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* Sections */
.section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.section-title {
    font-size: 0.75rem;
    font-weight: bold;
    color: #d8b4fe;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.section-icon {
    width: 1rem;
    height: 1rem;
}

/* Controls */
.controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Replay Button */
.replay-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.75rem;
    color: white;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s;
}

.replay-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
}

.btn-icon {
    width: 1.25rem;
    height: 1.25rem;
}

/* Control Box */
.control-box {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    padding: 1rem;
}

.control-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ddd6fe;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.control-value {
    font-weight: bold;
    color: white;
}

/* Slider */
.slider {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.3);
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    border: none;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

/* Toggle */
.toggle-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.toggle-label {
    color: white;
    font-weight: 500;
    cursor: pointer;
}

.toggle-wrapper {
    position: relative;
    width: 48px;
    height: 24px;
}

.toggle-input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-switch {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #cbd5e0;
    border-radius: 24px;
    transition: 0.3s;
}

.toggle-switch::before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.3s;
}

.toggle-input:checked + .toggle-switch {
    background-color: #a855f7;
}

.toggle-input:checked + .toggle-switch::before {
    transform: translateX(24px);
}

/* Format Buttons */
.format-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    color: white;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s;
    font-size: 0.875rem;
}

.format-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.format-btn.active {
    background: #a855f7;
    border-color: #a855f7;
    box-shadow: 0 10px 25px rgba(168, 85, 247, 0.3);
}

/* Date Control */
.date-control {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.input-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #d8b4fe;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.date-input {
    width: 100%;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    color: white;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s;
    color-scheme: dark;
}

.date-input:focus {
    border-color: #a855f7;
}

.date-info {
    text-align: center;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.05);
    padding: 0.25rem;
    border-radius: 0.25rem;
}

/* Tickers Section */
.tickers-section {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.search-wrapper {
    position: relative;
}

.search-input {
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    color: white;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s;
}

.search-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
}

.search-input:focus {
    border-color: #a855f7;
}

.search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: rgba(255, 255, 255, 0.3);
}

/* Tickers List */
.tickers-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-right: 0.5rem;
    min-height: 0;
}

.ticker-item {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0.75rem;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.2s;
}

.ticker-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.ticker-logo {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    background: white;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.ticker-initials {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 0.75rem;
}

.ticker-info {
    flex: 1;
    min-width: 0;
}

.ticker-symbol {
    color: white;
    font-weight: bold;
    font-size: 0.875rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.ticker-name {
    color: #d8b4fe;
    font-size: 0.75rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.ticker-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

/* Color Picker */
.color-picker-wrapper {
    position: relative;
    width: 32px;
    height: 32px;
}

.color-input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

.color-display {
    width: 32px;
    height: 32px;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.color-display:hover {
    background: rgba(255, 255, 255, 0.2);
}

.color-circle {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
}

/* Delete Button */
.delete-btn {
    width: 32px;
    height: 32px;
    border-radius: 0.5rem;
    background: rgba(239, 68, 68, 0.1);
    border: none;
    color: #fca5a5;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.delete-btn:hover {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
}

.delete-btn svg {
    width: 1.125rem;
    height: 1.125rem;
}

/* Sidebar Footer */
.sidebar-footer {
    padding: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
}

/* Save Button */
.save-btn {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(to right, #a855f7, #9333ea);
    border: none;
    border-radius: 0.75rem;
    color: white;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 10px 25px rgba(168, 85, 247, 0.3);
    transition: all 0.2s;
}

.save-btn:hover {
    background: linear-gradient(to right, #9333ea, #7e22ce);
    transform: scale(1.02);
}

.save-btn:active {
    transform: scale(0.98);
}
</style>
