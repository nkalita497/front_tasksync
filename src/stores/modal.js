// stores/modal.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
    const activeModal = ref(null)
    const modalProps = ref({})

    function openModal(name, props = {}) {
        activeModal.value = name
        modalProps.value = props
    }

    function closeModal() {
        activeModal.value = null
        modalProps.value = {}
    }

    return {
        activeModal,
        modalProps,
        openModal,
        closeModal
    }
})
