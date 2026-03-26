<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <h1 class="text-2xl font-bold text-center text-[#4A8B87] mb-6">Connexion</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm text-gray-600 mb-1">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            placeholder="Entrez votre email"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4A8B87]"
          />
          <span v-if="errors.email" class="text-red-500 text-xs mt-1 block">{{ errors.email }}</span>
        </div>

        <div>
          <label for="password" class="block text-sm text-gray-600 mb-1">Mot de passe</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            placeholder="••••••••"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4A8B87]"
          />
          <span v-if="errors.password" class="text-red-500 text-xs mt-1 block">{{ errors.password }}</span>
        </div>

        <p v-if="serverError" class="text-red-500 text-sm">{{ serverError }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 bg-[#4A8B87] text-white rounded hover:bg-[#3d746f] text-sm font-medium disabled:opacity-50"
        >
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>
    </div>

    <router-link
      to="/"
      class="mt-4 text-sm text-[#4A8B87] hover:underline"
    >
      Retourner à la page d'accueil
    </router-link>
  </div>
</template>

<script setup>
import { ref, inject }   from 'vue';
import { useRouter }     from 'vue-router';

const auth   = inject('auth');
const router = useRouter();

const form = ref({
  email:    '',
  password: '',
});

const errors      = ref({});
const serverError = ref('');
const loading     = ref(false);


function validate() {
  const e = {};

  if (!form.value.email) {
    e.email = 'L\'email est requis.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    e.email = 'Format d\'email invalide.';
  }

  if (!form.value.password) {
    e.password = 'Le mot de passe est requis.';
  } else if (form.value.password.length < 8) {
    e.password = 'Le mot de passe doit contenir au moins 8 caractères.';
  }

  errors.value = e;
  return Object.keys(e).length === 0;
}

async function handleLogin() {
  serverError.value = '';

  if (!validate()) return;

  loading.value = true;

  try {
    await auth.login(form.value.email, form.value.password);
    router.push('/admin/dashboard');
  } catch (err) {

    if (err.response?.status === 422) {
      err.response.data.errors.forEach((e) => {
        errors.value[e.field] = e.message;
      });
    } else {

      serverError.value = err.response?.data?.message || 'Une erreur est survenue.';
    }
  } finally {
    loading.value = false;
  }
}
</script>