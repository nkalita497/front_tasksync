import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export const useTeamStore = defineStore('team', () => {
    const authStore = useAuthStore()
    const teams = ref([])
    const currentTeamId = ref(null)

    // Domyślny zespół jednoosobowy
    const defaultPersonalTeam = computed(() => ({
        id: 'personal',
        name: `${authStore.user?.name || 'Moje'} zadania`,
        isPersonal: true
    }))

    // Aktualnie wybrany zespół
    const currentTeam = computed(() => {
        if (currentTeamId.value === 'personal') return defaultPersonalTeam.value
        return teams.value.find(team => team.id === currentTeamId.value) || defaultPersonalTeam.value
    })

    // Wszystkie zespoły wraz z domyślnym
    const allTeams = computed(() => [
        defaultPersonalTeam.value,
        ...teams.value
    ])

    // Pobierz zespoły użytkownika z API
    async function fetchTeams() {
        try {
            const response = await api.get('/teams')
            teams.value = response.data

            // Jeśli nie ma wybranego teamu, ustaw domyślny
            if (!currentTeamId.value) {
                currentTeamId.value = 'personal'
            }
        } catch (error) {
            console.error('Błąd pobierania zespołów:', error)
        }
    }

    // Zmień aktualny zespół
    function setCurrentTeam(teamId) {
        currentTeamId.value = teamId
        localStorage.setItem('selectedTeam', teamId) // Zapisz wybór
    }

    // Inicjalizacja - wczytaj zapisany zespół
    function init() {
        const savedTeam = localStorage.getItem('selectedTeam')
        if (savedTeam) {
            currentTeamId.value = savedTeam
        }
        fetchTeams()
    }

    return {
        teams,
        currentTeam,
        currentTeamId,
        allTeams,
        fetchTeams,
        setCurrentTeam,
        init
    }
})