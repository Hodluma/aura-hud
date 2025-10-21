import { HudEnvironment } from '../hooks/useHudState'

interface Props {
  environment: HudEnvironment
}

const Compass = ({ environment }: Props) => {
  const { compass } = environment
  return (
    <div className="hud-panel px-4 py-2 flex items-baseline gap-2 text-sm">
      <span className="text-lg font-semibold">{compass.direction}</span>
      <span className="text-xs text-slate-300">{compass.degrees.toFixed(0)}°</span>
    </div>
  )
}

export default Compass
