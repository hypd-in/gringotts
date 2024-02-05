export default function track(event, params) {
  let posthog;
  const { $posthog } = useNuxtApp();
  if ($posthog) {
    posthog = $posthog();
  }

  if (params) {
    posthog.capture(event, params);
  } else {
    posthog.capture(event);
  }
}
