<template>
  <!-- Modal Inscription -->
  <Teleport to="body">
    <div
      v-if="inscriptionModal.open"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeInscription"
    >
      <div class="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">
          S'inscrire — {{ inscriptionModal.tournoi?.nom }}
        </h2>

        <form @submit.prevent="submitInscription" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Nom de l'équipe *</label>
            <input
              v-model="inscriptionForm.nom"
              type="text"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
              placeholder="Les Invincibles"
            />
            <span v-if="inscriptionErrors.nom" class="text-red-500 text-xs mt-1 block">{{ inscriptionErrors.nom }}</span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Nom joueur 1 *</label>
              <input
                v-model="inscriptionForm.nom_joueur1"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
              />
              <span v-if="inscriptionErrors.nom_joueur1" class="text-red-500 text-xs mt-1 block">{{ inscriptionErrors.nom_joueur1 }}</span>
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Prénom joueur 1 *</label>
              <input
                v-model="inscriptionForm.prenom_joueur1"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
              />
              <span v-if="inscriptionErrors.prenom_joueur1" class="text-red-500 text-xs mt-1 block">{{ inscriptionErrors.prenom_joueur1 }}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Nom joueur 2 *</label>
              <input
                v-model="inscriptionForm.nom_joueur2"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
              />
              <span v-if="inscriptionErrors.nom_joueur2" class="text-red-500 text-xs mt-1 block">{{ inscriptionErrors.nom_joueur2 }}</span>
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Prénom joueur 2 *</label>
              <input
                v-model="inscriptionForm.prenom_joueur2"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
              />
              <span v-if="inscriptionErrors.prenom_joueur2" class="text-red-500 text-xs mt-1 block">{{ inscriptionErrors.prenom_joueur2 }}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Email *</label>
              <input
                v-model="inscriptionForm.email"
                type="email"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
              />
              <span v-if="inscriptionErrors.email" class="text-red-500 text-xs mt-1 block">{{ inscriptionErrors.email }}</span>
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Téléphone</label>
              <input
                v-model="inscriptionForm.telephone"
                type="tel"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                placeholder="optionnel"
              />
            </div>
          </div>

          <p v-if="inscriptionError" class="text-red-500 text-sm">{{ inscriptionError }}</p>
          <p v-if="inscriptionSuccess" class="text-green-600 text-sm">{{ inscriptionSuccess }}</p>

          <div class="flex gap-3 justify-end pt-2">
            <button
              type="button"
              @click="closeInscription"
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="inscriptionLoading"
              class="px-4 py-2 text-sm bg-[#4A8B87] text-white rounded hover:bg-[#3d746f] disabled:opacity-50"
            >
              {{ inscriptionLoading ? 'Envoi...' : "S'inscrire" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Modal Matchs / Classement -->
  <Teleport to="body">
    <div
      v-if="matchesModal.open"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeMatches"
    >
      <div class="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-lg font-semibold text-gray-800">{{ matchesModal.tournoi?.nom }}</h2>
          <button @click="closeMatches" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <p v-if="matchesModal.loading" class="text-center py-6 text-gray-500">Chargement...</p>

        <template v-else>
          <p v-if="matchesModal.message" class="text-sm text-gray-500 mb-4 italic">{{ matchesModal.message }}</p>

          <!-- Classement (tournois terminés uniquement) -->
          <template v-if="matchesModal.tournoi?.statut === 'termine' && classement.length > 0">
            <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Classement</h3>
            <table class="w-full text-sm mb-6">
              <thead>
                <tr class="border-b border-gray-200 text-left text-gray-500">
                  <th class="pb-2 pr-3">#</th>
                  <th class="pb-2 pr-3">Équipe</th>
                  <th class="pb-2 pr-3 text-center">J</th>
                  <th class="pb-2 pr-3 text-center">Pts</th>
                  <th class="pb-2 text-center">Buts</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(team, i) in classement"
                  :key="team.nom"
                  class="border-b border-gray-100"
                  :class="i === 0 ? 'font-semibold' : ''"
                >
                  <td class="py-2 pr-3 text-gray-400">{{ i + 1 }}</td>
                  <td class="py-2 pr-3">{{ team.nom }}</td>
                  <td class="py-2 pr-3 text-center text-gray-500">{{ team.j }}</td>
                  <td class="py-2 pr-3 text-center">{{ team.pts }}</td>
                  <td class="py-2 text-center text-gray-500">{{ team.gf }}/{{ team.ga }}</td>
                </tr>
              </tbody>
            </table>
          </template>

          <!-- Liste des matchs -->
          <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Matchs</h3>
          <div v-if="matchesModal.matchs.length === 0" class="text-sm text-gray-400 py-4 text-center">
            Aucun match planifié.
          </div>
          <table v-else class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 text-left text-gray-500">
                <th class="pb-2">Équipe 1</th>
                <th class="pb-2 text-center">Score</th>
                <th class="pb-2 text-right">Équipe 2</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="m in matchesModal.matchs"
                :key="m.id"
                class="border-b border-gray-100"
              >
                <td class="py-2">{{ m.equipe1_nom }}</td>
                <td class="py-2 text-center font-mono text-gray-700">
                  {{ m.score_equipe1 ?? '—' }} – {{ m.score_equipe2 ?? '—' }}
                </td>
                <td class="py-2 text-right">{{ m.equipe2_nom }}</td>
              </tr>
            </tbody>
          </table>
        </template>
      </div>
    </div>
  </Teleport>

  <!-- Page content -->
  <div class="max-w-5xl mx-auto px-4 py-10">

    <!-- Section : Tournois ouverts -->
    <section class="mb-12">
      <h1 class="text-2xl font-bold text-[#4A8B87] mb-6 text-center pb-4">Iscrivez-vous au prochain tournoi de Baby-Foot !</h1>
    
      <div v-if="loadingOuverts" class="text-center py-12 text-gray-400">Chargement...</div>

      <div v-else-if="tournoiOuverts.length === 0" class="text-center py-12 text-gray-400">
        Aucun tournoi ouvert pour le moment.
      </div>

      <template v-else>
        <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 text-left text-gray-500 text-xs uppercase tracking-wide">
                <th class="px-4 py-3">Tournoi</th>
                <th class="px-4 py-3">Début</th>
                <th class="px-4 py-3">Fin</th>
                <th class="px-4 py-3 hidden md:table-cell">Description</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="t in tournoiOuvertsPage"
                :key="t.id"
                class="border-b border-gray-100 last:border-0 hover:bg-gray-50"
              >
                <td class="px-4 py-3 font-medium text-gray-800">{{ t.nom }}</td>
                <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ formatDate(t.date_debut) }}</td>
                <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ formatDate(t.date_fin) }}</td>
                <td class="px-4 py-3 text-gray-400 hidden md:table-cell">{{ t.description || '—' }}</td>
                <td class="px-4 py-3 text-right">
                  <button
                    @click="openInscription(t)"
                    class="text-sm px-3 py-1.5 bg-[#4A8B87] text-white rounded hover:bg-[#3d746f]"
                  >
                    S'inscrire
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
          <button
            :disabled="page === 1"
            @click="page--"
            class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ←
          </button>
          <span>{{ page }} / {{ totalPages }}</span>
          <button
            :disabled="page === totalPages"
            @click="page++"
            class="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>
      </template>
    </section>

    <!-- Bouton Suivi des Résultats -->
    <div class="text-center mb-8">
      <button
        @click="toggleSuivi"
        class="inline-flex items-center gap-2 px-6 py-3 bg-[#4A8B87] text-white rounded-lg hover:bg-[#3d746f] text-sm font-medium"
      >
        Suivi des Résultats
        <span class="text-gray-400 transition-transform duration-300" :class="showSuivi ? 'rotate-180' : ''">▼</span>
      </button>
    </div>

    <!-- Section : Suivi des résultats -->
    <Transition name="slide-fade">
      <section v-if="showSuivi" ref="suiviSection">
    
        <div class="flex gap-1 mb-4 border-b border-gray-200">
          <button
            @click="activeTab = 'complet'"
            class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
            :class="activeTab === 'complet' ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-400 hover:text-gray-600'"
          >
          Programmé
          </button>
          <button
            @click="activeTab = 'termine'"
            class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
            :class="activeTab === 'termine' ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-400 hover:text-gray-600'"
          >
            Terminés
          </button>
        </div>

        <div v-if="loadingSuivi" class="text-center py-12 text-gray-400">Chargement...</div>

        <div v-else-if="activeTournois.length === 0" class="text-center py-12 text-gray-400">
          Aucun tournoi {{ activeTab === 'complet' ? 'programmé' : 'terminé' }}.
        </div>

        <div v-else class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 text-left text-gray-500 text-xs uppercase tracking-wide">
                <th class="px-4 py-3">Tournoi</th>
                <th class="px-4 py-3">Début</th>
                <th class="px-4 py-3">Fin</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="t in activeTournois"
                :key="t.id"
                class="border-b border-gray-100 last:border-0 hover:bg-gray-50"
              >
                <td class="px-4 py-3 font-medium text-gray-800">{{ t.nom }}</td>
                <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ formatDate(t.date_debut) }}</td>
                <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ formatDate(t.date_fin) }}</td>
                <td class="px-4 py-3 text-right">
                  <button
                    @click="openMatches(t)"
                    class="text-sm px-3 py-1.5 bg-[#4A8B87] text-white rounded hover:bg-[#3d746f]"
                  >
                    Voir les matchs
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue';
import { getTournois } from '../services/tournoi-service.js';
import { registerEquipe } from '../services/equipe-service.js';
import { getMatchesByTournoi } from '../services/match-service.js';

//Tournois ouverts
const tournoiOuverts  = ref([]);
const loadingOuverts  = ref(true);
const page            = ref(1);
const PAGE_SIZE       = 5;

const totalPages = computed(() => Math.ceil(tournoiOuverts.value.length / PAGE_SIZE));

const tournoiOuvertsPage = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE;
  return tournoiOuverts.value.slice(start, start + PAGE_SIZE);
});

onMounted(async () => {
  try {
    tournoiOuverts.value = await getTournois('ouvert');
  } catch {
    tournoiOuverts.value = [];
  } finally {
    loadingOuverts.value = false;
  }
});

// Suivi des résultats 
const showSuivi      = ref(false);
const activeTab      = ref('complet');
const tournoiComplet = ref([]);
const tournoiTermine = ref([]);
const loadingSuivi   = ref(false);
const suiviSection   = ref(null);

const activeTournois = computed(() =>
  activeTab.value === 'complet' ? tournoiComplet.value : tournoiTermine.value
);

async function toggleSuivi() {
  if (showSuivi.value) {
    showSuivi.value = false;
    return;
  }
  showSuivi.value  = true;
  loadingSuivi.value = true;

  try {
    const [complet, termine] = await Promise.all([
      getTournois('complet'),
      getTournois('termine'),
    ]);
    tournoiComplet.value = complet;
    tournoiTermine.value = termine;
  } catch {
    tournoiComplet.value = [];
    tournoiTermine.value = [];
  } finally {
    loadingSuivi.value = false;
  }

  await nextTick();
  suiviSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Modal inscription
const inscriptionModal = ref({ open: false, tournoi: null });
const inscriptionForm  = ref({
  nom: '', nom_joueur1: '', prenom_joueur1: '',
  nom_joueur2: '', prenom_joueur2: '', email: '', telephone: '',
});
const inscriptionErrors  = ref({});
const inscriptionError   = ref('');
const inscriptionSuccess = ref('');
const inscriptionLoading = ref(false);

function openInscription(tournoi) {
  inscriptionModal.value   = { open: true, tournoi };
  inscriptionErrors.value  = {};
  inscriptionError.value   = '';
  inscriptionSuccess.value = '';
  inscriptionForm.value    = {
    nom: '', nom_joueur1: '', prenom_joueur1: '',
    nom_joueur2: '', prenom_joueur2: '', email: '', telephone: '',
  };
}

function closeInscription() {
  inscriptionModal.value.open = false;
}

async function submitInscription() {
  inscriptionErrors.value  = {};
  inscriptionError.value   = '';
  inscriptionSuccess.value = '';

  const f = inscriptionForm.value;
  const e = {};
  if (!f.nom)            e.nom            = "Le nom de l'équipe est requis.";
  if (!f.nom_joueur1)    e.nom_joueur1    = 'Requis.';
  if (!f.prenom_joueur1) e.prenom_joueur1 = 'Requis.';
  if (!f.nom_joueur2)    e.nom_joueur2    = 'Requis.';
  if (!f.prenom_joueur2) e.prenom_joueur2 = 'Requis.';
  if (!f.email)          e.email          = "L'email est requis.";

  if (Object.keys(e).length) {
    inscriptionErrors.value = e;
    return;
  }

  inscriptionLoading.value = true;
  try {
    await registerEquipe(inscriptionModal.value.tournoi.id, f);
    inscriptionSuccess.value = 'Inscription enregistrée avec succès !';
    setTimeout(closeInscription, 1500);
  } catch (err) {
    if (err.response?.status === 422) {
      err.response.data.errors?.forEach((e) => {
        inscriptionErrors.value[e.field] = e.message;
      });
    } else {
      inscriptionError.value = err.response?.data?.message || 'Une erreur est survenue.';
    }
  } finally {
    inscriptionLoading.value = false;
  }
}

// Modal Matchs / Classement
const matchesModal = ref({ open: false, tournoi: null, matchs: [], message: '', loading: false });
const classement   = ref([]);

async function openMatches(tournoi) {
  matchesModal.value = { open: true, tournoi, matchs: [], message: '', loading: true };
  classement.value   = [];

  try {
    const data = await getMatchesByTournoi(tournoi.id);
    matchesModal.value.matchs  = data.matchs || [];
    matchesModal.value.message = data.message || '';

    if (tournoi.statut === 'termine' && data.matchs?.length) {
      classement.value = computeClassement(data.matchs);
    }
  } catch (err) {
    matchesModal.value.message = err.response?.data?.message || 'Erreur lors du chargement.';
  } finally {
    matchesModal.value.loading = false;
  }
}

function closeMatches() {
  matchesModal.value.open = false;
}

function computeClassement(matchs) {
  const teams = {};
  for (const m of matchs) {
    if (!teams[m.equipe1_id]) teams[m.equipe1_id] = { nom: m.equipe1_nom, pts: 0, j: 0, gf: 0, ga: 0 };
    if (!teams[m.equipe2_id]) teams[m.equipe2_id] = { nom: m.equipe2_nom, pts: 0, j: 0, gf: 0, ga: 0 };

    const s1 = m.score_equipe1 ?? 0;
    const s2 = m.score_equipe2 ?? 0;
    teams[m.equipe1_id].j++;  teams[m.equipe2_id].j++;
    teams[m.equipe1_id].gf += s1; teams[m.equipe1_id].ga += s2;
    teams[m.equipe2_id].gf += s2; teams[m.equipe2_id].ga += s1;

    if (s1 > s2)      teams[m.equipe1_id].pts += 3;
    else if (s2 > s1) teams[m.equipe2_id].pts += 3;
    else { teams[m.equipe1_id].pts += 1; teams[m.equipe2_id].pts += 1; }
  }
  return Object.values(teams).sort(
    (a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf
  );
}

// fonction date
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
