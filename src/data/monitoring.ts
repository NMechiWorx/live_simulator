
import type { Employee } from '../types/employee'
import type { Position } from './safetyZones'

export const monitoringZones = [
  {
    name: 'Machining',
    minX: -12,
    maxX: 12,
    minZ: -10,
    maxZ: -2,
  },
  {
    name: 'Pressing',
    minX: -12,
    maxX: 12,
    minZ: -2,
    maxZ: 6,
  },
  {
    name: 'Assembly',
    minX: -12,
    maxX: 12,
    minZ: 7,
    maxZ: 13,
  },
] as const

export function getEmployeeZone(position: Position): string {
  const [x, , z] = position

  const zone = monitoringZones.find(
    (item) =>
      x >= item.minX &&
      x <= item.maxX &&
      z >= item.minZ &&
      z <= item.maxZ,
  )

  return zone?.name ?? 'Transit / Other'
}

export function getEmployeeDepartment(
  employee: Employee,
): string {
  const role = employee.role.toLowerCase()

  if (role.includes('cnc')) return 'CNC Operations'
  if (role.includes('assembly')) return 'Assembly'
  if (role.includes('machine')) return 'Machine Operations'

  return 'Other'
}
