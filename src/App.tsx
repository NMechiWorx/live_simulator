
import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Grid, OrbitControls } from '@react-three/drei'

import FactoryWalls from './components/FactoryWalls'
import FactoryZones from './components/FactoryZones'
import Machine from './components/Machine'
import Workstation from './components/Workstation'
import EmployeeMarker from './components/EmployeeMarker'
import EmployeeRoute from './components/EmployeeRoute'
import MovingEmployee from './components/MovingEmployee'
import CameraFollow from './components/CameraFollow'
import MovementTrail from './components/MovementTrail'
import RestrictedZone from './components/RestrictedZone'
import ManagementDashboard from './components/ManagementDashboard'

import { employees } from './data/employees'
import { employeeRoutes } from './data/routes'
import { isInsideZone, restrictedZones } from './data/safetyZones'

import type { Position } from './data/safetyZones'
import type { HistoryPoint } from './types/history'

type SafetyEvent = {
  id: number
  employeeId: string
  zoneId: string
  zoneName: string
  type: 'ENTRY' | 'EXIT'
  timestamp: number
}

type SceneProps = {
  isPlaying: boolean
  speedMultiplier: number
  selectedId: string | null
  positions: Record<string, Position>
  onSelect: (id: string) => void
  onPositionChange: (id: string, position: Position) => void
  followTarget: Position | null
  followEnabled: boolean
  selectedHistory: HistoryPoint[]
  showTrail: boolean
  occupiedZoneIds: string[]
}

const panelClass =
  'rounded-xl border border-slate-800 bg-slate-900 p-4'

function Floor() {
  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#263442"
          roughness={0.92}
        />
      </mesh>

      <Grid
        position={[0, 0, 0]}
        args={[30, 30]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#526171"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#8293a6"
        fadeDistance={35}
        fadeStrength={1}
        infiniteGrid={false}
      />
    </>
  )
}

function Scene({
  isPlaying,
  speedMultiplier,
  selectedId,
  positions,
  onSelect,
  onPositionChange,
  followTarget,
  followEnabled,
  selectedHistory,
  showTrail,
  occupiedZoneIds,
}: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{
        position: [20, 16, 22],
        fov: 50,
        near: 0.1,
        far: 100,
      }}
      gl={{ antialias: true }}
      onPointerMissed={() => onSelect('')}
    >
      <color attach="background" args={['#111827']} />

      <ambientLight intensity={0.65} />

      <hemisphereLight
        args={['#dbeafe', '#475569', 1.1]}
      />

      <directionalLight
        position={[8, 14, 6]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0002}
      />

      <pointLight
        position={[-8, 7, -8]}
        intensity={35}
        distance={25}
        color="#bfdbfe"
      />

      <Floor />
      <FactoryZones />
      <FactoryWalls />

      {restrictedZones.map((zone) => (
        <RestrictedZone
          key={zone.id}
          zone={zone}
          occupied={occupiedZoneIds.includes(zone.id)}
        />
      ))}

      <Machine
        name="CNC-001"
        position={[-6, 0, -5]}
        color="#2563eb"
      />

      <Machine
        name="CNC-002"
        position={[0, 0, -5]}
        color="#0891b2"
      />

      <Machine
        name="CNC-003"
        position={[6, 0, -5]}
        color="#475569"
      />

      <Machine
        name="PRESS-001"
        position={[-6, 0, 2]}
        color="#d97706"
      />

      <Machine
        name="PRESS-002"
        position={[0, 0, 2]}
        color="#7c3aed"
      />

      <Workstation
        id="WS-001"
        position={[-6, 0, 9]}
      />

      <Workstation
        id="WS-002"
        position={[0, 0, 9]}
      />

      <Workstation
        id="WS-003"
        position={[6, 0, 9]}
      />

      {employeeRoutes.map((route) => (
        <EmployeeRoute
          key={route.employeeId}
          route={route}
          color={
            selectedId === route.employeeId
              ? '#facc15'
              : '#38bdf8'
          }
        />
      ))}

      {employees.map((employee) => {
        const route = employeeRoutes.find(
          (item) => item.employeeId === employee.id,
        )

        if (route && route.waypoints.length > 1) {
          return (
            <MovingEmployee
              key={employee.id}
              employee={employee}
              route={route}
              isPlaying={isPlaying}
              speedMultiplier={speedMultiplier}
              isSelected={selectedId === employee.id}
              onSelect={onSelect}
              onPositionChange={onPositionChange}
            />
          )
        }

        return (
          <EmployeeMarker
            key={employee.id}
            id={employee.id}
            name={employee.name}
            role={employee.role}
            status={employee.status}
            position={
              positions[employee.id] ?? employee.position
            }
            color={
              employee.status === 'working'
                ? '#22c55e'
                : '#f59e0b'
            }
            isSelected={selectedId === employee.id}
            onSelect={onSelect}
          />
        )
      })}

      {selectedId && showTrail && (
        <MovementTrail points={selectedHistory} />
      )}

      <CameraFollow
        target={followTarget}
        enabled={followEnabled}
      />

      <OrbitControls
        makeDefault
        enabled={!followEnabled}
        enableDamping
        dampingFactor={0.08}
        minDistance={5}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2 - 0.02}
      />
    </Canvas>
  )
}

function App() {
  // Stage 5: Simulation controls
  const [isPlaying, setIsPlaying] = useState(true)
  const [speedMultiplier, setSpeedMultiplier] = useState(1)

  // Stage 6: Employee interaction
  const [selectedId, setSelectedId] = useState<string | null>(
    null,
  )
  const [search, setSearch] = useState('')
  const [followEnabled, setFollowEnabled] = useState(false)

  // Stage 7: Movement history
  const [showTrail, setShowTrail] = useState(true)

  const [history, setHistory] = useState<
    Record<string, HistoryPoint[]>
  >({})

  const [positions, setPositions] = useState<
    Record<string, Position>
  >(() =>
    Object.fromEntries(
      employees.map((employee) => [
        employee.id,
        employeeRoutes.find(
          (route) => route.employeeId === employee.id,
        )?.waypoints[0]?.position ?? employee.position,
      ]),
    ) as Record<string, Position>,
  )

  // Stage 8: Safety monitoring
  const [events, setEvents] = useState<SafetyEvent[]>([])

  const [acknowledgedIds, setAcknowledgedIds] = useState<
    number[]
  >([])

  const [zoneOccupancy, setZoneOccupancy] = useState<
    Record<string, string[]>
  >({})

  const insideState = useRef<Record<string, boolean>>({})
  const nextEventId = useRef(0)

  // Stage 9: Simulated sensor reporting
  const [lastReports, setLastReports] = useState<
    Record<string, number>
  >({})

  const [currentTime, setCurrentTime] = useState(
    () => Date.now(),
  )

  const reportThrottle = useRef<Record<string, number>>({})

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  // Selected employee
  const selectedEmployee =
    employees.find(
      (employee) => employee.id === selectedId,
    ) ?? null

  const selectedRoute =
    employeeRoutes.find(
      (route) => route.employeeId === selectedId,
    ) ?? null

  const selectedPosition = selectedId
    ? positions[selectedId] ??
      selectedEmployee?.position ??
      null
    : null

  const selectedHistory = selectedId
    ? history[selectedId] ?? []
    : []

  // Safety alert metrics
  const activeAlerts = events.filter(
    (event) =>
      event.type === 'ENTRY' &&
      !acknowledgedIds.includes(event.id),
  )

  const occupiedZoneIds = restrictedZones
    .filter(
      (zone) =>
        (zoneOccupancy[zone.id] ?? []).length > 0,
    )
    .map((zone) => zone.id)

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id || null)

    if (!id) {
      setFollowEnabled(false)
    }
  }, [])

  // Employee position updates
  const handlePositionChange = useCallback(
    (id: string, position: Position) => {
      const now = Date.now()

      // Stage 9: Record simulated sensor reports
      if (
        now - (reportThrottle.current[id] ?? 0) >= 1000
      ) {
        reportThrottle.current[id] = now

        setLastReports((previous) => ({
          ...previous,
          [id]: now,
        }))
      }

      // Update live position
      setPositions((previous) => {
        const old = previous[id]

        if (
          old &&
          Math.hypot(
            old[0] - position[0],
            old[2] - position[2],
          ) < 0.01
        ) {
          return previous
        }

        return {
          ...previous,
          [id]: position,
        }
      })

      // Stage 7: Store movement history
      setHistory((previous) => {
        const records = previous[id] ?? []
        const last = records[records.length - 1]

        if (
          last &&
          Math.hypot(
            last.position[0] - position[0],
            last.position[2] - position[2],
          ) < 0.15
        ) {
          return previous
        }

        const point: HistoryPoint = {
          position: [...position] as Position,
          timestamp: now,
        }

        return {
          ...previous,
          [id]: [...records, point].slice(-300),
        }
      })

      // Stage 8: Restricted-zone detection
      for (const zone of restrictedZones) {
        const key = `${id}:${zone.id}`

        const isInside = isInsideZone(position, zone)

        const wasInside =
          insideState.current[key] ?? false

        if (isInside === wasInside) {
          continue
        }

        insideState.current[key] = isInside

        // Update zone occupancy
        setZoneOccupancy((previous) => {
          const current = previous[zone.id] ?? []

          const updated = isInside
            ? [...new Set([...current, id])]
            : current.filter(
                (employeeId) => employeeId !== id,
              )

          return {
            ...previous,
            [zone.id]: updated,
          }
        })

        // Generate safety event
        nextEventId.current += 1

        const event: SafetyEvent = {
          id: nextEventId.current,
          employeeId: id,
          zoneId: zone.id,
          zoneName: zone.name,
          type: isInside ? 'ENTRY' : 'EXIT',
          timestamp: now,
        }

        setEvents((previous) =>
          [event, ...previous].slice(0, 200),
        )
      }
    },
    [],
  )

  const clearSelectedHistory = () => {
    if (!selectedId) return

    setHistory((previous) => ({
      ...previous,
      [selectedId]: [],
    }))
  }

  const acknowledgeAll = () => {
    setAcknowledgedIds((previous) => [
      ...new Set([
        ...previous,
        ...activeAlerts.map((event) => event.id),
      ]),
    ])
  }

  const clearEventLog = () => {
    setEvents([])
    setAcknowledgedIds([])
  }

  const matchingEmployees = employees.filter((employee) => {
    const query = search.trim().toLowerCase()

    return (
      employee.id.toLowerCase().includes(query) ||
      employee.name.toLowerCase().includes(query)
    )
  })

  const selectEmployee = (id: string) => {
    setSelectedId(id)
    setSearch('')
  }

  const formatTime = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-slate-800 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold">
            3D
          </div>

          <span className="font-semibold">
            3D Dashboard
          </span>
        </div>

        <nav className="flex gap-5 text-sm text-slate-400">
          <a href="#dashboard" className="text-white">
            Dashboard
          </a>

          <a href="#workspace" className="hover:text-white">
            Workspace
          </a>
        </nav>
      </header>

      <main id="dashboard" className="p-4 lg:p-5">
        <div className="mb-4">
          <h1 className="text-xl font-bold">
            Industrial Factory Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            3D employee tracking and industrial safety
            monitoring.
          </p>
        </div>

        {/* Top-level summary */}
        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className={panelClass}>
            <p className="text-xs text-slate-400">
              Employees
            </p>

            <p className="mt-1 text-2xl font-bold">
              {employees.length}
            </p>
          </div>

          <div className={panelClass}>
            <p className="text-xs text-slate-400">
              Simulation
            </p>

            <p className="mt-1 font-bold text-blue-400">
              {isPlaying ? 'Running' : 'Paused'}
            </p>
          </div>

          <div className={panelClass}>
            <p className="text-xs text-slate-400">
              Active Alerts
            </p>

            <p
              className={`mt-1 text-2xl font-bold ${
                activeAlerts.length
                  ? 'text-red-400'
                  : 'text-green-400'
              }`}
            >
              {activeAlerts.length}
            </p>
          </div>

          <div className={panelClass}>
            <p className="text-xs text-slate-400">
              Restricted Zones Occupied
            </p>

            <p
              className={`mt-1 text-2xl font-bold ${
                occupiedZoneIds.length
                  ? 'text-red-400'
                  : 'text-green-400'
              }`}
            >
              {occupiedZoneIds.length}
            </p>
          </div>
        </div>

        {/* Main dashboard layout */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">

          {/* Left: 3D Factory */}
          <section
            id="workspace"
            className="relative h-[55vh] min-h-[360px] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 lg:sticky lg:top-4 lg:h-[calc(100vh-180px)]"
          >
            <Scene
              isPlaying={isPlaying}
              speedMultiplier={speedMultiplier}
              selectedId={selectedId}
              positions={positions}
              onSelect={handleSelect}
              onPositionChange={handlePositionChange}
              followTarget={selectedPosition}
              followEnabled={followEnabled}
              selectedHistory={selectedHistory}
              showTrail={showTrail}
              occupiedZoneIds={occupiedZoneIds}
            />

            <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-slate-950/80 px-3 py-2 text-xs text-slate-300">
              Drag to rotate · Scroll to zoom

              <span className="ml-2 text-red-400">
                ■ Restricted zone
              </span>
            </div>
          </section>

          {/* Right: Dashboard panels */}
          <div className="min-w-0 space-y-4">

            {/* Simulation Controls */}
            <section className={panelClass}>
              <h2 className="font-semibold">
                Simulation Controls
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setIsPlaying((playing) => !playing)
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
                >
                  {isPlaying ? 'Pause' : 'Resume'}
                </button>

                <label
                  htmlFor="speed"
                  className="text-sm text-slate-300"
                >
                  Speed
                </label>

                <select
                  id="speed"
                  value={speedMultiplier}
                  onChange={(event) =>
                    setSpeedMultiplier(
                      Number(event.target.value),
                    )
                  }
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                >
                  <option value={0.5}>0.5×</option>
                  <option value={1}>1× Normal</option>
                  <option value={1.5}>1.5×</option>
                  <option value={2}>2×</option>
                  <option value={3}>3×</option>
                </select>
              </div>
            </section>

            {/* Employee Search */}
            <section className={panelClass}>
              <label
                htmlFor="employee-search"
                className="mb-2 block text-sm font-semibold"
              >
                Search Employees
              </label>

              <input
                id="employee-search"
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Enter employee ID or name..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />

              {search.trim() && (
                <div className="mt-2 space-y-1">
                  {matchingEmployees.length > 0 ? (
                    matchingEmployees.map((employee) => (
                      <button
                        key={employee.id}
                        type="button"
                        onClick={() =>
                          selectEmployee(employee.id)
                        }
                        className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-800"
                      >
                        <span className="font-semibold">
                          {employee.id}
                        </span>

                        <span className="ml-2 text-slate-400">
                          {employee.name}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">
                      No matching employees.
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* Employee Information */}
            {selectedEmployee && (
              <section
                className={`${panelClass} border-yellow-500/40`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-yellow-400">
                      Selected Employee
                    </p>

                    <h2 className="mt-1 font-bold">
                      {selectedEmployee.name}
                    </h2>

                    <p className="text-sm text-slate-400">
                      {selectedEmployee.id} ·{' '}
                      {selectedEmployee.role}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setFollowEnabled(
                        (previous) => !previous,
                      )
                    }
                    className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                      followEnabled
                        ? 'bg-yellow-500 text-slate-950'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    {followEnabled
                      ? 'Stop Following'
                      : 'Follow'}
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-slate-950 p-3">
                    <p className="text-xs text-slate-500">
                      Status
                    </p>

                    <p className="mt-1 font-semibold">
                      {selectedRoute
                        ? isPlaying
                          ? 'MOVING'
                          : 'PAUSED'
                        : selectedEmployee.status.toUpperCase()}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-950 p-3">
                    <p className="text-xs text-slate-500">
                      Speed
                    </p>

                    <p className="mt-1 font-semibold">
                      {selectedRoute
                        ? `${(
                            selectedRoute.speed *
                            speedMultiplier
                          ).toFixed(2)} units/s`
                        : 'Stationary'}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-950 p-3">
                    <p className="text-xs text-slate-500">
                      X Position
                    </p>

                    <p className="mt-1 font-semibold">
                      {(selectedPosition?.[0] ?? 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-950 p-3">
                    <p className="text-xs text-slate-500">
                      Z Position
                    </p>

                    <p className="mt-1 font-semibold">
                      {(selectedPosition?.[2] ?? 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(null)
                    setFollowEnabled(false)
                  }}
                  className="mt-3 text-xs text-slate-400 hover:text-white"
                >
                  Clear Selection
                </button>
              </section>
            )}

            {/* Stage 9: Management Dashboard */}
            <ManagementDashboard
              positions={positions}
              isPlaying={isPlaying}
              activeAlertCount={activeAlerts.length}
              occupiedRestrictedZoneCount={
                occupiedZoneIds.length
              }
              lastReports={lastReports}
              currentTime={currentTime}
            />

            {/* Stage 7: Movement History */}
            <section className={panelClass}>
              <h2 className="font-semibold">
                Movement History
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {selectedEmployee
                  ? `${selectedEmployee.id} · ${selectedHistory.length} positions`
                  : 'Select an employee to inspect their movement.'}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowTrail((value) => !value)
                  }
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold hover:bg-blue-500"
                >
                  {showTrail ? 'Hide Trail' : 'Show Trail'}
                </button>

                <button
                  type="button"
                  disabled={
                    !selectedEmployee ||
                    selectedHistory.length === 0
                  }
                  onClick={clearSelectedHistory}
                  className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold disabled:opacity-40"
                >
                  Clear History
                </button>
              </div>

              {selectedEmployee && (
                <div className="mt-3 max-h-40 overflow-auto rounded-lg border border-slate-700">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-slate-800">
                      <tr>
                        <th className="p-2">Time</th>
                        <th className="p-2">X</th>
                        <th className="p-2">Y</th>
                        <th className="p-2">Z</th>
                      </tr>
                    </thead>

                    <tbody>
                      {[...selectedHistory]
                        .reverse()
                        .slice(0, 30)
                        .map((point, index) => (
                          <tr
                            key={`${point.timestamp}-${index}`}
                            className="border-t border-slate-800"
                          >
                            <td className="p-2">
                              {formatTime(point.timestamp)}
                            </td>

                            {point.position.map(
                              (coordinate, axis) => (
                                <td
                                  key={axis}
                                  className="p-2"
                                >
                                  {coordinate.toFixed(2)}
                                </td>
                              ),
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  {selectedHistory.length === 0 && (
                    <p className="p-3 text-xs text-slate-400">
                      No movement history yet.
                    </p>
                  )}
                </div>
              )}

              <p className="mt-2 text-xs text-slate-500">
                Maximum 300 samples per employee.
              </p>
            </section>

            {/* Stage 8: Safety Monitoring */}
            <section
              className={`${panelClass} ${
                activeAlerts.length > 0
                  ? 'border-red-500/60'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold">
                  Safety Monitoring
                </h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    activeAlerts.length > 0
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {activeAlerts.length > 0
                    ? `${activeAlerts.length} Alerts`
                    : 'No New Alerts'}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Restricted area entry detection is active.
              </p>

              {restrictedZones.map((zone) => {
                const occupants =
                  zoneOccupancy[zone.id] ?? []

                return (
                  <div
                    key={zone.id}
                    className="mt-3 rounded-lg bg-slate-950 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">
                        {zone.name}
                      </p>

                      <span
                        className={`text-xs font-bold ${
                          occupants.length
                            ? 'text-red-400'
                            : 'text-green-400'
                        }`}
                      >
                        {occupants.length
                          ? 'OCCUPIED'
                          : 'CLEAR'}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      {zone.id} ·{' '}
                      {occupants.length
                        ? occupants.join(', ')
                        : 'No employees inside'}
                    </p>
                  </div>
                )
              })}

              {activeAlerts.length > 0 && (
                <>
                  <div className="mt-3 space-y-2">
                    {activeAlerts.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="rounded-lg border border-red-500/30 bg-red-950/30 p-3"
                      >
                        <p className="text-sm font-semibold text-red-300">
                          Restricted Zone Entry
                        </p>

                        <p className="mt-1 text-xs text-slate-300">
                          {event.employeeId} entered{' '}
                          {event.zoneName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatTime(event.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={acknowledgeAll}
                    className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold hover:bg-red-500"
                  >
                    Acknowledge Alerts
                  </button>
                </>
              )}
            </section>
          </div>
        </div>

        {/* Stage 8: Safety Event Log */}
        <section className={`mt-4 ${panelClass}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">
                Safety Event Log
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Employee zone entry and exit records
              </p>
            </div>

            <button
              type="button"
              onClick={clearEventLog}
              disabled={events.length === 0}
              className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold hover:bg-slate-600 disabled:opacity-40"
            >
              Clear Event Log
            </button>
          </div>

          <div className="mt-4 max-h-72 overflow-auto rounded-lg border border-slate-700">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="sticky top-0 bg-slate-800 text-slate-300">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Zone</th>
                  <th className="p-3">Event</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="border-t border-slate-800"
                  >
                    <td className="p-3">
                      {formatTime(event.timestamp)}
                    </td>

                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() =>
                          selectEmployee(event.employeeId)
                        }
                        className="text-blue-400 hover:underline"
                      >
                        {event.employeeId}
                      </button>
                    </td>

                    <td className="p-3">
                      {event.zoneName}
                    </td>

                    <td className="p-3">
                      <span
                        className={
                          event.type === 'ENTRY'
                            ? 'font-semibold text-red-400'
                            : 'font-semibold text-green-400'
                        }
                      >
                        {event.type === 'ENTRY'
                          ? 'RESTRICTED ENTRY'
                          : 'ZONE EXIT'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {events.length === 0 && (
              <p className="p-4 text-center text-sm text-slate-400">
                No safety events recorded yet.
              </p>
            )}
          </div>
        </section>

        <footer className="mt-4 text-xs text-slate-500">
          {employees.length} employees ·{' '}
          {employeeRoutes.length} routes ·{' '}
          {restrictedZones.length} restricted zones ·
          Local simulation only
        </footer>
      </main>
    </div>
  )
}

export default App
