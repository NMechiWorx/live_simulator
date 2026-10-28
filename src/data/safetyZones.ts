
export type Position = [number, number, number]

export type SafetyZone = {
  id: string
  name: string
  center: Position
  size: [number, number]
}

export const restrictedZones: SafetyZone[] = [
  {
    id: 'RZ-001',
    name: 'Restricted Press Area',
    center: [4, 0, 0],
    size: [2.8, 3],
  },
]

export function isInsideZone(
  position: Position,
  zone: SafetyZone,
): boolean {
  const [x, , z] = position
  const [centerX, , centerZ] = zone.center
  const [width, depth] = zone.size

  return (
    x >= centerX - width / 2 &&
    x <= centerX + width / 2 &&
    z >= centerZ - depth / 2 &&
    z <= centerZ + depth / 2
  )
}
