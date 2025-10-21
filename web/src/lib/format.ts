export const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max)

export const formatPercent = (value: number) => `${clamp(value)}%`

export const formatNumber = (value: number, decimals = 0) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })

export const formatVoiceMode = (mode: string) => {
  switch (mode) {
    case 'whisper':
      return 'W'
    case 'shout':
      return 'S'
    case 'normal':
      return 'N'
    default:
      return '?'
  }
}
