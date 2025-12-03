<template>
    <div
        class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4"
    >
        <BackgroundAnimation />

        <div
            class="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
        >
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-white mb-2">
                    {{ isLogin ? "Connexion" : "Inscription" }}
                </h1>
                <p class="text-white/60">
                    {{
                        isLogin
                            ? "Connectez-vous pour accéder à vos graphiques"
                            : "Créez un compte pour commencer"
                    }}
                </p>
            </div>

            <!-- Google Sign In -->
            <UiButton
                @click="signInWithGoogle"
                :loading="loading"
                variant="primary"
                class="!bg-white hover:!bg-white/90 !text-slate-900 mb-6"
            >
                <template #icon>
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                </template>
                Continuer avec Google
            </UiButton>

            <!-- Divider -->
            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-white/20"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-4 text-white/60">OU</span>
                </div>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="gap-6 flex flex-col">
                <!-- Email Input -->
                <UiInput
                    v-model="email"
                    type="email"
                    label="Email"
                    placeholder="votre@email.com"
                    :disabled="loading || rateLimit.isWaiting.value"
                    required
                />

                <!-- Password Input -->
                <UiInput
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    label="Mot de passe"
                    :placeholder="
                        isLogin ? 'Votre mot de passe' : 'Min. 6 caractères'
                    "
                    :disabled="loading || rateLimit.isWaiting.value"
                    :minlength="isLogin ? undefined : 6"
                    required
                >
                    <template #right>
                        <button
                            type="button"
                            @click="showPassword = !showPassword"
                            class="text-white/40 hover:text-white/60 transition-colors mt-1"
                        >
                            <PhEye v-if="!showPassword" :size="20" />
                            <PhEyeClosed v-else :size="20" />
                        </button>
                    </template>
                </UiInput>

                <!-- Email Consent Checkbox (only for registration) -->
                <div v-if="!isLogin" class="flex items-start gap-3">
                    <input
                        id="emailConsent"
                        v-model="emailConsent"
                        type="checkbox"
                        class="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <label
                        for="emailConsent"
                        class="text-sm text-white/60 cursor-pointer select-none"
                    >
                        J’accepte de recevoir les nouveautés par e-mail
                        (désabonnement possible à tout moment).
                    </label>
                </div>

                <!-- Rate Limit Warning -->
                <div
                    v-if="rateLimit.isWaiting.value && isLogin"
                    class="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm flex items-start gap-2"
                >
                    <PhWarning :size="20" class="flex-shrink-0 mt-0.5" />
                    <p>
                        Veuillez patienter
                        <span class="font-mono font-bold"
                            >{{ rateLimit.remainingTime.value }}s</span
                        >
                        avant de réessayer.
                    </p>
                </div>

                <!-- Error Message -->
                <div
                    v-if="error"
                    class="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
                >
                    {{ error }}
                </div>

                <!-- Submit Button -->
                <UiButton
                    type="submit"
                    :disabled="rateLimit.isWaiting.value"
                    :loading="loading"
                    variant="active"
                >
                    {{ isLogin ? "Se connecter" : "S'inscrire" }}
                </UiButton>
            </form>

            <!-- Toggle Login/Register -->
            <div class="text-center mt-6">
                <p class="text-white/60">
                    {{
                        isLogin
                            ? "Pas encore de compte ?"
                            : "Vous avez déjà un compte ?"
                    }}
                    <button
                        @click="toggleMode"
                        class="text-purple-400 hover:text-purple-300 font-medium transition-colors ml-1"
                    >
                        {{ isLogin ? "S'inscrire" : "Se connecter" }}
                    </button>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PhEye, PhEyeClosed, PhWarning } from "@phosphor-icons/vue";

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const isLogin = ref(true);
const email = ref("");
const password = ref("");
const emailConsent = ref(false);
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");

// Protection anti-brute force simple (3 secondes entre chaque tentative)
const rateLimit = useRateLimit(3);

onUnmounted(() => {
    rateLimit.cleanup();
});

// Redirect if already logged in
watch(
    user,
    (newUser) => {
        if (newUser) {
            navigateTo("/");
        }
    },
    { immediate: true }
);

function toggleMode() {
    isLogin.value = !isLogin.value;
    error.value = "";
}

async function handleSubmit() {
    // Vérifier si l'utilisateur peut tenter de se connecter
    if (!rateLimit.canAttempt()) {
        return;
    }

    loading.value = true;
    error.value = "";

    try {
        if (isLogin.value) {
            const { error: signInError } =
                await supabase.auth.signInWithPassword({
                    email: email.value,
                    password: password.value,
                });

            if (signInError) {
                // Enregistrer la tentative échouée
                rateLimit.recordAttempt();
                throw signInError;
            }
        } else {
            const { error: signUpError } = await supabase.auth.signUp({
                email: email.value,
                password: password.value,
                options: {
                    data: {
                        email_notifications: emailConsent.value,
                    },
                    emailRedirectTo: `${window.location.origin}/`,
                },
            });

            if (signUpError) throw signUpError;

            // Show success message for sign up
            error.value =
                "Compte créé ! Vérifiez votre email pour confirmer votre inscription.";
        }
    } catch (err: any) {
        error.value =
            err.message || "Une erreur s'est produite. Veuillez réessayer.";
    } finally {
        loading.value = false;
    }
}

async function signInWithGoogle() {
    loading.value = true;
    error.value = "";

    try {
        const { error: signInError } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/`,
            },
        });

        if (signInError) throw signInError;
    } catch (err: any) {
        error.value =
            err.message || "Une erreur s'est produite. Veuillez réessayer.";
        loading.value = false;
    }
}
</script>
