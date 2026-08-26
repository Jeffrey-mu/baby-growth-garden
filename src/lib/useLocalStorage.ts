import { useCallback, useEffect, useState } from 'react'
import type { AppData } from './types'
import { loadData, saveData } from './storage'

/** 用 localStorage 持久化整份站点数据 */
export function useAppData() {
  const [data, setData] = useState<AppData>(() => loadData())

  useEffect(() => {
    saveData(data)
  }, [data])

  const patch = useCallback((updater: (prev: AppData) => AppData) => {
    setData((prev) => updater(prev))
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem('baby-garden-data-v1')
    setData(loadData())
  }, [])

  return { data, patch, reset }
}
