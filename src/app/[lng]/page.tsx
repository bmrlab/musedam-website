import LandingPage from '@/components/LandingPage'
import { Metadata } from 'next'

export default LandingPage

export function generateMetadata(): Metadata {
  return {
    title: 'MuseDAM | AI-Powered Digital Asset Management - Collect, Organize, Collaborate',
    description:
      'Discover MuseDAM, the smart digital asset management software that simplifies collection, organization, and team collaboration with AI-powered features.',
  }
}
