import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
    const activeModal = ref(null)

    function openModal(name) {
        activeModal.value = name
    }

    function closeModal() {
        activeModal.value = null
    }

    return {
        activeModal,
        openModal,
        closeModal
    }
})
