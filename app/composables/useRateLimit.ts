/**
 * Composable simple pour ajouter un délai entre les tentatives de connexion
 */
export function useRateLimit(delaySeconds: number = 3) {
    const lastAttempt = ref<number>(0);
    const remainingTime = ref<number>(0);
    const isWaiting = ref(false);

    let countdownInterval: NodeJS.Timeout | null = null;

    /**
     * Vérifie si l'utilisateur peut effectuer une tentative
     */
    function canAttempt(): boolean {
        const now = Date.now();
        const timeSinceLastAttempt = now - lastAttempt.value;
        const delayMs = delaySeconds * 1000;

        if (timeSinceLastAttempt < delayMs) {
            const remaining = Math.ceil((delayMs - timeSinceLastAttempt) / 1000);
            startCountdown(remaining);
            return false;
        }

        return true;
    }

    /**
     * Enregistre une tentative et démarre le délai
     */
    function recordAttempt() {
        lastAttempt.value = Date.now();
        startCountdown(delaySeconds);
    }

    /**
     * Démarre le compte à rebours
     */
    function startCountdown(seconds: number) {
        remainingTime.value = seconds;
        isWaiting.value = true;

        if (countdownInterval) clearInterval(countdownInterval);

        countdownInterval = setInterval(() => {
            remainingTime.value--;
            if (remainingTime.value <= 0) {
                isWaiting.value = false;
                if (countdownInterval) clearInterval(countdownInterval);
            }
        }, 1000);
    }

    /**
     * Nettoie l'intervalle
     */
    function cleanup() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }

    return {
        canAttempt,
        recordAttempt,
        remainingTime,
        isWaiting,
        cleanup,
    };
}
