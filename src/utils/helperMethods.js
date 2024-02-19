// import { getData, setData } from "nuxt-storage/local-storage";

export function optimizeImage(imageURL, resolution) {
  if (imageURL) {
    const hostName = new URL(imageURL).hostname;
    if (hostName == "d3d92s7oewgbjx.cloudfront.net") {
      let newURL = imageURL.replace(hostName, useRuntimeConfig().public.cdn);
      if (resolution) {
        newURL = newURL + "?height=" + resolution;
      }
      return newURL;
    }
    if (hostName.endsWith("shopify.com")) {
      let url = imageURL.split(".");
      url[url.length - 2] = url[url.length - 2] + `_${resolution}x`;
      return url.join(".");
    } else {
      return imageURL;
    }
  }
}

export function getReplacedSource(source, height) {
  let newhostName;
  const filter = "/filters:strip_exif";
  if (process.env.NODE_ENV != "production") {
    newhostName = "cdn.getshitdone.in";
  } else {
    newhostName = "cdn.hypd.store";
  }
  let hostName = "d3d92s7oewgbjx.cloudfront.net";
  let hostName2 = "dmk9je7eclmvw.cloudfront.net";
  if (source?.includes(hostName)) {
    let newURL = source.replace(hostName, newhostName);

    if (newURL.includes(filter)) {
      newURL = newURL + "?height=" + "550";
      if (height > 0) {
        newURL = newURL + "?height=" + height;
      }
    }
    return newURL;
  } else if (source?.includes(hostName2)) {
    let newURL = source.replace(hostName2, newhostName);

    if (newURL.includes(filter)) {
      newURL = newURL + "?height=" + "550";
      if (height > 0) {
        newURL = newURL + "?height=" + height;
      }
    }
    return newURL;
  } else {
    return source;
  }
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

export function returnAlphabets(event) {
  if (event.inputType == "insertFromPaste") {
    var result = "";
    event.target.value.split("").forEach((value) => {
      if (/^[a-zA-Z]+$/.test(value)) {
        result += value;
      }
    });
    return result;
  }

  if (/^[a-zA-Z]+$/.test(event.target.value)) {
    return event.target.value;
  } else {
    return event.target.value?.replace(event.data, "");
  }
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

export function getUTMParams() {
  var params = useCookie("params");
  return params;
}

export function splitCookieValue(value, valueSeperator, keySeperator) {
  var obj = {};
  if (value && valueSeperator) {
    let seperatedValue = value.split(valueSeperator);

    seperatedValue.forEach((val) => {
      let keyValuePair = val.split(keySeperator);
      obj[keyValuePair[0]] = keyValuePair[1];
    });
    return obj;
  }
}

export async function getCreatorUserName(id) {
  const router = useRouter();
  const creatorStore = useCreatorStore();

  const creatorCookie = useCookie("creators");
  if (creatorCookie.value && creatorCookie.value[id]) {
    return creatorCookie.value[id].username;
  }
  let payload = null;

  let creator_id =
    id ||
    router.currentRoute.value.params.creator_id ||
    router.currentRoute.value.params.creatorId;

  if (id) {
    payload = await getInfluencerById(creator_id);
    return payload.username;
  }
  if (creatorStore?.info?.username) {
    return creatorStore?.info?.username;
  }
  if (router.currentRoute.value.params.creator_username) {
    return router.currentRoute.value.params.creator_username;
  }
  if (localStorage && localStorage.getItem("creatorInfo") != null) {
    var creatorInfo = { ...JSON.parse(localStorage.getItem("creatorInfo")) };
    return creatorInfo?.creatorName;
  }
  if (creatorCookie.value) {
    return Object.values(creatorCookie.value)[
      Object.values(creatorCookie.value).length - 1
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
}

export function defaultProfileImage() {
  //  This function generate random default profile image
  const defaultProfileImageList = [
    "https://dmk9je7eclmvw.cloudfront.net/assets/img/13ebdefault-user-profile.png",
    "https://dmk9je7eclmvw.cloudfront.net/assets/img/c216default-user-profile-1.png",
    "https://dmk9je7eclmvw.cloudfront.net/assets/img/834edefault-user-profile-2.png",
    "https://dmk9je7eclmvw.cloudfront.net/assets/img/d4b8default-user-profile-3.png",
  ];

  const min = 0;
  const max = defaultProfileImageList.length - 1;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return defaultProfileImageList[randomNumber];
}
