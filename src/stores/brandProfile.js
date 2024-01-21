import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBrandProfileStore = defineStore('brandProfile', () => {
    const brandInfo = ref({})
    const saveBrand = (brand_info) => {
        brandInfo.value = { ...brand_info }
    }

    return { brandInfo, saveBrand }
})