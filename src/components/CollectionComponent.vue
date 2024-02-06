<template>
    <!-- drafted item class for drafted -->
    <div class="collection-wrapper">
        <ImageFrame v-if="item.image" :src="optimizeImage(item.image.src, 350)"
            :alt="item.name + ' by ' + creatorStore.info.name" />
        <div v-else-if="item.default_image" class="default-image">
            <img class="catalog-image" v-for="(image, index) in item.default_image" :src="getReplacedSource(image.src, 350)"
                alt="" :key="`default_image_${index}`" />
        </div>
        <div class="collection-name">{{ item.name }}</div>
        <div class="collection-overlay" @click="goToManageCollection(item)"></div>
    </div>
</template>
  
<script setup>
import ImageFrame from "../components/ImageFrame.vue";

import track from "~/utils/tracking-posthog";

const router = useRouter()
const props = defineProps(["item", 'src'])
const creatorStore = useCreatorStore()

function goToManageCollection(item) {

    if (props.src == 'creator-store-collections')
        track('creator_store:collection_click', {
            creator_name: creatorStore.info.name,
            creator_username: creatorStore.info.username,
            collection_name: item.name,
            collection_id: item.id
        })


    if (item.collection_type == "affiliate") {
        router.push({
            name: "AffiliateCollection",
            params: {
                creatorUsername: creatorStore?.info?.username,
                collectionId: item.id,
            },
            query: {
                title: item.name,
            },
        });
    } else {
        router.push({
            name: "CreatorCollection",
            params: {
                id: item.id,
                creatorUsername: creatorStore?.info?.username,
                name: item.slug,
                collectionId: item.id,
            },
            query: {
                title: item.name,
            },
        });
    }
}
</script>
  
<style scoped>
.default-image {
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: repeat(2, 50%);
    gap: 2px;
    border-radius: 16px;
    overflow: hidden;
    width: 283px;
    height: 283px;
    cursor: pointer;
}

.catalog-image {
    height: 100%;
    width: 100%;
    object-fit: cover;
}

.catalog-image:nth-of-type(1) {
    border-top-left-radius: 16px;
}

.catalog-image:nth-of-type(2) {
    border-top-right-radius: 16px;
}

.catalog-image:nth-of-type(3) {
    border-bottom-left-radius: 16px;
}

.catalog-image:nth-of-type(4) {
    border-bottom-right-radius: 16px;
}

@media screen and (min-width: 0px) and (max-width: 480px) {
    .default-image {
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(2, 50%);
        grid-template-rows: repeat(2, 50%);
        height: 100%;
        width: 100%;
    }
}

.collection-wrapper {
    height: 283px;
    width: 283px;
    border-radius: 25px;
    overflow: hidden;
    position: relative;
    text-align: center;
    cursor: pointer;
}

.collection-wrapper .figure img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 25px;
}

.collection-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    content: "";
    top: 0;
    left: 0;
    border-radius: 25px;
    background: transparent linear-gradient(180deg,
            #00000000 0%,
            #0000000a 37%,
            #00000033 58%,
            #00000066 82%,
            #00000080 100%) 0% 0% no-repeat padding-box;
    z-index: 1;
}

.collection-name {
    position: absolute;
    width: calc(100% - 24px);
    bottom: 40px;
    color: #fff;
    z-index: 2;
    font-family: Urbanist-Bold;
    font-size: 18px;
    right: 50%;
    transform: translate(50%, 50%);
}

@media (min-width: 0) and (max-width: 480px) {
    .collection-wrapper {
        height: calc(100vw - 32px);
        width: calc(100vw - 32px);
        border-radius: 25px;
        overflow: hidden;
        position: relative;
        text-align: center;
        cursor: pointer;
    }
}
</style>
  