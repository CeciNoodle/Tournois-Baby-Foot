<template>
  <header v-if="!$route.meta.hideHeader" class="bg-[#F9F3DB] border-b border-gray-200">
    <div class="max-w-5xl mx-auto px-4 relative">
      <div class="absolute top-3 right-4 z-10 flex items-center gap-3">
        <button
          v-if="auth.isAuthenticated"
          @click="handleLogout"
          class="text-sm px-3 py-1.5 bg-[#4A8B87] text-white rounded hover:bg-[#3d746f]"
        >
          Déconnexion
        </button>
        <router-link
          v-else
          to="/login"
          class="text-sm px-3 py-1.5 bg-[#4A8B87] text-white rounded hover:bg-[#3d746f]"
        >
          Connexion
        </router-link>
      </div>

      <router-link to="/">
        <img src="/header.jpg" alt="Baby Foot" class="w-full h-auto rounded-b-lg" />
      </router-link>
    </div>
  </header>

  <main class="bg-gray-50 min-h-screen">
    <router-view />
  </main>
</template>

<script setup>
import { inject }    from 'vue';
import { useRouter } from 'vue-router';

const auth   = inject('auth');
const router = useRouter();

async function handleLogout() {
  await auth.logout();
  router.push('/');
}
</script>
