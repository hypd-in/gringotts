<template>
    <div>
        <div class="page-404">
            <div class="body-section">
                <div class="illustration-404">
                    <img src="@/assets/illustrations/404/404.svg" alt="" />
                    <div class="text-404">
                        Looks like you've landed on a page that does not exist.
                    </div>
                </div>
            </div>
            <div class="ellipse ellipse-1">
                <img src="@/assets/illustrations/404/Ellipse-1.png" alt="" />
            </div>
            <div class="ellipse ellipse-2">
                <img src="@/assets/illustrations/404/Ellipse-2.png" alt="" />
            </div>
            <div class="ellipse ellipse-3">
                <img src="@/assets/illustrations/404/Ellipse-3.png" alt="" />
            </div>
            <button class="clear" @click="handleError">Continue Shopping</button>
        </div>

    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps(['error'])

const handleError = () => clearError({ redirect: '/hypd_store' })
</script>


<style scoped>
.clear {
    position: absolute;
    top: 75%;
    left: 50%;
    transform: translateX(-50%);
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--primary-orange);
    border-radius: 12px;
    padding: 10px 20px;
    max-width: 200px;
    color: #fff;
}

.page-404 {
    position: relative;
    height: 100vh;
    width: 100vw;
    text-align: center;
}

.illustration-404 {
    /* width: 60%; */
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    margin: 0 auto;
}

.illustration-404 img {
    width: 800px;
}

.body-section {
    min-height: calc(100vh - 180px);
    top: 90px;
    position: relative;
}

.ellipse {
    position: absolute;
    filter: blur(12px);
}

.ellipse-1 {
    bottom: 0;
    left: 0;
}

.ellipse-2 {
    bottom: 0;
    right: 0;
}

.ellipse-3 {
    top: 0;
    left: 0;
}

.text-404 {
    color: #616161;
    font-size: 24px;
    margin-top: 18px;
}

@media (min-width: 320px) and (max-width: 480px) {
    .clear {
        top: 65%;
    }

    .page-404 {
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .body-section {
        min-height: calc(100vh - 180px);
    }

    .illustration-404 {
        position: absolute;
        left: auto;
        transform: none;
        top: 40%;
        transform: translateY(-50%);
        width: 100vw;
        /* margin: 0 auto; */
    }

    .illustration-404 img {
        width: 100%;
        /* width: 200%; */
        /* transform: translateY(-50%);
    position: absolute; */
    }

    .text-404 {
        font-size: 20px;
        margin: 18px 20px;
    }
}
</style>


