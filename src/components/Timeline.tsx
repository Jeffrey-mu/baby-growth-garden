import { useMemo } from 'react'
import type { AppData } from '../lib/types'
import { currentInfo } from '../lib/dates'
import { STAGES } from '../data/stages'
import { useReveal } from '../lib/useReveal'
import { Icon, LockIcon, CheckIcon, HeartIcon } from './Icons'

interface Props {
  data: AppData
  patch: (updater: (prev: AppData) => AppData) => void
}

function milestoneKey(stageId: string, idx: number) {
  return `${stageId}::${idx}`
}

export default function Timeline({ data, patch }: Props) {
  const ref = useReveal<HTMLElement>()
  const { settings, milestones } = data
  const info = useMemo(() => currentInfo(settings), [settings])
  const current = info.stageIndex
  const progress = (current / (STAGES.length - 1)) * 100

  const toggle = (key: string) => {
    patch((prev) => ({
      ...prev,
      milestones: { ...prev.milestones, [key]: !prev.milestones[key] },
    }))
  }

  const jumpToNow = () => {
    const el = document.getElementById(`stage-${STAGES[current].id}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section className="section timeline-section" id="timeline" ref={ref}>
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="kicker">GROWING UP</span>
          <h2>我们的成长时间轴</h2>
          <p>
            从一颗种子，到一树花开。每一站都写着「现在的你」，
            和爸爸妈妈想说给你听的悄悄话。
          </p>
        </div>

        <button className="btn btn-soft btn-sm jump-now reveal" onClick={jumpToNow}>
          <HeartIcon size={14} />
          跳到我现在的这一站
        </button>

        <div className="timeline">
          <div className="tl-rail" aria-hidden="true">
            <span className="tl-rail-fill" style={{ height: `${progress}%` }} />
          </div>

          {STAGES.map((stage, i) => {
            const isCurrent = i === current
            const isPast = i < current
            const locked = i > current
            return (
              <article
                key={stage.id}
                id={`stage-${stage.id}`}
                className={`tl-item reveal ${isCurrent ? 'is-current' : ''} ${locked ? 'is-locked' : ''} ${isPast ? 'is-past' : ''}`}
                style={{ '--d': `${Math.min(i * 0.06, 0.5)}s` } as import('react').CSSProperties}
              >
                <div className="tl-node" aria-hidden="true">
                  <span className="tl-node-ring">
                    <Icon name={stage.icon} size={20} />
                  </span>
                </div>

                <div className="tl-card">
                  <div className="tl-card-head">
                    <div className="tl-period">{stage.period}</div>
                    {isCurrent && <span className="tl-badge tl-badge-now">我们在这里</span>}
                    {locked && (
                      <span className="tl-badge tl-badge-later">
                        <LockIcon size={12} /> 尚未抵达
                      </span>
                    )}
                  </div>
                  <h3 className="tl-title">{stage.title}</h3>
                  <p className="tl-subtitle">{stage.subtitle}</p>

                  <div className="tl-status">
                    <h4>此刻的你</h4>
                    <ul>
                      {stage.statusItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="tl-letter">
                    <div className="tl-letter-label">
                      <Icon name="feather" size={14} />
                      写给宝宝的悄悄话
                    </div>
                    <p>{stage.letter}</p>
                  </div>

                  <div className="tl-milestones">
                    <h4>
                      这一站的里程碑
                      <span className="ms-count">
                        {stage.milestones.filter((_, m) => milestones[milestoneKey(stage.id, m)]).length}/{stage.milestones.length}
                      </span>
                    </h4>
                    <ul>
                      {stage.milestones.map((ms, m) => {
                        const key = milestoneKey(stage.id, m)
                        const done = !!milestones[key]
                        return (
                          <li key={ms}>
                            <label className={`ms-item ${done ? 'is-done' : ''}`}>
                              <input
                                type="checkbox"
                                checked={done}
                                disabled={locked}
                                onChange={() => toggle(key)}
                              />
                              <span className="ms-box" aria-hidden="true">
                                <CheckIcon size={13} strokeWidth={2.4} />
                              </span>
                              <span className="ms-text">{ms}</span>
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </article>
            )
          })}

          <div className="tl-end reveal" style={{ '--d': '0.2s' } as import('react').CSSProperties}>
            <Icon name="sparkle" size={22} />
            <p>故事还在继续……</p>
            <span>后面的每一站，都等我们一起去写</span>
          </div>
        </div>
      </div>
    </section>
  )
}
