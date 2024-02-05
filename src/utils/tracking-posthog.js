export default function track(event) {
  let posthog;
  const { $posthog } = useNuxtApp();
  if ($posthog) {
    posthog = $posthog();
  }
  posthog.capture(event);
}
