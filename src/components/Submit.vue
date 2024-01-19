<template>
    <div>
        <button class="submit-button" v-if="!loading && !disabledState" @click="submit">
            {{ defaultText }}
        </button>
        <button class="submit-button loading" v-if="loading && !disabledState">
            <!-- <div></div>
        <div>{{ processingText }}</div> -->
            <img src="../assets/loaders/Rolling-white.svg" alt="" />
        </button>
        <button class="submit-button disabled_button" v-if="disabledState && !loading">
            {{ defaultText }}
        </button>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps(["defaultText", "processingText", "loading", "disabledState"])

function submit() {
    this.$emit("submit");
}


</script>
<style scoped>
.loading {
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    text-align: center;
}

.loading img {
    height: 30px;
    justify-self: center;
}

.submit-button {
    white-space: nowrap;
    color: #fff;
    font-family: Urbanist-Bold;
    border-radius: 16px;
    background: #fb6c23;
    height: 48px;
    font-size: 14px;
    border: none;
    outline: none;
    width: 100%;
    cursor: pointer;
}

.spinner {
    height: 20px;
    width: 20px;
    position: relative;
    top: 50%;
    margin: -4px 0px;
    left: calc(50% - 12px);
    animation: rotation 1s infinite linear;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 100%;
}

.disabled_button {
    background: #5d5d5d1a;
    color: #13141b33;
    pointer-events: none;
}

.spinner:before {
    content: "";
    display: block;
    position: absolute;
    left: -2px;
    top: -2px;
    height: 100%;
    width: 100%;
    border-top: 2px solid rgba(255, 255, 255, 0.8);
    border-left: 2px solid transparent;
    border-bottom: 2px solid transparent;
    border-right: 2px solid transparent;
    border-radius: 100%;
}

.cancel-btn button {
    border: 1px solid #bebebe !important;
    background: var(--plain-white) !important;
    color: var(--primary-black) !important;
}
</style>
  