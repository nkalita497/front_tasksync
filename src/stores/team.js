import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {useAuthStore} from './auth'

export const useTeamStore = defineStore('team', () => {
    const authStore = useAuthStore()
    const currentTeamId = ref(null)
    const bearer = 'Bearer ' + localStorage.getItem("token");
    const allTeams = ref([])


    const currentTeamName = computed(() => {
        if (!currentTeamId.value || !allTeams.value.length) {
            return 'Ładowanie...'
        }
        const found = allTeams.value.find(team => team.id === currentTeamId.value)
        return found ? found.teamName : 'Ładowanie...'
    })

    // Pobierz zespoły użytkownika z API
    async function fetchTeams() {
        try {
            const bearer = 'Bearer ' + authStore.token;
            const res = await fetch('http://localhost:8081/teams', {
                method: 'GET',
                headers: {
                    'Authorization': bearer
                }
            })
            const data = await res.json()
            allTeams.value = data

            setCurrentTeam(localStorage.getItem('selectedTeam') * 1)


            if (allTeams.value.find(team => team.id === currentTeamId.value) === undefined) {
                console.log("tutaj")
                setCurrentTeam(allTeams.value[0].id)
            }

            // Jeśli nie ustawiono zespołu, ustaw pierwszy
            if (!currentTeamId.value && data.length > 0) {
                setCurrentTeam(allTeams.value[0].id)
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

    function clearTeams() {
        allTeams.value = [];
        currentTeamId.value = null;
    }


    return {
        currentTeamId,
        allTeams,
        fetchTeams,
        setCurrentTeam,
        currentTeamName
    }
})