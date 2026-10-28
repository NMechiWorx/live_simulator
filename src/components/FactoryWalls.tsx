
export default function FactoryWalls() {
  const wallMaterial = {
    color: "#b8c2cc",
    roughness: 0.9,
  };

  const wallHeight = 3;
  const wallThickness = 0.25;
  const roomSize = 30;
  const half = roomSize / 2;

  // Leave a 4-unit entrance in the front wall.
  const entranceWidth = 4;
  const frontSegmentWidth = (roomSize - entranceWidth) / 2;

  return (
    <group>
      {/* Back wall */}
      <mesh
        position={[0, wallHeight / 2, -half]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[roomSize, wallHeight, wallThickness]}
        />
        <meshStandardMaterial {...wallMaterial} />
      </mesh>

      {/* Left wall */}
      <mesh
        position={[-half, wallHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[wallThickness, wallHeight, roomSize]}
        />
        <meshStandardMaterial {...wallMaterial} />
      </mesh>

      {/* Right wall */}
      <mesh
        position={[half, wallHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[wallThickness, wallHeight, roomSize]}
        />
        <meshStandardMaterial {...wallMaterial} />
      </mesh>

      {/* Front wall — left section */}
      <mesh
        position={[
          -(entranceWidth / 2 + frontSegmentWidth / 2),
          wallHeight / 2,
          half,
        ]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[frontSegmentWidth, wallHeight, wallThickness]}
        />
        <meshStandardMaterial {...wallMaterial} />
      </mesh>

      {/* Front wall — right section */}
      <mesh
        position={[
          entranceWidth / 2 + frontSegmentWidth / 2,
          wallHeight / 2,
          half,
        ]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[frontSegmentWidth, wallHeight, wallThickness]}
        />
        <meshStandardMaterial {...wallMaterial} />
      </mesh>
    </group>
  );
}
