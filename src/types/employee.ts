
export type EmployeeStatus = 'working' | 'idle' | 'moving'

export type Employee = {
  id: string
  name: string
  role: string
  position: [number, number, number]
  status: EmployeeStatus
}
