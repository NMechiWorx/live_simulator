
export type Waypoint = {
  id: string
  position: [number, number, number]
}

export type EmployeeRoute = {
  employeeId: string
  waypoints: Waypoint[]
  speed: number
  loop: boolean
}
