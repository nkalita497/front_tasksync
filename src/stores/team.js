import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {useAuthStore} from './auth'

export const useTeamStore = defineStore('team', () => {
    const authStore = useAuthStore()
    const currentTeamId = ref(null)
    const bearer = 'Bearer ' + localStorage.getItem("token");
    const allTeams = ref([])

    const currentTeamName = computed( () => {
        setCurrentTeam(localStorage.getItem('selectedTeam')*1);


        if(currentTeamId.value === undefined || currentTeamId.value === null) {
            fetchTeams()
            return allTeams?.value.find(team => team.id === 0)?.teamName || 'Ładowanie...'
        }
        if(allTeams?.value.find(team => team.id === currentTeamId.value)?.teamName == null){
            return allTeams?.value.find(team => team.id === 0)?.teamName || 'Ładowanie...'
        }else{
            return allTeams?.value.find(team => team.id === currentTeamId.value)?.teamName || 'Ładowanie...'
        }
    })

    // Pobierz zespoły użytkownika z API
    async function fetchTeams() {
        console.log("fetching teams..")
        try {
            const res = await fetch('http://localhost:8081/teams', {
                method: 'GET',
                headers: {
                    'Authorization': bearer
                }
            })
            const data = await res.json()
            allTeams.value = data

            setCurrentTeam(localStorage.getItem('selectedTeam')*1)


            if(allTeams.value.find(team => team.id === currentTeamId.value) === undefined){
                console.log("tutaj")
                setCurrentTeam(allTeams.value[0].id)
            }

            // Jeśli nie ustawiono zespołu, ustaw pierwszy
            if (!currentTeamId.value && data.length > 0) {
                console.log(allTeams.value)
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


    return {
        currentTeamId,
        allTeams,
        fetchTeams,
        setCurrentTeam,
        currentTeamName
    }
})