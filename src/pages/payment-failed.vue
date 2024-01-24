<!-- <template>
    <div class="payment-result">
      <div
        class="payment-result wrapper pl-14 pr-14"
      >
        <div class="middle-align">
          <img src="@/assets/illustrations/p-failed.svg" alt="" />
          <div class="title mt-45">Payment Failed!</div>
          <div class="subtitle mt-14">Sorry! ☹️ But something went wrong!</div>
          <h4 style="color: #13141b">Don't Worry!</h4>
          <div class="paragraph mt-16">
            Any amount deducted will be refunded in 3 - 5 business days. Would you
            like to try again with a different payment option?
          </div>
          <button class="primary-button mt-60" @click="reviewPayment">
            Review Payment Method
          </button>
          <button
            v-if="creatorStore.info.id"
            class="secondary-button mt-20"
            @click="goToCreatorStore"
          >
            Back To Home
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { fetchCartInfo } from "@/API/APIs";

  import { getCookie } from '@/customMethods/globalMethods'; 


const        creatorInfo = ref({})
        const isExpress =  ref(null)


    async created() {
      this.isExpress = JSON.parse(localStorage.getItem("isExpress"));
      scrollTo(0, 0);
      await fetchCartInfo();
      if (!this.$route.query.orderID) {
        this.$router.replace("/orders");
      }
      // else {
      // let vm = this;
      // gtag("event", "payment_failed", {
      //   event_category: "transaction",
      //   event_label: "Payment Failed",
      //   value: vm.$route.query.orderID,
      // });
      // }
    },
    mounted() {
      if (getCookie("creators")) {
        let creators = JSON.parse(getCookie("creators"));
        this.creatorInfo = Object.values(creators)[Object.values(creators).length - 1]
      } else if (this.$store.state.creator.info) {
        this.creatorInfo = { ...this.$store.state.creator.info };
      }
    },
  
    beforeUnmount() {
      localStorage.removeItem("creatorInfo");
      // ga("ecommerce:clear");
    },
    methods: {
      reviewPayment() {
        if (this.isExpress?.express) {
          this.$router.replace(this.isExpress.url);
          localStorage.removeItem("isExpress");
        } else {
          this.$router.replace({
            name: "CartItems",
          });
        }
      },
      goToCreatorStore() {
        this.$router.replace({
          name: "creator_store",
          params: {
            creator_username: this.creatorInfo.username,
          },
        });
      },
    },

  </script>
  <style scoped>
  .wrapper {
    position: relative;
    height: 100vh;
    overflow-y: scroll;
  }
  
  .middle-align {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
  }
  
  .title {
    font-family: Urbanist-Bold;
    font-size: 30px;
    color: #13141b;
  }
  
  .subtitle {
    font-size: 18px;
    color: #13141b;
  }
  
  .paragraph {
    color: #a9a9a9;
    font-size: 18px;
  }
  
  .primary-button {
    color: #fff;
    font-family: Urbanist-Bold;
    border-radius: 20px;
    background: #fb6c23;
    padding: 16px;
    text-align: center;
    border: none;
    outline: none;
    width: 100%;
    cursor: pointer;
  }
  
  .secondary-button {
    color: #13141b;
    font-family: Urbanist-Bold;
    border-radius: 20px;
    border: 1px solid #eaeaea;
    padding: 16px;
    text-align: center;
    background: transparent;
    width: 100%;
    cursor: pointer;
  }
  
  .desktop_wrapper {
    height: calc(100vh);
    width: 500px;
    margin: 50px auto;
  }
  </style>
   -->