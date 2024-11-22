export type PropsWithLng<P = unknown> = {
  params: Promise<{ lng: string } & P>
}

export type MetadataProps<P = unknown> = {
  params: Promise<{ lng: string }>
} & P
