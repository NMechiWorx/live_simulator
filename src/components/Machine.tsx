
import { Text } from '@react-three/drei'

type MachineProps = {
  name: string
  position: [number, number, number]
  color?: string
}

export default function Machine({
  name,
  position,
  color = '#2563eb',
}: MachineProps) {
  return (
    <group position={position}>
      {/* Main machine body */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 1.8]} />
        <meshStandardMaterial
          color={color}
          roughness={0.55}
          metalness={0.25}
        />
      </mesh>

      {/* Top panel */}
      <mesh position={[0, 2.05, 0]} castShadow>
        <boxGeometry args={[1.7, 0.12, 1.5]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Front control panel */}
      <mesh position={[0, 1.35, 0.916]}>
        <boxGeometry args={[0.8, 0.5, 0.04]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Status light */}
      <mesh position={[0.55, 1.65, 0.94]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#16a34a"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Machine identification label */}
      <Text
        position={[0, 2.65, 0]}
        fontSize={0.32}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.025}
        outlineColor="#0f172a"
      >
        {name}
      </Text>
    </group>
  )
}
