export interface Color {
  id: number
  color: string
  name: string
}

export type CreateColor = Omit<Color, 'id'>
