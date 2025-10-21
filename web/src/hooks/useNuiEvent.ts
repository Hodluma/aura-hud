import { useEffect } from 'react'

type NuiMessageData<T> = {
  action: string
  data?: T
}

type NuiHandler<T> = (data: T) => void

export const useNuiEvent = <T>(action: string, handler: NuiHandler<T>) => {
  useEffect(() => {
    const listener = (event: MessageEvent<NuiMessageData<T>>) => {
      if (!event.data || event.data.action !== action) return
      handler(event.data.data as T)
    }

    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [action, handler])
}
