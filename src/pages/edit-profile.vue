<template>
  <ClientOnly>
    <div class="edit-profile-wrapper" v-if="store.user?.id">

      <h3 class="heading">Edit Profile</h3>

      <div class="user-image-wrapper">
        <NuxtImg v-if="userInfo.profile_image?.src" :src="userInfo.profile_image.src" class="user-image" />
        <NuxtImg v-else src="/icons/image-icon.svg" class="user-image" />
        <button class="edit-btn" @click="selectFile">
          <img src="/icons/camera.svg" alt="">
        </button>

        <input @change="processImage" type="file" accept="image/png, image/jpeg" name="profile-image" id="profile-image"
          style="display: none;">
      </div>

      <div class="input-wrapper">
        <label for="full-name">Your Full Name</label>
        <input type="text" name="full-name" @input="updateFullName" id="full-name" v-model="userInfo.full_name">
      </div>

      <div class="input-wrapper">
        <label for="phone-no">Phone Number</label>
        <div style="display: grid; grid-template-columns: 32px auto;">
          <input type="tel" disabled name="prefix" v-if="store.user.phone_no?.prefix" v-model="userInfo.phone_no.prefix">
          <input type="tel" disabled name="phone-no" id="phone-no" v-if="store.user.phone_no?.number" v-model="userInfo.phone_no.number">
        </div>
      </div>

      <div class="input-wrapper">
        <label for="email">Your Email</label>
        <input type="text" v-if="userInfo.email" name="email" id="email" v-model="userInfo.email">
      </div>

      <div class="input-wrapper">
        <label for="dob">Date of Birth</label>
        <input type="date" v-if="dob" @input="updateDob" :value="dob">
      </div>

      <div class="input-wrapper">
        <label for="gender">Gender</label>
        <div class="genders">
          <div class="gender-selector" @click="updateGender(key)" :class="{ 'selected-gender': key == userInfo.gender }"
            v-for="(gender, key) in genders" :key="key">
            {{ gender }}
          </div>
        </div>
      </div>

      <SubmitButton class="submit-button" default-text="Update Profile" :loading="updatingUserInfo" :disabled="enableUpdateButton"
        @submit="updateUserInfo" />
    </div>
  </ClientOnly>
</template>

<script setup>
import SubmitButton from '~/components/SubmitButton.vue';

definePageMeta({
  name: "EditProfile",
  layout: "default",
});

const store = useStore();
const config = useRuntimeConfig();
const dob = computed(() => {
  if (userInfo.value.dob) {
    var date = new Date(userInfo.value.dob);
    return date.toISOString().substring(0, 10);
  }
});

const enableUpdateButton = computed(() => {
  if ((userInfo.value.full_name != store.user.full_name) || (userInfo.value.email != store.user.email) || (userInfo.value.dob != store.user.dob) || (userInfo.value.profile_image?.src != store.user.profile_image?.src)) {
    return false;
  } else {
    return true;
  }
});

const userInfo = ref({});
const uploadingImage = ref(false);
const updatingUserInfo = ref(false);

const genders = ref({
  'M': 'male',
  'F': 'female',
  'O': 'others'
})

function updateDob(event) {
  var updatedDob = new Date(event.target.value);
  userInfo.value.dob = updatedDob.toJSON();
}

function updateGender(key) {
  userInfo.value.gender = key
}

function selectFile() {
  var imageInput = document.querySelector("#profile-image");
  imageInput.click();
}

async function processImage(event) {
  var base64Image = await convertToBase64Image(event.target.files[0]);
  var profileImage = await uploadImageToCms(event.target.files[0].name, base64Image);
  if (profileImage) {
    userInfo.value = {
      ...userInfo.value,
      profile_image: {
        'src': profileImage,
      },
    }
  }
}

function convertToBase64Image(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

async function uploadImageToCms(fileName, base64Image) {
  try {
    uploadingImage.value = true;
    var response = await $fetch(`${config.public.cmsURL}/api/image/upload`, {
      method: "POST",
      body: {
        file_name: fileName,
        base64_src: base64Image,
      },
      params: {
        isWeb: true,
      },
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    })
    if (JSON.parse(response).payload) {
      uploadingImage.value = false;
      return JSON.parse(response).payload.url;
    }
  } catch (error) {
    uploadingImage.value = false;
    console.log("Error uploading Image", error);
    alert("Sorry, we were not able to upload your profile image!");
    return null;
  }
}

async function updateUserInfo() {
  try {
    updatingUserInfo.value = true;
    var requestBody = {
      id: userInfo.value.customer_id,
      full_name: userInfo.value.full_name,
      gender: userInfo.value.gender,
      dob: userInfo.value.dob,
      user_id: userInfo.value.id,
    }
    if (userInfo.value.profileImage) {
      requestBody = {
        ...requestBody,
        profile_image: { ...userInfo.value.profile_image },
      }
    }
    var response = await $fetch(`${config.public.entityURL}/api/customer`, {
      method: "PUT",
      credentials: "include",
      body: requestBody,
      params: {
        isWeb: true,
      },
      headers: {
        "Content-Type": "application/json",
      }
    })

    if (response.payload) {
      console.log(response.payload);
      await fetchUserInfo();
      updatingUserInfo.value = false;
    }
  } catch (error) {
    updatingUserInfo.value = false;
    alert("Error updating user info");
    console.log("Error updating user info", error);
  }
}


onMounted(() => {
  if (store.user?.id) {
    userInfo.value = { ...store.user };
  }
})

watch(() => store.user, (newV) => {
  if (userInfo.value?.id != newV.id) {
    userInfo.value = { ...newV };
  }
})
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  h3.heading {
    display: none !important;
  }
}

.edit-profile-wrapper {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px;
}

h3.heading {
  font-family: Urbanist-Bold;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: 0.2px;
  margin: 0 0 16px;
}

.user-image-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
}

.user-image {
  width: 90px;
  height: 90px;
  border-radius: 12px;
}

.edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;

  width: 28px;
  height: 28px;
}

.edit-btn img {
  width: 100%;
  height: 100%;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: flex-start;
  row-gap: 4px;
  margin: 16px 0;
}

label {
  font-family: Urbanist-SemiBold;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.2px;
  color: var(--secondary-text);
}

input {
  border: none;
  border-bottom: 1px solid var(--primary-border-color);
  outline: none;
  padding: 8px 0;
  font-family: Urbanist-Medium;
  font-size: 16px;
  line-height: 21px;
  letter-spacing: 0.2px;
}

.genders {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  column-gap: 4px;
  text-transform: capitalize;
  margin: 16px 0 0;
}

.gender-selector {
  padding: 12px;
  border: 1px solid var(--primary-border-color);
  border-radius: 12px;
  width: calc((100% - 48px) / 3);
  text-align: center;

  font-family: Urbanist-Medium;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.4px;
  color: var(--primary-black);
  cursor: pointer;
}

.gender-selector:hover {
  border: 1px solid var(--primary-black);
}

.selected-gender {
  background: var(--primary-purple);
  color: var(--plain-white);
  border: 1px solid var(--primary-purple);
}

.selected-gender:hover {
  border: 1px solid var(--primary-purple);
}
</style>