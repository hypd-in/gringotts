import { useBrandProfileStore } from '~/stores/brandProfile.js'

export default {
  asyncData({ $pinia }) {
    const store = useBrandProfileStore($pinia)
  },
}

export async function getBrandInfoFromUsername() {
  const { data, pending, error, refresh } = await useFetch(`https://entity.getshitdone.in/api/app/brand/username/ghumakkad`, {

  })
  // console.log({ data, pending, error, refresh });
  return { data, pending, error, refresh }
}
