
import type { EmployeeRoute } from '../types/route'

export const employeeRoutes: EmployeeRoute[] = [
  {
    employeeId: 'EMP-001',
    speed: 1.5,
    loop: true,
    waypoints: [
      { id: 'EMP001-WP1', position: [-3, 0, -2] },
      { id: 'EMP001-WP2', position: [-4, 0, 3] },
      { id: 'EMP001-WP3', position: [-6, 0, 7] },
      { id: 'EMP001-WP4', position: [-3, 0, 3] },
    ],
  },
  {
    employeeId: 'EMP-002',
    speed: 1.0,
    loop: true,
    waypoints: [
      { id: 'EMP002-WP1', position: [3, 0, -2] },
      { id: 'EMP002-WP2', position: [4, 0, 0] },
      { id: 'EMP002-WP3', position: [3, 0, 3] },
      { id: 'EMP002-WP4', position: [0, 0, 3] },
      { id: 'EMP002-WP5', position: [3, 0, -2] },
    ],
  },
  {
    employeeId: 'EMP-003',
    speed: 1.2,
    loop: true,
    waypoints: [
      { id: 'EMP003-WP1', position: [3, 0, 7] },
      { id: 'EMP003-WP2', position: [5, 0, 8] },
      { id: 'EMP003-WP3', position: [5, 0, 5] },
      { id: 'EMP003-WP4', position: [1, 0, 5] },
      { id: 'EMP003-WP5', position: [3, 0, 7] },
    ],
  },
]
