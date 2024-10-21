import LandingPage from '@/[lng]/components/LandingPage'
import { useTranslation } from '@/i18n'

export default async function Home({ params: { lng } }) {
  const { t } = await useTranslation(lng)

  return (
    <>
      <h1>{t('title')}</h1>
      <LandingPage />
    </>
  )
}
