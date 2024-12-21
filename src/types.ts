export type RemoveOptional<T> = {
  [K in keyof T]-?: Exclude<T[K], undefined | null>
}
