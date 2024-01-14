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
