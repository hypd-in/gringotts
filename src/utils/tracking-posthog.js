export default function track(event, params) {
  let posthog;
  const { $posthog } = useNuxtApp();
  if ($posthog) {
    posthog = $posthog();
  }

  // console.log(event, params);
  if (params) {
    posthog.capture(event, params);
  } else {
    posthog.capture(event);
  }
}
