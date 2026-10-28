
import { Text } from '@react-three/drei'

type WorkstationProps = {
  id: string
  position: [number, number, number]
}

export default function Workstation({
  id,
  position,
}: WorkstationProps) {
  return (
    <group position={position}>
      {/* Tabletop */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.18, 1.4]} />
        <meshStandardMaterial
          color="#a8b3c2"
          roughness={0.7}
        />
      </mesh>

      {/* Four table legs */}
      {[
        [-1, 0.52, 0.5],
        [1, 0.52, 0.5],
        [-1, 0.52, -0.5],
        [1, 0.52, -0.5],
      ].map((leg, index) => (
        <mesh
          key={index}
          position={leg as [number, number, number]}
          castShadow
        >
          <boxGeometry args={[0.12, 1.04, 0.12]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      ))}

      {/* Workstation marker */}
      <mesh position={[0, 1.23, 0]}>
        <boxGeometry args={[0.55, 0.06, 0.45]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>

      {/* Workstation ID */}
      <Text
        position={[0, 1.65, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.025}
        outlineColor="#0f172a"
      >
        {id}
      </Text>
    </group>
  )
}
