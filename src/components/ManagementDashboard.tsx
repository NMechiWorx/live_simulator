
import { employees } from '../data/employees'
import { employeeRoutes } from '../data/routes'
import {
  getEmployeeDepartment,
  getEmployeeZone,
  monitoringZones,
} from '../data/monitoring'
import type { Position } from '../data/safetyZones'

type Props = {
  positions: Record<string, Position>
  isPlaying: boolean
  activeAlertCount: number
  occupiedRestrictedZoneCount: number
  lastReports: Record<string, number>
  currentTime: number
}

type BreakdownRow = {
  label: string
  count: number
}

function Breakdown({
  title,
  rows,
  total,
}: {
  title: string
  rows: BreakdownRow[]
  total: number
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
      <h3 className="text-sm font-semibold">{title}</h3>

      <div className="mt-3 space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex justify-between gap-2 text-xs">
              <span className="text-slate-300">{row.label}</span>
              <span className="font-semibold">{row.count}</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300"
                style={{
                  width: `${total ? (row.count / total) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ManagementDashboard({
  positions,
  isPlaying,
  activeAlertCount,
  occupiedRestrictedZoneCount,
  lastReports,
  currentTime,
}: Props) {
  const total = employees.length

  const moving = isPlaying
    ? employees.filter((employee) =>
        employeeRoutes.some(
          (route) =>
            route.employeeId === employee.id &&
            route.waypoints.length > 1,
        ),
      ).length
    : 0

  const stationary = total - moving

  const zoneNames = [
    ...monitoringZones.map((zone) => zone.name),
    'Transit / Other',
  ]

  const zoneRows = zoneNames.map((label) => ({
    label,
    count: employees.filter(
      (employee) =>
        getEmployeeZone(
          positions[employee.id] ?? employee.position,
        ) === label,
    ).length,
  }))

  const departments = [
    ...new Set(employees.map(getEmployeeDepartment)),
  ]

  const departmentRows = departments.map((label) => ({
    label,
    count: employees.filter(
      (employee) =>
        getEmployeeDepartment(employee) === label,
    ).length,
  }))

  const reporting = employees.filter((employee) => {
    const timestamp = lastReports[employee.id]

    return (
      timestamp !== undefined &&
      currentTime - timestamp <= 5000
    )
  }).length

  const stale = employees.filter((employee) => {
    const timestamp = lastReports[employee.id]

    return (
      timestamp !== undefined &&
      currentTime - timestamp > 5000
    )
  }).length

  const pending = total - reporting - stale

  const cards = [
    {
      label: 'Total Employees',
      value: total,
      color: 'text-white',
    },
    {
      label: 'Moving',
      value: moving,
      color: 'text-blue-400',
    },
    {
      label: 'Stationary / Paused',
      value: stationary,
      color: 'text-amber-400',
    },
    {
      label: 'Active Alerts',
      value: activeAlertCount,
      color: activeAlertCount
        ? 'text-red-400'
        : 'text-green-400',
    },
  ]

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="font-semibold">Management Dashboard</h2>

      <p className="mt-1 text-xs text-slate-400">
        Live workforce statistics from the simulation
      </p>

      {/* Module 9.1, 9.2, 9.5 */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg bg-slate-950 p-3"
          >
            <p className="text-xs text-slate-400">
              {card.label}
            </p>

            <p
              className={`mt-1 text-2xl font-bold ${card.color}`}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Module 9.7 - Workforce chart */}
      <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950 p-3">
        <h3 className="text-sm font-semibold">
          Workforce Activity
        </h3>

        <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="bg-blue-500 transition-all"
            style={{
              width: `${total ? (moving / total) * 100 : 0}%`,
            }}
          />

          <div
            className="bg-amber-500 transition-all"
            style={{
              width: `${total ? (stationary / total) * 100 : 0}%`,
            }}
          />
        </div>

        <p className="mt-2 text-xs text-slate-400">
          Moving: {moving} · Stationary/paused: {stationary}
        </p>
      </div>

      {/* Modules 9.3 and 9.4 */}
      <div className="mt-3 space-y-3">
        <Breakdown
          title="Employees by Zone"
          rows={zoneRows}
          total={total}
        />

        <Breakdown
          title="Employees by Department"
          rows={departmentRows}
          total={total}
        />
      </div>

      {/* Module 9.6 */}
      <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950 p-3">
        <h3 className="text-sm font-semibold">
          Simulated Sensor Health
        </h3>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xl font-bold text-green-400">
              {reporting}
            </p>
            <p className="text-xs text-slate-400">
              Reporting
            </p>
          </div>

          <div>
            <p className="text-xl font-bold text-amber-400">
              {stale}
            </p>
            <p className="text-xs text-slate-400">
              Stale
            </p>
          </div>

          <div>
            <p className="text-xl font-bold text-slate-300">
              {pending}
            </p>
            <p className="text-xs text-slate-400">
              Pending
            </p>
          </div>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Demo only. Position reports become stale after 5
          seconds without updates. Pausing the simulation
          may result in stale reports.
        </p>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Restricted zones occupied:{' '}
        <strong
          className={
            occupiedRestrictedZoneCount
              ? 'text-red-400'
              : 'text-green-400'
          }
        >
          {occupiedRestrictedZoneCount}
        </strong>
      </p>
    </section>
  )
}
