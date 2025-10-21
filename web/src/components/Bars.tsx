import { HudPlayer, HudSettings } from '../hooks/useHudState'
import { clamp, formatPercent } from '../lib/format'

interface Props {
  settings: HudSettings
  player: HudPlayer
  phrases: Record<string, string>
}

const Bars = ({ settings, player, phrases }: Props) => {
  const items: Array<{ key: keyof HudPlayer; label: string; value: number }> = []
  const modules = settings.modules

  if (modules.health) items.push({ key: 'health', label: phrases.health ?? 'Health', value: player.health })
  if (modules.armor) items.push({ key: 'armor', label: phrases.armor ?? 'Armor', value: player.armor })
  if (modules.hunger) items.push({ key: 'hunger', label: phrases.hunger ?? 'Hunger', value: player.hunger })
  if (modules.thirst) items.push({ key: 'thirst', label: phrases.thirst ?? 'Thirst', value: player.thirst })
  if (modules.stress) items.push({ key: 'stress', label: phrases.stress ?? 'Stress', value: player.stress })
  if (modules.stamina) items.push({ key: 'stamina', label: phrases.stamina ?? 'Stamina', value: player.stamina })
  if (modules.oxygen && player.underwater) items.push({ key: 'oxygen', label: phrases.oxygen ?? 'Oxygen', value: player.oxygen })

  return (
    <div className="bar-container">
      {items.map((item) => (
        <div key={item.key as string}>
          <div className="flex justify-between text-xs uppercase tracking-wide text-slate-300">
            <span>{item.label}</span>
            <span>{formatPercent(item.value)}</span>
          </div>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${clamp(item.value)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Bars
