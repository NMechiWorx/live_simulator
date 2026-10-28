
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { MathUtils, type Group } from 'three'

import EmployeeMarker from './EmployeeMarker'
import type { Employee } from '../types/employee'
import type { EmployeeRoute } from '../types/route'

type MovingEmployeeProps = {
  employee: Employee
  route: EmployeeRoute
  isPlaying: boolean
  speedMultiplier: number
  isSelected: boolean
  onSelect: (id: string) => void
  onPositionChange: (
    id: string,
    position: [number, number, number],
  ) => void
}

export default function MovingEmployee({
  employee,
  route,
  isPlaying,
  speedMultiplier,
  isSelected,
  onSelect,
  onPositionChange,
}: MovingEmployeeProps) {
  const groupRef = useRef<Group>(null)
  const waypointIndex = useRef(1)
  const reportTimer = useRef(0)

  useFrame((_, delta) => {
    const group = groupRef.current
    const waypoints = route.waypoints

    if (!group || waypoints.length < 2) return

    if (isPlaying && speedMultiplier > 0) {
      const stepDelta = Math.min(delta, 0.05)
      let remainingDistance =
        route.speed * speedMultiplier * stepDelta

      while (remainingDistance > 0) {
        const target = waypoints[waypointIndex.current].position

        const dx = target[0] - group.position.x
        const dz = target[2] - group.position.z
        const distance = Math.sqrt(dx * dx + dz * dz)

        if (distance < 0.001) {
          waypointIndex.current += 1

          if (waypointIndex.current >= waypoints.length) {
            if (route.loop) {
              waypointIndex.current = 0
            } else {
              waypointIndex.current = waypoints.length - 1
              break
            }
          }

          continue
        }

        const targetRotation = Math.atan2(dx, dz)

        group.rotation.y = MathUtils.damp(
          group.rotation.y,
          targetRotation,
          10,
          stepDelta,
        )

        const travelDistance = Math.min(remainingDistance, distance)

        group.position.x += (dx / distance) * travelDistance
        group.position.z += (dz / distance) * travelDistance

        remainingDistance -= travelDistance

        if (travelDistance >= distance) {
          waypointIndex.current += 1

          if (waypointIndex.current >= waypoints.length) {
            if (route.loop) {
              waypointIndex.current = 0
            } else {
              waypointIndex.current = waypoints.length - 1
              break
            }
          }
        } else {
          break
        }
      }
    }

    // Report positions at most 10 times per second.
    reportTimer.current += delta

    if (reportTimer.current >= 0.1) {
      reportTimer.current = 0

      onPositionChange(employee.id, [
        group.position.x,
        group.position.y,
        group.position.z,
      ])
    }
  })

  return (
    <group
      ref={groupRef}
      position={route.waypoints[0]?.position ?? employee.position}
    >
      <EmployeeMarker
        id={employee.id}
        name={employee.name}
        role={employee.role}
        status={isPlaying ? 'moving' : 'idle'}
        position={[0, 0, 0]}
        color={isPlaying ? '#3b82f6' : '#f59e0b'}
        isSelected={isSelected}
        onSelect={onSelect}
      />
    </group>
  )
}
