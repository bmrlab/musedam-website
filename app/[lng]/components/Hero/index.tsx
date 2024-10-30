import React from 'react'

import { HighImpactHero } from '../../_heros/HighImpact'
import { LowImpactHero } from '../../_heros/LowImpact'
import { MediumImpactHero } from '../../_heros/MediumImpact'
import { Page } from '@src/payload/payload-types'

const heroes = {
  highImpact: HighImpactHero,
  mediumImpact: MediumImpactHero,
  lowImpact: LowImpactHero,
}

export const Hero: React.FC<Page['hero']> = props => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
