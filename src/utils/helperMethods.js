import { getInfluencerById } from "./globalAPIs";

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
  console.log(observer);
  observer.observe(target);
  return observer;
}

export function getUTMParams() {
  var params = new URLSearchParams();
  var utmCookieParams = splitCookieValue(getCookie("utmParams"), "&", "=");
  for (const key in utmCookieParams) {
    if (utmCookieParams?.hasOwnProperty(key)) {
      params.append(key, utmCookieParams[key]);
    }
  }
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
  return null;
}

export function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export async function getCreatorUserName(id) {
  const router = useRouter();
  if (
    JSON.parse(getCookie("creators")) &&
    JSON.parse(getCookie("creators"))[id]
  ) {
    return JSON.parse(getCookie("creators"))[id].username;
  }
  if (store?.creator?.info?.username) {
    return store?.creator?.info?.username;
  }
  if (router.currentRoute.value.params.creator_username) {
    return router.currentRoute.value.params.creator_username;
  }
  if (localStorage.getItem("creatorInfo") != null) {
    var creatorInfo = { ...JSON.parse(localStorage.getItem("creatorInfo")) };
    return creatorInfo?.creatorName;
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
  if (getCookie("creators")) {
    return Object.values(JSON.parse(getCookie("creators")))[
      Object.values(JSON.parse(getCookie("creators"))).length - 1
    ].username;
  }
  // return "hypd_store";
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
