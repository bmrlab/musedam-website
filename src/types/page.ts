export type PropsWithLng<P = unknown> = {
  params: Promise<{ lng: string } & P>
}
