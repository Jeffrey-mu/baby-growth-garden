export type Accent = 'peach' | 'sage' | 'moon'

export interface BabySettings {
  /** 宝宝小名 */
  nickname: string
  /** 末次月经（LMP）YYYY-MM-DD —— 孕周按它推算 */
  lastPeriodDate: string | null
  /** 预产期 YYYY-MM-DD（可手动覆盖；不填时按末次月经 + 280 天推算） */
  dueDate: string | null
  /** 出生日期 YYYY-MM-DD */
  birthDate: string | null
  /** 开始记录的日子 YYYY-MM-DD（备孕/得知怀孕那天） */
  startDate: string | null
  /** 主题色 */
  accent: Accent
  /** 对宝宝的称呼，例如「小宝贝」「团子」 */
  petName: string
}

export interface MemoryEntry {
  id: string
  date: string
  title: string
  note: string
  /** dataURL 图片 */
  photo: string | null
  tag: string
}

export interface CapsuleLetter {
  id: string
  /** 写给谁（如「三岁的你」） */
  to: string
  /** 目标解锁年龄（岁） */
  toAge: number | null
  /** 自定义解锁日期 YYYY-MM-DD */
  unlockDate: string | null
  content: string
  createdAt: string
  opened: boolean
}

export interface AppData {
  settings: BabySettings
  memories: MemoryEntry[]
  letters: CapsuleLetter[]
  /** `stageId::index` -> true */
  milestones: Record<string, boolean>
}

export const EMPTY_SETTINGS: BabySettings = {
  nickname: '宝宝',
  lastPeriodDate: null,
  dueDate: null,
  birthDate: null,
  startDate: null,
  accent: 'peach',
  petName: '小宝贝',
}
