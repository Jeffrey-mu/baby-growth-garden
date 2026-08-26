import type { BabySettings } from './types'

/** 今天的本地日期，YYYY-MM-DD */
export function todayISO(): string {
  const d = new Date()
  return toISO(d)
}

export function toISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** 解析本地日期字符串为本地零点 Date */
export function parseISO(s: string | null | undefined): Date | null {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

export function addDays(d: Date, days: number): Date {
  const n = new Date(d)
  n.setDate(n.getDate() + days)
  return n
}

/** 两个本地日期相差的整天数（b - a） */
export function daysBetween(a: Date, b: Date): number {
  const ms = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) -
             Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  return Math.round(ms / 86400000)
}

export interface AgeParts {
  years: number
  months: number
  days: number
}

/** 从出生日到今天，拆成年/月/日（大致准确） */
export function ageParts(birth: Date, now: Date = new Date()): AgeParts {
  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  let days = now.getDate() - birth.getDate()
  if (days < 0) {
    months -= 1
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate()
    days += prevMonth
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  return { years, months, days }
}

/** 孕期第几周（满周数），预产期往前推 280 天作为起点 */
export function pregnancyWeeks(due: Date, now: Date = new Date()): number {
  const start = addDays(due, -280)
  const days = daysBetween(start, now)
  return Math.max(0, Math.floor(days / 7))
}

export function pregnancyDays(due: Date, now: Date = new Date()): number {
  const start = addDays(due, -280)
  return Math.max(0, daysBetween(start, now))
}

/** 有效预产期：手动填了就用手动的，否则按末次月经 + 280 天推算 */
export function effectiveDueDate(settings: BabySettings): string | null {
  if (settings.dueDate) return settings.dueDate
  const lmp = parseISO(settings.lastPeriodDate)
  if (!lmp) return null
  return toISO(addDays(lmp, 280))
}

export function formatDateCN(s: string | null | undefined): string {
  if (!s) return '—'
  const [y, m, d] = s.split('-')
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`
}

export function formatAge(p: AgeParts): string {
  if (p.years >= 18) return `${p.years} 岁`
  if (p.years >= 1) {
    return p.months > 0 ? `${p.years} 岁 ${p.months} 个月` : `${p.years} 岁`
  }
  if (p.months >= 1) {
    return p.days > 0 ? `${p.months} 个月 ${p.days} 天` : `${p.months} 个月`
  }
  return p.days > 0 ? `${p.days} 天` : '今天'
}

export interface CurrentInfo {
  /** 是否已出生 */
  born: boolean
  /** 孕期周数（未出生时有效） */
  week: number
  /** 孕期天数 */
  pregnancyDay: number
  /** 年龄 */
  age: AgeParts
  /** 与宝宝相遇的总天数（从起点算起） */
  togetherDays: number
  /** 当前阶段在 STAGES 中的下标 */
  stageIndex: number
}

export function currentInfo(settings: BabySettings, now: Date = new Date()): CurrentInfo {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const birth = parseISO(settings.birthDate)
  const start = parseISO(settings.startDate)

  const due = parseISO(settings.dueDate) ?? (parseISO(settings.lastPeriodDate) ? addDays(parseISO(settings.lastPeriodDate)!, 280) : null)

  if (birth && today.getTime() >= birth.getTime()) {
    const age = ageParts(birth, today)
    const totalMonths = age.years * 12 + age.months
    let stageIndex: number
    if (totalMonths === 0 && age.days === 0) stageIndex = 4 // 出生
    else if (totalMonths < 1) stageIndex = 5 // 新生儿
    else if (totalMonths < 12) stageIndex = 6 // 婴儿
    else if (totalMonths < 36) stageIndex = 7 // 幼儿
    else if (totalMonths < 72) stageIndex = 8 // 学龄前
    else if (totalMonths < 144) stageIndex = 9 // 童年
    else if (totalMonths < 180) stageIndex = 10 // 少年
    else if (totalMonths < 216) stageIndex = 11 // 青春期
    else stageIndex = 12 // 成年
    const togetherDays = start ? Math.max(0, daysBetween(start, today)) : 0
    return { born: true, week: 0, pregnancyDay: 0, age, togetherDays, stageIndex }
  }

  if (due) {
    const week = pregnancyWeeks(due, today)
    const pregnancyDay = pregnancyDays(due, today)
    // 预产期已过、还没填出生日期：停在「出生」这一站，提醒填写
    const overdue = today.getTime() > due.getTime()
    const stageIndex =
      week <= 0 ? 0 : week <= 12 ? 1 : week <= 27 ? 2 : week <= 40 ? 3 : overdue ? 4 : 3
    const togetherDays = start ? Math.max(0, daysBetween(start, today)) : pregnancyDay
    return {
      born: false,
      week,
      pregnancyDay,
      age: { years: 0, months: 0, days: 0 },
      togetherDays,
      stageIndex,
    }
  }

  return { born: false, week: 0, pregnancyDay: 0, age: { years: 0, months: 0, days: 0 }, togetherDays: 0, stageIndex: 0 }
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
