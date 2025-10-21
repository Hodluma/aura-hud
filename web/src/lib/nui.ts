const resourceName = (window as any).GetParentResourceName ? (window as any).GetParentResourceName() : 'aura-hud'

export const fetchNui = async <T>(event: string, data?: unknown): Promise<T | undefined> => {
  if (!(window as any).invokeNative) {
    return undefined
  }

  const resp = await fetch(`https://${resourceName}/${event}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(data ?? {})
  })

  if (!resp.ok) return undefined
  try {
    return (await resp.json()) as T
  } catch (e) {
    return undefined
  }
}
