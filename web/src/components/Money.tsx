import { formatNumber } from '../lib/format'

interface Props {
  money: { cash?: number; bank?: number }
  phrases: Record<string, string>
}

const Money = ({ money, phrases }: Props) => {
  const cash = money.cash ?? 0
  const bank = money.bank ?? 0

  return (
    <div className="space-y-1">
      <div>
        {phrases.cash ?? 'Cash'}:{' '}
        <span className="font-semibold text-emerald-300">${formatNumber(cash)}</span>
      </div>
      <div>
        {phrases.bank ?? 'Bank'}:{' '}
        <span className="font-semibold text-sky-300">${formatNumber(bank)}</span>
      </div>
    </div>
  )
}

export default Money
