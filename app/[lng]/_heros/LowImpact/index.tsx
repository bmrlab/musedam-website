import React from 'react'

import { Page } from '@src/payload/payload-types'
import { Gutter } from '../../components/Gutter'
import RichText from '../../components/RichText'
import { VerticalPadding } from '../../components/VerticalPadding'

import classes from './index.module.scss'

export const LowImpactHero: React.FC<Page['hero']> = ({ richText }) => {
  return (
    <Gutter className={classes.lowImpactHero}>
      <div className={classes.content}>
        <VerticalPadding>
          <RichText className={classes.richText} content={richText} />
        </VerticalPadding>
      </div>
    </Gutter>
  )
}
