
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'

type CameraFollowProps = {
  target: [number, number, number] | null
  enabled: boolean
}

export default function CameraFollow({
  target,
  enabled,
}: CameraFollowProps) {
  const { camera } = useThree()

  const desiredPosition = useRef(new Vector3())
  const lookAtPosition = useRef(new Vector3())

  useFrame((_, delta) => {
    if (!enabled || !target) return

    const [x, y, z] = target

    desiredPosition.current.set(x + 8, y + 7, z + 8)
    lookAtPosition.current.set(x, y + 1, z)

    camera.position.lerp(
      desiredPosition.current,
      1 - Math.exp(-3 * delta),
    )

    camera.lookAt(lookAtPosition.current)
  })

  return null
}
