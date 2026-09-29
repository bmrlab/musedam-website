import { redirect } from 'next/navigation'

export default async function DevelopersPage({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params
  redirect(`/${lng}/developers/landing`)
}
