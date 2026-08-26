import { useMemo } from 'react'
import type { AppData } from '../lib/types'
import { currentInfo, effectiveDueDate, formatAge, formatDateCN } from '../lib/dates'
import { TOTAL_MILESTONES } from '../data/stages'
import { ArrowDownIcon, CalendarIcon, CheckIcon, FeatherIcon, HeartIcon, SparkleIcon, StarIcon } from './Icons'

interface Props {
  data: AppData
}

function StarField() {
  // 手绘星空：固定点位 + CSS 闪烁
  const stars = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        id: i,
        x: (i * 37 + 11) % 100,
        y: (i * 53 + 29) % 68,
        s: (i % 3) + 1.5,
        d: ((i % 7) * 1.2).toFixed(2),
      })),
    [],
  )
  return (
    <div className="hero-stars" aria-hidden="true">
      {stars.map((st) => (
        <i
          key={st.id}
          className="star"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: st.s,
            height: st.s,
            animationDelay: `${st.d}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function Hero({ data }: Props) {
  const info = useMemo(() => currentInfo(data.settings), [data.settings])
  const { settings } = data
  const done = Object.values(data.milestones).filter(Boolean).length
  const due = effectiveDueDate(settings)

  const statusLine = !info.born
    ? info.week > 0
      ? `孕期第 ${info.week} 周 · 我们已经一起走过 ${info.togetherDays || info.pregnancyDay} 天`
      : '小宝贝正在来的路上'
    : `与你相遇第 ${Math.max(info.togetherDays, 1)} 天 · 你 ${formatAge(info.age)} 了`

  return (
    <section className="hero" id="top">
      <StarField />
      {/* 月亮 */}
      <svg className="hero-moon" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="58" fill="rgba(244,225,180,0.14)" />
        <circle cx="60" cy="60" r="40" fill="rgba(244,225,180,0.22)" />
        <path
          d="M72 24a38 38 0 1 0 24 68A42 42 0 0 1 72 24Z"
          fill="#f5e6bf"
        />
      </svg>
      {/* 底部云与山影 */}
      <svg className="hero-hills" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 250 C240 190 420 300 640 260 C860 220 1020 310 1240 250 C1340 226 1400 236 1440 230 L1440 320 L0 320 Z" fill="rgba(250,245,236,0.06)" />
        <path d="M0 286 C280 240 560 318 860 288 C1120 262 1300 306 1440 286 L1440 320 L0 320 Z" fill="rgba(250,245,236,0.1)" />
      </svg>
      {/* 小脚印装饰 */}
      <div className="hero-footprints" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <SparkleIcon key={i} size={14 + i * 2} className="fp" style={{ '--fd': `${i * 0.55}s` } as import('react').CSSProperties} />
        ))}
      </div>

      <div className="wrap hero-inner">
        <p className="hero-kicker reveal is-in">
          <StarIcon size={14} />
          写给{settings.nickname || '宝宝'}的成长手账
        </p>
        <h1 className="hero-title reveal is-in">
          {settings.petName || '小宝贝'}
          <span className="hero-title-sub">成长记</span>
        </h1>
        <p className="hero-line reveal is-in" style={{ '--d': '0.12s' } as import('react').CSSProperties}>
          <HeartIcon size={15} />
          {statusLine}
        </p>
        <p className="hero-lead reveal is-in" style={{ '--d': '0.2s' } as import('react').CSSProperties}>
          这里收藏你从一颗种子，长成大人的每一天。
          <br className="only-desktop" />
          每一个小小的「第一次」，都是我们生命里大大的光。
        </p>

        <div className="hero-actions reveal is-in" style={{ '--d': '0.28s' } as import('react').CSSProperties}>
          <a className="btn btn-primary" href="#timeline">
            去看看我们的时间轴
            <ArrowDownIcon size={16} />
          </a>
          <a className="btn btn-ghost btn-night" href="#letters">
            <FeatherIcon size={16} />
            写一封悄悄话
          </a>
        </div>

        <div className="hero-stats reveal is-in" style={{ '--d': '0.36s' } as import('react').CSSProperties}>
          <div className="stat">
            <strong>{done}</strong>
            <span>/ {TOTAL_MILESTONES} 个里程碑</span>
          </div>
          <i />
          <div className="stat">
            <strong>{data.letters.length}</strong>
            <span>封悄悄话</span>
          </div>
          <i />
          <div className="stat">
            <strong>{data.memories.length}</strong>
            <span>条成长记录</span>
          </div>
          {due && !info.born && (
            <>
              <i />
              <div className="stat stat-date">
                <CalendarIcon size={14} />
                <span>预产期 {formatDateCN(due)}</span>
              </div>
            </>
          )}
        </div>

        <div className="hero-scroll" aria-hidden="true">
          <CheckIcon size={14} />
        </div>
      </div>
    </section>
  )
}
