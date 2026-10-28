
import type { Employee } from '../types/employee'

export const employees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Employee 001',
    role: 'CNC Operator',
    position: [-3, 0, -2],
    status: 'working',
  },
  {
    id: 'EMP-002',
    name: 'Employee 002',
    role: 'Machine Operator',
    position: [3, 0, -2],
    status: 'idle',
  },
  {
    id: 'EMP-003',
    name: 'Employee 003',
    role: 'Assembly Operator',
    position: [3, 0, 7],
    status: 'working',
  },
]
