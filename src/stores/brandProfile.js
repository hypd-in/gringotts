import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBrandProfileStore = defineStore('brandProfile', () => {
    const brandInfo = ref({})
    const products = ref([])
    const saveBrand = (brand_info) => {
        brandInfo.value = { ...brand_info }
    }
    const addProducts = (products_list) => {
        products.value = [...products.value, ...products_list]
    }

    return { brandInfo, saveBrand, products, addProducts }
})