
import { Line } from '@react-three/drei'
import { useMemo } from 'react'
import type { HistoryPoint } from '../types/history'

type MovementTrailProps = {
  points: HistoryPoint[]
}

export default function MovementTrail({
  points,
}: MovementTrailProps) {
  const linePoints = useMemo(
    () =>
      points.map(
        (point): [number, number, number] => [
          point.position[0],
          point.position[1] + 0.12,
          point.position[2],
        ],
      ),
    [points],
  )

  if (linePoints.length < 2) return null

  return (
    <Line
      points={linePoints}
      color="#facc15"
      lineWidth={3}
      transparent
      opacity={0.9}
      depthTest={false}
    />
  )
}
