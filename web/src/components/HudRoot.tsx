import clsx from 'clsx'
import Bars from './Bars'
import Money from './Money'
import Voice from './Voice'
import Compass from './Compass'
import Street from './Street'
import Speedo from './Speedo'
import { HudState } from '../hooks/useHudState'

interface Props {
  state: HudState
  phrases: Record<string, string>
  hidden: boolean
  onOpenSettings: () => void
}

const HudRoot = ({ state, phrases, hidden, onOpenSettings }: Props) => {
  const { settings, player, vehicle, environment } = state
  const layoutClass = settings.layout === 'compact' ? 'gap-4' : 'gap-6'
  const vitalModules = ['health', 'armor', 'hunger', 'thirst', 'stress', 'stamina', 'oxygen'] as const
  const showVitals = vitalModules.some((module) => settings.modules[module])

  return (
    <div
      className={clsx(
        'absolute inset-0 flex flex-col justify-between transition-opacity duration-200',
        hidden && 'opacity-0 pointer-events-none'
      )}
    >
      <div className={clsx('flex justify-between px-8 pt-8', layoutClass)}>
        {showVitals && (
          <div className={clsx('hud-panel px-5 py-4 w-64 shadow-lg', settings.layout === 'compact' && 'w-56')}>
            <Bars settings={settings} player={player} phrases={phrases} />
          </div>
        )}

        <div className="flex flex-col items-end gap-3 pointer-events-auto">
          <button
            onClick={onOpenSettings}
            className="hud-panel px-4 py-2 text-xs uppercase tracking-widest font-semibold text-slate-200 hover:text-white hover:border-white/20 transition"
          >
            {phrases.settings ?? 'Settings'}
          </button>
          <div className="hud-panel px-4 py-3 text-right text-sm min-w-[220px] space-y-1">
            {settings.modules.id && (
              <div>{phrases.id ?? 'ID'}: <span className="font-semibold">{player.id}</span></div>
            )}
            {settings.modules.job && player.job && (
              <div>
                {phrases.job ?? 'Job'}: <span className="font-semibold">{player.job.label ?? player.job.name ?? '—'}</span>{' '}
                {player.job.grade && typeof player.job.grade === 'object' && player.job.grade?.name
                  ? `(${player.job.grade.name})`
                  : typeof player.job.grade === 'number'
                  ? `(${player.job.grade})`
                  : ''}
              </div>
            )}
            {settings.modules.gang && player.gang && player.gang.label && (
              <div>
                {phrases.gang ?? 'Gang'}: <span className="font-semibold">{player.gang.label}</span>
              </div>
            )}
            {settings.modules.money && settings.moneyVisible && (
              <Money phrases={phrases} money={player.money} />
            )}
          </div>
        </div>
      </div>

      <div className={clsx('flex justify-between items-end px-8 pb-10', layoutClass)}>
        <div className="flex flex-col gap-3">
          {settings.modules.voice && <Voice phrases={phrases} environment={environment} settings={settings} />}
          {settings.modules.street && <Street environment={environment} />}
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3">
            {settings.modules.time && (
              <div className="hud-panel px-4 py-2 text-sm font-semibold tracking-wide">
                {environment.time}
              </div>
            )}
            {settings.modules.compass && <Compass environment={environment} />}
          </div>
          {settings.modules.vehicle && vehicle.inVehicle && <Speedo vehicle={vehicle} settings={settings} />}
        </div>
      </div>

      {vehicle.inVehicle && settings.modules.mapStrip && <div className="hud-map-strip" />}
    </div>
  )
}

export default HudRoot
