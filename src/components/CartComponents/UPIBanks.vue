<template>
    <div @click="selectActive" class="chip" :class="{ 'active-method': activeApp == brandName }">
        <div class="brand-icon">
            <img :src="brandIcon" alt="" />
        </div>
        <div class="brand-name">
            {{ brandName }}
        </div>
    </div>
</template>
  
<script setup>
const props = defineProps(["brandIcon", "brandName", "activeApp", "isBank", "bankObj"])
const emit = defineEmits(["selectActiveApp"])

function selectActive() {
    if (props.isBank) {
        emit("selectActiveApp", props.bankObj);
    } else {
        emit("selectActiveApp", props.brandName);
    }
}
</script>
  
<style scoped>
.chip {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    background: #f8f8f8;
    border-radius: 16px;
    padding: 10px 16px;
    box-sizing: border-box;
}

.brand-icon img {
    background: #fff;
    padding: 12px;
    height: 24px;
    border-radius: 12px;
    width: 26px;
    object-fit: contain;
}

.brand-icon {
    display: flex;
}

.brand-name {
    white-space: nowrap;
    font-family: Urbanist-Bold;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: -0.30000001192092896px;
    text-align: center;
}

.active-method {
    border: 1px solid #13141b;
}
</style>