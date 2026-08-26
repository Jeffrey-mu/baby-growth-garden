import type { AppData, BabySettings, CapsuleLetter } from './types'
import { EMPTY_SETTINGS } from './types'
import { todayISO, uid } from './dates'

const KEY = 'baby-garden-data-v1'

function defaultData(): AppData {
  const settings: BabySettings = {
    ...EMPTY_SETTINGS,
    // 宝宝的真实信息：末次月经 2026-04-10
    // 孕周按末次月经推算；预产期自动 = 末次月经 + 280 天（约 2027-01-15）
    lastPeriodDate: '2026-04-10',
    dueDate: null,
    birthDate: null,
    startDate: '2026-04-10',
  }

  const seeds: CapsuleLetter[] = [
    {
      id: 'seed-3',
      to: '三岁的你',
      toAge: 3,
      unlockDate: null,
      content:
        '亲爱的宝贝：\n当你打开这封信的时候，大概已经会跑、会笑、会问很多个“为什么”了。\n我们把这封信锁了很久，想说的话其实只有一句——\n无论你长到多大，永远是我们最想抱抱的小朋友。\n\n—— 爱你的爸爸妈妈',
      createdAt: todayISO(),
      opened: false,
    },
    {
      id: 'seed-12',
      to: '十二岁的你',
      toAge: 12,
      unlockDate: null,
      content:
        '嘿，少年：\n十二岁的你，一定有了自己的朋友、喜欢的歌，和不想告诉大人的小秘密。\n没关系，秘密是长大的标志。我们只想让你知道：\n无论世界怎么变化，回家永远不用敲门。\n\n—— 永远在家的爸爸妈妈',
      createdAt: todayISO(),
      opened: false,
    },
    {
      id: 'seed-18',
      to: '十八岁的你',
      toAge: 18,
      unlockDate: null,
      content:
        '亲爱的、已经长大的你：\n十八年前，你只有一颗小豆子那么大，却让两个大人红了眼眶。\n如今你要去更远的地方了。去吧，大胆地去。\n我们只叮嘱一句：好好吃饭，早点睡觉，常回来看看。\n你永远是我们的骄傲。\n\n—— 爱了你十八年，还会继续爱下去的爸爸妈妈',
      createdAt: todayISO(),
      opened: false,
    },
  ]

  return {
    settings,
    memories: [],
    letters: seeds,
    milestones: {},
  }
}

function isValid(d: unknown): d is AppData {
  if (!d || typeof d !== 'object') return false
  const o = d as Record<string, unknown>
  return typeof o.settings === 'object' && Array.isArray(o.letters) && Array.isArray(o.memories)
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      const d = defaultData()
      saveData(d)
      return d
    }
    const parsed = JSON.parse(raw)
    if (!isValid(parsed)) return defaultData()
    const merged: AppData = {
      settings: { ...EMPTY_SETTINGS, ...parsed.settings },
      memories: parsed.memories,
      letters: parsed.letters,
      milestones: parsed.milestones ?? {},
    }
    return merged
  } catch {
    return defaultData()
  }
}

export function saveData(d: AppData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(d))
  } catch (e) {
    console.warn('保存失败：', e)
  }
}

export function exportJSON(d: AppData): void {
  const blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `宝宝成长记-备份-${todayISO()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function parseImport(text: string): AppData | null {
  try {
    const d = JSON.parse(text)
    if (!isValid(d)) return null
    return {
      settings: { ...EMPTY_SETTINGS, ...d.settings },
      memories: d.memories,
      letters: d.letters,
      milestones: d.milestones ?? {},
    }
  } catch {
    return null
  }
}

export function makeLetter(partial: Partial<CapsuleLetter>): CapsuleLetter {
  return {
    id: uid(),
    to: '未来的你',
    toAge: null,
    unlockDate: null,
    content: '',
    createdAt: todayISO(),
    opened: false,
    ...partial,
  }
}
