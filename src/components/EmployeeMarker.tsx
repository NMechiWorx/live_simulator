
import { Html } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

type EmployeeMarkerProps = {
  id: string
  name: string
  role: string
  status: 'working' | 'idle' | 'moving'
  position: [number, number, number]
  color?: string
  isSelected?: boolean
  onSelect?: (id: string) => void
}

export default function EmployeeMarker({
  id,
  name,
  role,
  status,
  position,
  color = '#22c55e',
  isSelected = false,
  onSelect,
}: EmployeeMarkerProps) {
  const uniformMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.75,
      }),
    [color],
  )

  const trousersMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.85,
      }),
    [],
  )

  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#eabf99',
        roughness: 0.85,
      }),
    [],
  )

  const statusColor = {
    working: '#22c55e',
    idle: '#f59e0b',
    moving: '#3b82f6',
  }[status]

  const handleClick = (event: { stopPropagation: () => void }) => {
    event.stopPropagation()
    onSelect?.(id)
  }

  return (
    <group
      position={position}
      onClick={handleClick}
    >
      {/* Selection ring */}
      {isSelected && (
        <mesh
          position={[0, 0.035, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.48, 0.62, 40]} />
          <meshBasicMaterial
            color="#facc15"
            side={THREE.DoubleSide}
            depthTest={false}
          />
        </mesh>
      )}

      {/* Torso */}
      <mesh
        position={[0, 1.15, 0]}
        material={uniformMaterial}
        castShadow
      >
        <boxGeometry args={[0.48, 0.7, 0.28]} />
      </mesh>

      {/* Head */}
      <mesh
        position={[0, 1.72, 0]}
        material={skinMaterial}
        castShadow
      >
        <sphereGeometry args={[0.19, 16, 16]} />
      </mesh>

      {/* Arms */}
      <mesh
        position={[-0.34, 1.18, 0]}
        rotation={[0, 0, -0.12]}
        material={uniformMaterial}
        castShadow
      >
        <boxGeometry args={[0.14, 0.58, 0.16]} />
      </mesh>

      <mesh
        position={[0.34, 1.18, 0]}
        rotation={[0, 0, 0.12]}
        material={uniformMaterial}
        castShadow
      >
        <boxGeometry args={[0.14, 0.58, 0.16]} />
      </mesh>

      {/* Legs */}
      <mesh
        position={[-0.13, 0.42, 0]}
        material={trousersMaterial}
        castShadow
      >
        <boxGeometry args={[0.17, 0.75, 0.2]} />
      </mesh>

      <mesh
        position={[0.13, 0.42, 0]}
        material={trousersMaterial}
        castShadow
      >
        <boxGeometry args={[0.17, 0.75, 0.2]} />
      </mesh>

      {/* Employee label */}
      <Html
        position={[0, 2.15, 0]}
        center
        distanceFactor={12}
        occlude={false}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            minWidth: '132px',
            padding: '8px 10px',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.96)',
            border: `2px solid ${isSelected ? '#facc15' : statusColor}`,
            boxShadow: isSelected
              ? '0 0 16px rgba(250,204,21,0.5)'
              : '0 4px 14px rgba(0,0,0,0.35)',
            color: '#f8fafc',
            fontFamily: 'Arial, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700 }}>
            {id}
            {isSelected ? ' ★' : ''}
          </div>

          <div style={{ fontSize: '11px', marginTop: '4px', color: '#e2e8f0' }}>
            {name}
          </div>

          <div style={{ fontSize: '10px', marginTop: '3px', color: '#94a3b8' }}>
            {role}
          </div>

          <div
            style={{
              marginTop: '7px',
              paddingTop: '5px',
              borderTop: '1px solid #334155',
              color: statusColor,
              fontSize: '10px',
              fontWeight: 700,
            }}
          >
            ● {status.toUpperCase()}
          </div>
        </div>
      </Html>
    </group>
  )
}
