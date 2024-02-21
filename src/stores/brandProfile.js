import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBrandProfileStore = defineStore('brandProfile', () => {
    const brandInfo = ref({})
    const products = ref([])
    const page = ref(0)
    const saveBrand = (brand_info) => {
        brandInfo.value = { ...brand_info }
    }
    const addProducts = (products_list) => {
        products.value = [...products.value, ...products_list]
    }
    const clearProducts = () => {
        products.value = []
    }
    const resetPage = () => {
        page.value = 0
    }
    const addPage = () => {
        page.value += 1
    }

    return { brandInfo, saveBrand, products, addProducts, page, resetPage, clearProducts, addPage }
})