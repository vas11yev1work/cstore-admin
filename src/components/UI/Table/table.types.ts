type Position = 'left' | 'center' | 'right'

export interface TableHeader {
  id?: number | string
  name: string
  width?: number
  position?: Position
}

interface TableCell {
  id?: number | string
  title: number | string
  content?: Record<string, any>
}

export interface TableRow {
  id?: number | string,
  cells: TableCell[]
}
