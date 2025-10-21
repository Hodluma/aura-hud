import clsx from 'clsx'
import { HudSettings, HudVehicle } from '../hooks/useHudState'
import { clamp, formatNumber } from '../lib/format'

interface Props {
  vehicle: HudVehicle
  settings: HudSettings
}

const Speedo = ({ vehicle, settings }: Props) => {
  const unit = settings.speedUnit === 'mph' ? 'MPH' : 'KMH'
  const speed = settings.speedUnit === 'mph' ? vehicle.speed.mph : vehicle.speed.kmh
  const rpmPercent = clamp(vehicle.rpm * 100, 0, 100)

  return (
    <div className="hud-panel px-6 py-4 w-[320px] space-y-3">
      <div className="flex justify-between items-end">
        <div className="flex items-end gap-2">
          <span className="text-5xl font-display leading-none">{formatNumber(speed)}</span>
          <span className="text-xs uppercase text-slate-300 mb-1">{unit}</span>
        </div>
        <div className="text-right text-xs space-y-1">
          <div className={clsx('px-2 py-1 rounded-full border', vehicle.seatbelt ? 'border-emerald-400 text-emerald-300' : 'border-rose-500 text-rose-400')}>
            {vehicle.seatbelt ? 'Seatbelt' : 'Seatbelt Off'}
          </div>
          <div className={clsx('px-2 py-1 rounded-full border', vehicle.engineOn ? 'border-sky-400 text-sky-300' : 'border-slate-500 text-slate-300')}>
            {vehicle.engineOn ? 'Engine' : 'Engine Off'}
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs uppercase tracking-wide text-slate-300">
          <span>RPM</span>
          <span>{Math.round(rpmPercent)}%</span>
        </div>
        <div className="bar">
          <div className="bar-fill" style={{ width: `${rpmPercent}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="hud-panel px-3 py-2 bg-white/5">
          Fuel: <span className="font-semibold">{clamp(vehicle.fuel, 0, 100)}%</span>
        </div>
        <div className="hud-panel px-3 py-2 bg-white/5">
          Gear: <span className="font-semibold">{vehicle.gear}</span>
        </div>
        <div className="hud-panel px-3 py-2 bg-white/5">
          Cruise: <span className="font-semibold">{vehicle.cruise ? 'On' : 'Off'}</span>
        </div>
        <div className="hud-panel px-3 py-2 bg-white/5">
          Signals:{' '}
          <span className={clsx('font-semibold', vehicle.indicators.left && 'text-amber-300')}>
            L
          </span>
          /
          <span className={clsx('font-semibold', vehicle.indicators.right && 'text-amber-300')}>
            R
          </span>
        </div>
      </div>
    </div>
  )
}

export default Speedo
