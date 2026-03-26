<template>
  <!-- Modal Tournoi (Créer / Modifier) -->
  <Teleport to="body">
    <div
      v-if="tournoiModal.open"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeTournoiModal"
    >
      <div class="bg-white rounded-lg w-full max-w-lg p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">
          {{ tournoiModal.editing ? 'Modifier le tournoi' : 'Créer un tournoi' }}
        </h2>
        <form @submit.prevent="submitTournoi" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Nom *</label>
            <input v-model="tournoiForm.nom" type="text" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4A8B87]" />
            <span v-if="tournoiErrors.nom" class="text-red-500 text-xs mt-1 block">{{ tournoiErrors.nom }}</span>
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Description</label>
            <textarea v-model="tournoiForm.description" rows="2" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4A8B87]"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Date début *</label>
              <input v-model="tournoiForm.date_debut" type="date" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4A8B87]" />
              <span v-if="tournoiErrors.date_debut" class="text-red-500 text-xs mt-1 block">{{ tournoiErrors.date_debut }}</span>
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Date fin *</label>
              <input v-model="tournoiForm.date_fin" type="date" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4A8B87]" />
              <span v-if="tournoiErrors.date_fin" class="text-red-500 text-xs mt-1 block">{{ tournoiErrors.date_fin }}</span>
            </div>
          </div>
          <p v-if="tournoiModal.error" class="text-red-500 text-sm">{{ tournoiModal.error }}</p>
          <div class="flex gap-3 justify-end pt-2">
            <button type="button" @click="closeTournoiModal" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Annuler</button>
            <button type="submit" :disabled="tournoiModal.loading" class="px-4 py-2 text-sm bg-[#4A8B87] text-white rounded hover:bg-[#3d746f] disabled:opacity-50">
              {{ tournoiModal.loading ? 'Envoi...' : (tournoiModal.editing ? 'Modifier' : 'Créer') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Modal Équipe -->
  <Teleport to="body">
    <div
      v-if="equipeModal.open"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeEquipeModal"
    >
      <div class="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">
          Ajouter une équipe — {{ equipeModal.tournoi?.nom }}
        </h2>
        <form @submit.prevent="submitEquipe" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Nom de l'équipe *</label>
            <input v-model="equipeForm.nom" type="text" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4A8B87]" />
            <span v-if="equipeErrors.nom" class="text-red-500 text-xs mt-1 block">{{ equipeErrors.nom }}</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Nom joueur 1 *</label>
              <input v-model="equipeForm.nom_joueur1" type="text" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4A8B87]" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Prénom joueur 1 *</label>
              <input v-model="equipeForm.prenom_joueur1" type="text" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4A8B87]" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Nom joueur 2 *</label>
              <input v-model="equipeForm.nom_joueur2" type="text" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4A8B87]" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Prénom joueur 2 *</label>
              <input v-model="equipeForm.prenom_joueur2" type="text" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4A8B87]" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Email *</label>
              <input v-model="equipeForm.email" type="email" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4A8B87]" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Téléphone</label>
              <input v-model="equipeForm.telephone" type="tel" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4A8B87]" placeholder="optionnel" />
            </div>
          </div>
          <p v-if="equipeModal.error" class="text-red-500 text-sm">{{ equipeModal.error }}</p>
          <p v-if="equipeModal.success" class="text-green-600 text-sm">{{ equipeModal.success }}</p>
          <div class="flex gap-3 justify-end pt-2">
            <button type="button" @click="closeEquipeModal" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Fermer</button>
            <button type="submit" :disabled="equipeModal.loading" class="px-4 py-2 text-sm bg-[#4A8B87] text-white rounded hover:bg-[#3d746f] disabled:opacity-50">
              {{ equipeModal.loading ? 'Envoi...' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Modal Matchs / Scores -->
  <Teleport to="body">
    <div
      v-if="matchModal.open"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeMatchModal"
    >
      <div class="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Matchs — {{ matchModal.tournoi?.nom }}</h2>
          <button @click="closeMatchModal" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <p v-if="matchModal.loading" class="text-center py-6 text-gray-500">Chargement...</p>

        <template v-else>
          <p v-if="matchModal.message" class="text-sm text-gray-500 mb-4 italic">{{ matchModal.message }}</p>

          <div v-if="matchModal.matchs.length === 0" class="text-sm text-gray-400 py-4 text-center">
            Aucun match généré.
          </div>
          <table v-else class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 text-left text-gray-500">
                <th class="pb-2">Équipe 1</th>
                <th class="pb-2 text-center">Score</th>
                <th class="pb-2 text-right">Équipe 2</th>
                <th v-if="canEditScores(matchModal.tournoi)" class="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in matchModal.matchs" :key="m.id" class="border-b border-gray-100">
                <td class="py-2">{{ m.equipe1_nom }}</td>
                <td class="py-2 text-center">
                  <template v-if="editingScore?.id === m.id">
                    <div class="flex items-center justify-center gap-1">
                      <input v-model.number="editingScore.score_equipe1" type="number" min="0" class="w-12 border border-gray-300 rounded px-1 py-0.5 text-center text-sm" />
                      <span>–</span>
                      <input v-model.number="editingScore.score_equipe2" type="number" min="0" class="w-12 border border-gray-300 rounded px-1 py-0.5 text-center text-sm" />
                    </div>
                  </template>
                  <template v-else>
                    <span class="font-mono text-gray-700">{{ m.score_equipe1 ?? '—' }} – {{ m.score_equipe2 ?? '—' }}</span>
                  </template>
                </td>
                <td class="py-2 text-right">{{ m.equipe2_nom }}</td>
                <td v-if="canEditScores(matchModal.tournoi)" class="py-2 text-right">
                  <template v-if="editingScore?.id === m.id">
                    <button @click="saveScore" :disabled="savingScore" class="text-xs px-2 py-1 bg-[#4A8B87] text-white rounded hover:bg-[#3d746f]">OK</button>
                    <button @click="editingScore = null" class="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 ml-1">✕</button>
                  </template>
                  <template v-else>
                    <button @click="startEditScore(m)" class="text-xs px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">Modifier</button>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </div>
    </div>
  </Teleport>

  <!-- Modal Équipes inscrites -->
  <Teleport to="body">
    <div
      v-if="equipesModal.open"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeEquipesModal"
    >
      <div class="bg-white rounded-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Équipes inscrites — {{ equipesModal.tournoi?.nom }}</h2>
          <button @click="closeEquipesModal" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <p v-if="equipesModal.loading" class="text-center py-6 text-gray-500">Chargement...</p>

        <template v-else>
          <div v-if="equipesModal.equipes.length === 0" class="text-sm text-gray-400 py-4 text-center">
            Aucune équipe inscrite.
          </div>
          <table v-else class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 text-left text-gray-500 text-xs uppercase tracking-wide">
                <th class="pb-2 px-2">Équipe</th>
                <th class="pb-2 px-2">Joueur 1</th>
                <th class="pb-2 px-2">Joueur 2</th>
                <th class="pb-2 px-2">Email</th>
                <th class="pb-2 px-2">Téléphone</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in equipesModal.equipes" :key="e.id" class="border-b border-gray-100">
                <td class="py-2 px-2 font-medium text-gray-800">{{ e.nom }}</td>
                <td class="py-2 px-2 text-gray-600">{{ e.prenom_joueur1 }} {{ e.nom_joueur1 }}</td>
                <td class="py-2 px-2 text-gray-600">{{ e.prenom_joueur2 }} {{ e.nom_joueur2 }}</td>
                <td class="py-2 px-2 text-gray-500">{{ e.email || '—' }}</td>
                <td class="py-2 px-2 text-gray-500">{{ e.telephone || '—' }}</td>
              </tr>
            </tbody>
          </table>
          <p class="text-xs text-gray-400 mt-3">{{ equipesModal.equipes.length }} équipe(s) inscrite(s)</p>
        </template>
      </div>
    </div>
  </Teleport>

  <!-- Page content -->
  <div class="max-w-5xl mx-auto px-4 py-10">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-[#4A8B87]">Tableau de bord</h1>
      <div class="flex gap-2">
        <button @click="handleCheckExpired" :disabled="checkingExpired" class="text-sm px-3 py-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50">
          {{ checkingExpired ? 'Vérification...' : 'Clôturer expirés' }}
        </button>
        <button @click="openCreateTournoi" class="text-sm px-4 py-1.5 bg-[#4A8B87] text-white rounded hover:bg-[#3d746f]">
          + Nouveau tournoi
        </button>
      </div>
    </div>

    <p v-if="notification" class="text-sm mb-4 px-4 py-2 rounded" :class="notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
      {{ notification.text }}
    </p>

    <div v-if="loading" class="text-center py-12 text-gray-400">Chargement...</div>

    <div v-else-if="tournois.length === 0" class="text-center py-12 text-gray-400">Aucun tournoi.</div>

    <!-- Tabs par statut -->
    <template v-else>
      <div class="flex gap-1 mb-4 border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
          :class="activeTab === tab.key ? 'border-[#4A8B87] text-[#4A8B87]' : 'border-transparent text-gray-400 hover:text-gray-600'"
        >
          {{ tab.label }} ({{ tournoisByStatut(tab.key).length }})
        </button>
      </div>

      <div v-if="filteredTournois.length === 0" class="text-center py-12 text-gray-400">
        Aucun tournoi {{ activeTabLabel }}.
      </div>

      <div v-else class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 text-left text-gray-500 text-xs uppercase tracking-wide">
              <th class="px-4 py-3">Tournoi</th>
              <th class="px-4 py-3">Début</th>
              <th class="px-4 py-3">Fin</th>
              <th class="px-4 py-3 hidden md:table-cell">Description</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="t in filteredTournois"
              :key="t.id"
              class="border-b border-gray-100 last:border-0 hover:bg-gray-50"
            >
              <td class="px-4 py-3 font-medium text-gray-800">{{ t.nom }}</td>
              <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ formatDate(t.date_debut) }}</td>
              <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ formatDate(t.date_fin) }}</td>
              <td class="px-4 py-3 text-gray-400 hidden md:table-cell">{{ t.description || '—' }}</td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-2 flex-wrap">
                  <!-- Ouvert: modifier, ajouter équipe, passer complet, annuler -->
                  <template v-if="t.statut === 'ouvert'">
                    <button @click="openEditTournoi(t)" class="text-xs px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">Modifier</button>
                    <button @click="openEquipesModal(t)" class="text-xs px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">Voir équipes</button>
                    <button @click="openEquipeModal(t)" class="text-xs px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">+ Équipe</button>
                    <button @click="handleChangeStatut(t, 'complet')" class="text-xs px-2 py-1 bg-[#4A8B87] text-white rounded hover:bg-[#3d746f]">→ Complet</button>
                    <button @click="handleChangeStatut(t, 'annule')" class="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Annuler</button>
                  </template>

                  <!-- Complet: modifier, générer matchs, voir matchs, annuler -->
                  <template v-if="t.statut === 'complet'">
                    <button @click="openEditTournoi(t)" class="text-xs px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">Modifier</button>
                    <button @click="handleGenerateMatches(t)" class="text-xs px-2 py-1 bg-[#4A8B87] text-white rounded hover:bg-[#3d746f]">Générer matchs</button>
                    <button @click="openMatchModal(t)" class="text-xs px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">Voir matchs</button>
                    <button @click="handleChangeStatut(t, 'annule')" class="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Annuler</button>
                  </template>

                  <!-- Terminé / Annulé: voir matchs, supprimer -->
                  <template v-if="t.statut === 'termine' || t.statut === 'annule'">
                    <button @click="openMatchModal(t)" class="text-xs px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">Voir matchs</button>
                    <button @click="handleDelete(t)" class="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Supprimer</button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getTournois, createTournoi, updateTournoi, deleteTournoi, changeStatut, checkExpired } from '../services/tournoi-service.js';
import { addEquipeAdmin, getEquipesByTournoi } from '../services/equipe-service.js';
import { getMatchesByTournoi, generateMatches, updateScore } from '../services/match-service.js';

// --- State ---
const tournois = ref([]);
const loading = ref(true);
const activeTab = ref('ouvert');
const notification = ref(null);
const checkingExpired = ref(false);

const tabs = [
  { key: 'ouvert', label: 'Ouverts' },
  { key: 'complet', label: 'Complets' },
  { key: 'termine', label: 'Terminés' },
  { key: 'annule', label: 'Annulés' },
];

const activeTabLabel = computed(() => tabs.find(t => t.key === activeTab.value)?.label.toLowerCase());
const tournoisByStatut = (statut) => tournois.value.filter(t => t.statut === statut);
const filteredTournois = computed(() => tournoisByStatut(activeTab.value));

// --- Tournoi Modal ---
const tournoiModal = ref({ open: false, editing: false, id: null, loading: false, error: '' });
const tournoiForm = ref({ nom: '', description: '', date_debut: '', date_fin: '' });
const tournoiErrors = ref({});

function openCreateTournoi() {
  tournoiForm.value = { nom: '', description: '', date_debut: '', date_fin: '' };
  tournoiErrors.value = {};
  tournoiModal.value = { open: true, editing: false, id: null, loading: false, error: '' };
}

function openEditTournoi(t) {
  tournoiForm.value = {
    nom: t.nom,
    description: t.description || '',
    date_debut: t.date_debut?.split('T')[0] || '',
    date_fin: t.date_fin?.split('T')[0] || '',
  };
  tournoiErrors.value = {};
  tournoiModal.value = { open: true, editing: true, id: t.id, loading: false, error: '' };
}

function closeTournoiModal() {
  tournoiModal.value.open = false;
}

async function submitTournoi() {
  tournoiErrors.value = {};
  tournoiModal.value.error = '';

  if (!tournoiForm.value.nom) tournoiErrors.value.nom = 'Le nom est requis.';
  if (!tournoiForm.value.date_debut) tournoiErrors.value.date_debut = 'Requise.';
  if (!tournoiForm.value.date_fin) tournoiErrors.value.date_fin = 'Requise.';
  if (Object.keys(tournoiErrors.value).length > 0) return;

  tournoiModal.value.loading = true;
  try {
    if (tournoiModal.value.editing) {
      await updateTournoi(tournoiModal.value.id, tournoiForm.value);
      notify('success', 'Tournoi modifié.');
    } else {
      await createTournoi(tournoiForm.value);
      notify('success', 'Tournoi créé.');
    }
    closeTournoiModal();
    await fetchTournois();
  } catch (err) {
    tournoiModal.value.error = err.response?.data?.message || 'Erreur.';
  } finally {
    tournoiModal.value.loading = false;
  }
}

// --- Équipe Modal ---
const equipeModal = ref({ open: false, tournoi: null, loading: false, error: '', success: '' });
const equipeForm = ref({ nom: '', nom_joueur1: '', prenom_joueur1: '', nom_joueur2: '', prenom_joueur2: '', email: '', telephone: '' });
const equipeErrors = ref({});

function openEquipeModal(t) {
  equipeForm.value = { nom: '', nom_joueur1: '', prenom_joueur1: '', nom_joueur2: '', prenom_joueur2: '', email: '', telephone: '' };
  equipeErrors.value = {};
  equipeModal.value = { open: true, tournoi: t, loading: false, error: '', success: '' };
}

function closeEquipeModal() {
  equipeModal.value.open = false;
}

async function submitEquipe() {
  equipeModal.value.error = '';
  equipeModal.value.success = '';
  equipeErrors.value = {};

  if (!equipeForm.value.nom) equipeErrors.value.nom = 'Requis.';
  if (Object.keys(equipeErrors.value).length > 0) return;

  equipeModal.value.loading = true;
  try {
    await addEquipeAdmin(equipeModal.value.tournoi.id, equipeForm.value);
    equipeModal.value.success = 'Équipe ajoutée.';
    equipeForm.value = { nom: '', nom_joueur1: '', prenom_joueur1: '', nom_joueur2: '', prenom_joueur2: '', email: '', telephone: '' };
  } catch (err) {
    equipeModal.value.error = err.response?.data?.message || 'Erreur.';
  } finally {
    equipeModal.value.loading = false;
  }
}

// --- Équipes inscrites Modal ---
const equipesModal = ref({ open: false, tournoi: null, equipes: [], loading: false });

async function openEquipesModal(t) {
  equipesModal.value = { open: true, tournoi: t, equipes: [], loading: true };
  try {
    equipesModal.value.equipes = await getEquipesByTournoi(t.id);
  } catch {
    notify('error', 'Erreur lors du chargement des équipes.');
    equipesModal.value.open = false;
  } finally {
    equipesModal.value.loading = false;
  }
}

function closeEquipesModal() {
  equipesModal.value.open = false;
}

// --- Match Modal ---
const matchModal = ref({ open: false, tournoi: null, matchs: [], loading: false, message: '' });
const editingScore = ref(null);
const savingScore = ref(false);

async function openMatchModal(t) {
  matchModal.value = { open: true, tournoi: t, matchs: [], loading: true, message: '' };
  try {
    const data = await getMatchesByTournoi(t.id);
    matchModal.value.matchs = data.matchs;
    matchModal.value.message = data.message || '';
  } catch {
    matchModal.value.message = 'Erreur lors du chargement des matchs.';
  } finally {
    matchModal.value.loading = false;
  }
}

function closeMatchModal() {
  matchModal.value.open = false;
  editingScore.value = null;
}

function canEditScores(t) {
  if (!t) return false;
  return t.statut === 'complet';
}

function startEditScore(m) {
  editingScore.value = { id: m.id, score_equipe1: m.score_equipe1 || 0, score_equipe2: m.score_equipe2 || 0 };
}

async function saveScore() {
  savingScore.value = true;
  try {
    await updateScore(editingScore.value.id, editingScore.value.score_equipe1, editingScore.value.score_equipe2);
    const m = matchModal.value.matchs.find(x => x.id === editingScore.value.id);
    if (m) {
      m.score_equipe1 = editingScore.value.score_equipe1;
      m.score_equipe2 = editingScore.value.score_equipe2;
    }
    editingScore.value = null;
    notify('success', 'Score mis à jour.');
  } catch (err) {
    notify('error', err.response?.data?.message || 'Erreur.');
  } finally {
    savingScore.value = false;
  }
}

// --- Actions ---
async function handleChangeStatut(t, statut) {
  try {
    await changeStatut(t.id, statut);
    notify('success', `Statut changé en « ${statut} ».`);
    await fetchTournois();
  } catch (err) {
    notify('error', err.response?.data?.message || 'Erreur.');
  }
}

async function handleGenerateMatches(t) {
  try {
    const data = await generateMatches(t.id);
    notify('success', data.message || 'Matchs générés.');
  } catch (err) {
    notify('error', err.response?.data?.message || 'Erreur.');
  }
}

async function handleDelete(t) {
  if (!confirm(`Supprimer le tournoi « ${t.nom} » ?`)) return;
  try {
    await deleteTournoi(t.id);
    notify('success', 'Tournoi supprimé.');
    await fetchTournois();
  } catch (err) {
    notify('error', err.response?.data?.message || 'Erreur.');
  }
}

async function handleCheckExpired() {
  checkingExpired.value = true;
  try {
    const data = await checkExpired();
    notify('success', data.message || 'Vérification terminée.');
    await fetchTournois();
  } catch (err) {
    notify('error', err.response?.data?.message || 'Erreur.');
  } finally {
    checkingExpired.value = false;
  }
}

// --- Helpers ---
function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function notify(type, text) {
  notification.value = { type, text };
  setTimeout(() => { notification.value = null; }, 4000);
}

async function fetchTournois() {
  try {
    tournois.value = await getTournois();
  } catch {
    notify('error', 'Erreur lors du chargement des tournois.');
  }
}

onMounted(async () => {
  await fetchTournois();
  loading.value = false;
});
</script>