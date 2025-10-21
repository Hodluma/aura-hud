import { HudEnvironment } from '../hooks/useHudState'

interface Props {
  environment: HudEnvironment
}

const Street = ({ environment }: Props) => {
  const { street, zone } = environment
  return (
    <div className="hud-panel px-4 py-2 text-sm min-w-[220px]">
      <div className="font-semibold">{street || 'Unknown street'}</div>
      <div className="text-xs text-slate-300 uppercase tracking-wide">{zone}</div>
    </div>
  )
}

export default Street
