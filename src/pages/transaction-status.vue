<template>
    <div class="loader-page">
        <div class="container">
            <img src="@/assets/loaders/page-loader.svg" alt="" />
            <div class="message mt-12 ml-18 mr-18">
                Kindly do not close this tab as we are processing your transaction.
            </div>
        </div>
    </div>
</template>
  
<script setup>

const route = useRoute()
const router = useRouter()
const status = ref("")
const amount = ref(null)
const check_order_status = ref(null)

async function confirmOnPageLoad() {
    try {
        const response = await $fetch(useRuntimeConfig().public.orderURL +
            "/api/v2/order/transaction/status?order_id=" +
            route.query.order_id, {
            method: "GET",

            credentials: 'include',

            headers: {
                "Content-Type": "application/json",
            },
        })
        if (response.payload) {
            status.value = response.payload?.status;
            amount.value = response.payload?.amount;
        }
        if (status.value == "initiated") {
            orderConfirmation();
            return;
        } else if (status.value == "failed") {
            clearInterval(check_order_status.value);
            let path =
                "/payment-failed?orderID=" +
                route.query.order_id +
                "&order_amount=" +
                `${amount.value}`;
            if (route.query?.influencer_id) {
                path =
                    path + "&influencer_id=" + route.query?.influencer_id;
            }

            router.push(path);

        } else if (status.value == "confirmed") {
            clearInterval(check_order_status.value);
            let path =
                "/payment-success?orderID=" +
                route.query.order_id +
                "&order_amount=" +
                `${amount.value}`;
            if (route.query?.influencer_id) {
                path =
                    path + "&influencer_id=" + route.query?.influencer_id;
            }
            router.push(path);

            // Creating goKwikData Object to send every payment details to GoKwik to train CoD model
            // var goKwikData = {
            //     order_type: "non-gk",
            //     mid: this.$gokwick_mid,
            //     moid:route.query.order_id,
            //     environment: this.$gokwik_env,
            //     request_id: this.gokwik_request_id,
            //     gokwik_oid: "",
            // };
            // let a = {};
            // a["data"] = goKwikData;
            // sendDetailsToGoKwik([a], goKwikData.order_type);
        }
    }

    catch (err) {
        alert(err.response.data.error[0].message);
    }
}

function orderConfirmation() {
    // api req to validate transaction
    check_order_status.value = setInterval(async () => {
        try {

            const response = await $fetch(useRuntimeConfig().public.orderURL +
                "/api/v2/order/transaction/status?order_id=" +
                route.query.order_id, {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (response.payload) {
                status.value = response.payload?.status;
                amount.value = response.payload?.amount;
            }
            if (status.value == "initiated") {
                return;
            } else if (status.value == "failed") {
                clearInterval(check_order_status.value);
                let path =
                    "/payment-failed?orderID=" +
                    route.query.order_id +
                    "&order_amount=" +
                    `${amount.value}`;
                if (route.query?.influencer_id) {
                    path =
                        path + "&influencer_id=" + route.query?.influencer_id;
                }
                router.push(path);
            } else if (status.value == "confirmed") {
                clearInterval(check_order_status.value);
                let path = "/payment-success?orderID=" +
                    route.query.order_id +
                    "&order_amount=" +
                    `${amount.value}`
                if (route.query?.influencer_id) {
                    path =
                        path + "&influencer_id=" + route.query?.influencer_id;
                }
                
                router.push(path);

                // Creating goKwikData Object to send every payment details to GoKwik to train CoD model
                // var goKwikData = {
                //     order_type: "non-gk",
                //     mid:  useRuntimeConfig().public.gokwick_mid,
                //     moid:route.query.order_id,
                //     environment:useRuntimeConfig().public.gokwik_env,
                //     request_id: this.gokwik_request_id,
                //     gokwik_oid: "",
                // };
                // let a = {};
                // a["data"] = goKwikData;
                // sendDetailsToGoKwik([a], goKwikData.order_type);
            }
        }

        catch (err) {
            alert(err.response.data.error[0].message);
        }

    }, 5000);
}

// function sendDetailsToGoKwik(dataArray, orderType) {
//     setTimeout(() => {
//         var gokwik_Script = document.createElement("script");
//         gokwik_Script.setAttribute(
//             "src",
//             "https://checkout.gokwik.co/integration.js"
//         );
//         document.head.appendChild(gokwik_Script);
//         gokwik_Script.onload = () => {
//             for (let i in dataArray) {
//                 let merchantInfo = {
//                     order_type: orderType,
//                     mid: dataArray[i].data.mid,
//                     moid: dataArray[i].data.moid,
//                     environment: useRuntimeConfig().public.gokwik_env,
//                     request_id: dataArray[i].data.request_id,
//                     gokwik_oid: dataArray[i].data.gokwik_oid,
//                     showModal: false,
//                 };
//                 gokwikSdk.initPayment(merchantInfo);
//             }
//             // gokwikSdk.close();
//             // paying = false;
//         };
//     }, 800);
// }


onMounted(() => {
    if (window.innerWidth > 520) {
        if (route.query.order_id) {
            window.close();
        }
    } else {
        if (route.query.order_id) {
            confirmOnPageLoad();
        } else {
            navigateTo("/");
        }
    }
})
</script>
  
<style scoped>
.loader-page {
    position: relative;
    height: 100vh;
    width: 100vw;
}

.loader-page .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.container {
    font-family: Urbanist-Bold;
    width: 100%;
    text-align: center;
}
</style>