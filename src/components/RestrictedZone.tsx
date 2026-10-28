
import { Line, Text } from '@react-three/drei'
import type { SafetyZone } from '../data/safetyZones'

type RestrictedZoneProps = {
  zone: SafetyZone
  occupied: boolean
}

export default function RestrictedZone({
  zone,
  occupied,
}: RestrictedZoneProps) {
  const [width, depth] = zone.size

  const halfWidth = width / 2
  const halfDepth = depth / 2

  const corners: [number, number, number][] = [
    [-halfWidth, 0.07, -halfDepth],
    [halfWidth, 0.07, -halfDepth],
    [halfWidth, 0.07, halfDepth],
    [-halfWidth, 0.07, halfDepth],
    [-halfWidth, 0.07, -halfDepth],
  ]

  return (
    <group position={zone.center}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.045, 0]}
      >
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial
          color={occupied ? '#ef4444' : '#dc2626'}
          transparent
          opacity={occupied ? 0.48 : 0.25}
          depthWrite={false}
        />
      </mesh>

      <Line
        points={corners}
        color={occupied ? '#fef08a' : '#ef4444'}
        lineWidth={4}
      />

      <Text
        position={[0, 0.12, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#7f1d1d"
      >
        {occupied ? 'SAFETY ALERT' : 'RESTRICTED'}
      </Text>
    </group>
  )
}
