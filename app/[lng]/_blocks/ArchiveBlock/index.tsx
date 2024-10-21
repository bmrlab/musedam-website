import React from 'react'

import { ArchiveBlockProps } from './types'

import classes from './index.module.scss'
import { CollectionArchive } from '@/[lng]/components/CollectionArchive'
import { Gutter } from '@/[lng]/components/Gutter'
import RichText from '@/[lng]/components/RichText'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = props => {
  const {
    introContent,
    id,
    relationTo,
    populateBy,
    limit,
    populatedDocs,
    populatedDocsTotal,
    selectedDocs,
    categories,
  } = props

  return (
    <div id={`block-${id}`} className={classes.archiveBlock}>
      {introContent && (
        <Gutter className={classes.introContent}>
          <RichText content={introContent} />
        </Gutter>
      )}
      <CollectionArchive
        populateBy={populateBy}
        relationTo={relationTo}
        populatedDocs={populatedDocs}
        populatedDocsTotal={populatedDocsTotal}
        selectedDocs={selectedDocs}
        categories={categories}
        limit={limit}
        sort="-publishedAt"
      />
    </div>
  )
}
