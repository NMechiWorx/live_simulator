
import { Text } from '@react-three/drei'

type ZoneProps = {
  name: string
  position: [number, number, number]
  size: [number, number]
  color: string
}

function Zone({ name, position, size, color }: ZoneProps) {
  return (
    <group position={position}>
      {/* Colored floor area */}
      <mesh
        position={[0, 0.015, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={size} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.28}
          roughness={1}
          depthWrite={false}
        />
      </mesh>

      {/* Zone label */}
      <Text
        position={[0, 0.08, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.65}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {name.toUpperCase()}
      </Text>
    </group>
  )
}

export default function FactoryZones() {
  return (
    <group>
      <Zone
        name="Machining"
        position={[0, 0, -6]}
        size={[24, 8]}
        color="#60a5fa"
      />

      <Zone
        name="Pressing"
        position={[0, 0, 2]}
        size={[24, 8]}
        color="#fb923c"
      />

      <Zone
        name="Assembly"
        position={[0, 0, 10]}
        size={[24, 6]}
        color="#4ade80"
      />
    </group>
  )
}
