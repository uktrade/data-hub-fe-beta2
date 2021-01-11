export type PayloadGET = {
  limit: number,
  offset: number,
  sortby: string,
} 

export type ResultGET<Item> = {
  count: number,
  next?: string,
  previous?: string,
  results: Item[],
} 

export interface NameId {
  id: string
  name: string
}