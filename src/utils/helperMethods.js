export function optimizeImage(image) {
  return image;
}

export function getReplacedSource(src) {
  return src;
}

export function getObjectLength(value) {
  if (value) {
    return Object.keys(value).length;
  } else {
    return 0;
  }
}

export function convertToINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

export function returnMaxLength(event, maxlength) {
  event.target.value = event.target.value.slice(0, maxlength);
  return event.target.value;
}

export function returnNumber(event) {
  if (event.inputType == "insertFromPaste") {
    var result = "";
    event.target.value.split("").forEach((value) => {
      if (/^[0-9]*$/.test(value)) {
        result += value;
      }
    });
    return result;
  }
  if (/^[0-9]*$/.test(event.target.value)) {
    return event.target.value;
  } else {
    return event.target.value.replace(event.data, "");
  }
}

export function addingObserver(target, callback) {
  let options = {
    rootMargin: "0px",
    root: null,
    threshold: 0.1,
  };

  let observer = new IntersectionObserver(callback, options);
  observer.observe(target);
  return observer;
}

export function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie?.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export async function getCreatorUserName(id) {
  const route = useRoute();
  const creatorStore = useCreatorStore();
  if (
    JSON.parse(getCookie("creators")) &&
    JSON.parse(getCookie("creators"))[id]
  ) {
    return JSON.parse(getCookie("creators"))[id].username;
  }
  if (creatorStore?.info?.username) {
    return creatorStore?.info?.username;
  }
  if (route.params.creator_username) {
    return route.params.creator_username;
  }
  if (localStorage.getItem("creatorInfo") != null) {
    var creatorInfo = { ...JSON.parse(localStorage.getItem("creatorInfo")) };
    return creatorInfo?.creatorName;
  }
  let payload = null;

  let creator_id = id || route.params.creator_id || route.params.creatorId;

  if (id) {
    payload = await getInfluencerById(creator_id);
    return payload.username;
  }
  if (getCookie("creators")) {
    return Object.values(JSON.parse(getCookie("creators")))[
      Object.values(JSON.parse(getCookie("creators"))).length - 1
    ].username;
  }
  return "hypd_store";
}

export function createCouponsMap(coupons) {
  const store = useStore();
  var obj = {
    cart: [],
  };
  coupons.forEach((coupon) => {
    if (coupon.applicable_on.name == "cart") {
      obj["cart"] = [...new Set([...obj["cart"], coupon])];
    } else if (
      coupon.applicable_on.name == "brand" ||
      coupon.applicable_on.name == "catalog"
    ) {
      coupon.applicable_on.ids.forEach((id) => {
        if (!obj[id]) {
          obj[id] = [];
        }
        obj[id] = [...new Set([...obj[id], coupon])];
      });
    } else if (coupon.applicable_on?.name == "bxgy") {
      coupon.applicable_on.bxgy?.buy_ids?.forEach((id) => {
        if (!obj[id]) {
          obj[id] = [];
        }
        obj[id] = [...new Set([...obj[id], coupon])];
      });

      coupon.applicable_on.bxgy?.get_ids?.forEach((id) => {
        if (!obj[id]) {
          obj[id] = [];
        }
        obj[id] = [...new Set([...obj[id], coupon])];
      });
    } else if (coupon.applicable_on?.name == "bundle") {
      if (
        coupon.applicable_on.bundle?.catalog_ids &&
        coupon.applicable_on.bundle?.catalog_ids?.length > 0
      ) {
        coupon.applicable_on.bundle?.catalog_ids?.forEach((id) => {
          if (!obj[id]) {
            obj[id] = [];
          }
          obj[id] = [...new Set([...obj[id], coupon])];
        });
      } else if (
        coupon.applicable_on.bundle?.brand_id &&
        !coupon.applicable_on.bundle.catalog_ids
      ) {
        if (!obj[coupon.applicable_on.bundle?.brand_id]) {
          obj[coupon.applicable_on.bundle?.brand_id] = [];
        }
        obj[coupon.applicable_on.bundle?.brand_id] = [
          ...new Set([...obj[coupon.applicable_on.bundle?.brand_id], coupon]),
        ];
      }
    }
  });
  store.saveCouponsMap(obj);
  // store.dispatch("saveCouponsMap", obj);
}
