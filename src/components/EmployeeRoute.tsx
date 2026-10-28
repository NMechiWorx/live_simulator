
import { useMemo } from 'react'
import * as THREE from 'three'
import type { EmployeeRoute as EmployeeRouteData } from '../types/route'

type EmployeeRouteProps = {
  route: EmployeeRouteData
  color?: string
}

export default function EmployeeRoute({
  route,
  color = '#38bdf8',
}: EmployeeRouteProps) {
  const points = useMemo(
    () =>
      route.waypoints.map(
        (waypoint) =>
          new THREE.Vector3(
            waypoint.position[0],
            0.06,
            waypoint.position[2],
          ),
      ),
    [route],
  )

  const lineGeometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(points),
    [points],
  )

  return (
    <group>
      {/* Route line */}
      {points.length >= 2 && (
        <primitive
          object={lineGeometry}
          attach={undefined}
          visible={false}
        />
      )}

      {points.length >= 2 && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array(
                  points.flatMap((point) => [
                    point.x,
                    point.y,
                    point.z,
                  ]),
                ),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={color}
            linewidth={2}
          />
        </line>
      )}

      {/* Waypoint markers */}
      {route.waypoints.map((waypoint,) => (
        <group
          key={waypoint.id}
          position={[
            waypoint.position[0],
            0.08,
            waypoint.position[2],
          ]}
        >
          <mesh>
            <cylinderGeometry args={[0.22, 0.22, 0.06, 20]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.35}
            />
          </mesh>

          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
    </group>
  )
}
