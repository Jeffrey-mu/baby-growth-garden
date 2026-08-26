import { useMemo, useState } from 'react'
import type { AppData, CapsuleLetter } from '../lib/types'
import { daysBetween, effectiveDueDate, formatDateCN, parseISO, todayISO, uid } from '../lib/dates'
import { useReveal } from '../lib/useReveal'
import { Icon, LockIcon, PenIcon, PlusIcon, TrashIcon, StarIcon, HeartIcon } from './Icons'

interface Props {
  data: AppData
  patch: (updater: (prev: AppData) => AppData) => void
}

function unlockDateOf(letter: CapsuleLetter, settings: AppData['settings']): string | null {
  if (letter.unlockDate) return letter.unlockDate
  if (!letter.toAge) return null
  const base = parseISO(settings.birthDate) ?? parseISO(effectiveDueDate(settings))
  if (!base) return null
  const d = new Date(base)
  d.setFullYear(d.getFullYear() + letter.toAge)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function Letters({ data, patch }: Props) {
  const ref = useReveal<HTMLElement>()
  const { letters, settings } = data
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ to: '', toAge: '3', unlockDate: '', content: '' })

  const sorted = useMemo(() => {
    return [...letters].sort((a, b) => {
      const ua = unlockDateOf(a, settings) ?? '9999'
      const ub = unlockDateOf(b, settings) ?? '9999'
      return ua.localeCompare(ub)
    })
  }, [letters, settings])

  const addLetter = () => {
    const toAge = form.toAge === 'custom' ? null : Number(form.toAge)
    const letter: CapsuleLetter = {
      id: uid(),
      to: form.to.trim() || `写给 ${toAge ? toAge + ' 岁的你' : '未来的你'}`,
      toAge,
      unlockDate: form.toAge === 'custom' && form.unlockDate ? form.unlockDate : null,
      content: form.content.trim() || '（这里有一句话，等你慢慢写。）',
      createdAt: todayISO(),
      opened: false,
    }
    patch((prev) => ({ ...prev, letters: [...prev.letters, letter] }))
    setForm({ to: '', toAge: '3', unlockDate: '', content: '' })
    setShowForm(false)
  }

  const remove = (id: string) => {
    if (!window.confirm('要删除这封悄悄话吗？删除后无法找回。')) return
    patch((prev) => ({ ...prev, letters: prev.letters.filter((l) => l.id !== id) }))
  }

  const open = (id: string) => {
    patch((prev) => ({
      ...prev,
      letters: prev.letters.map((l) => (l.id === id ? { ...l, opened: true } : l)),
    }))
  }

  return (
    <section className="letters-section" id="letters" ref={ref}>
      <div className="letters-bg" aria-hidden="true">
        {Array.from({ length: 26 }, (_, i) => (
          <i
            key={i}
            className="star"
            style={{
              left: `${(i * 41 + 7) % 100}%`,
              top: `${(i * 29 + 13) % 72}%`,
              width: (i % 3) + 1.5,
              height: (i % 3) + 1.5,
              animationDelay: `${(i % 8) * 1.1}s`,
            }}
          />
        ))}
        <svg className="letters-moon" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M62 18a34 34 0 1 0 20 62A38 38 0 0 1 62 18Z" fill="#f3e3bd" opacity="0.9" />
        </svg>
      </div>

      <div className="wrap letters-inner">
        <div className="sec-head reveal">
          <span className="kicker kicker-night">TIME CAPSULE</span>
          <h2>写给未来的悄悄话</h2>
          <p>
            有些话现在说还太早，那就写下来，封进时光胶囊。
            等到你三岁、十二岁、十八岁……由长大的你自己打开。
          </p>
        </div>

        <button
          className="btn btn-soft btn-sm letters-add reveal"
          onClick={() => setShowForm((v) => !v)}
          aria-expanded={showForm}
        >
          <PlusIcon size={15} />
          {showForm ? '收起' : '写一封新的悄悄话'}
        </button>

        {showForm && (
          <form
            className="letter-form reveal is-in"
            onSubmit={(e) => {
              e.preventDefault()
              addLetter()
            }}
          >
            <div className="field">
              <label htmlFor="letter-to">写给</label>
              <input
                id="letter-to"
                placeholder="例如：三岁的你"
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="letter-age">让宝宝在多少岁时打开</label>
              <select
                id="letter-age"
                value={form.toAge}
                onChange={(e) => setForm({ ...form, toAge: e.target.value })}
              >
                <option value="1">1 岁</option>
                <option value="3">3 岁</option>
                <option value="6">6 岁</option>
                <option value="12">12 岁</option>
                <option value="18">18 岁</option>
                <option value="custom">自定义日期</option>
              </select>
            </div>
            {form.toAge === 'custom' && (
              <div className="field">
                <label htmlFor="letter-date">解锁日期</label>
                <input
                  id="letter-date"
                  type="date"
                  value={form.unlockDate}
                  onChange={(e) => setForm({ ...form, unlockDate: e.target.value })}
                />
              </div>
            )}
            <div className="field field-wide">
              <label htmlFor="letter-content">想说的话</label>
              <textarea
                id="letter-content"
                rows={5}
                placeholder="把那些「等以后再告诉你」的话，写在这里……"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              <PenIcon size={14} />
              封存这封信
            </button>
          </form>
        )}

        {sorted.length === 0 ? (
          <div className="letters-empty reveal">
            <Icon name="feather" size={28} />
            <p>还没有悄悄话，写一封吧。</p>
          </div>
        ) : (
          <div className="letters-grid">
            {sorted.map((letter, i) => {
              const unlock = unlockDateOf(letter, settings)
              const today = todayISO()
              const canOpen = unlock && unlock <= today
              const sealed = !letter.opened && !canOpen
              const days = unlock ? daysBetween(parseISO(today)!, parseISO(unlock)!) : null
              return (
                <article
                  key={letter.id}
                  className={`letter-card reveal ${sealed ? 'is-sealed' : ''} ${letter.opened ? 'is-open' : ''}`}
                  style={{ '--d': `${Math.min(i * 0.07, 0.4)}s` } as import('react').CSSProperties}
                >
                  {sealed ? (
                    <div className="letter-seal-wrap">
                      <div className="letter-wax">
                        <HeartIcon size={18} strokeWidth={1.8} />
                      </div>
                      <h3>{letter.to || '未来的你'}</h3>
                      <p className="letter-lock-note">
                        <LockIcon size={13} />
                        锁到 {formatDateCN(unlock)}
                      </p>
                      {days !== null && days >= 0 ? (
                        <span className="letter-countdown">还有 {days} 天</span>
                      ) : (
                        <span className="letter-countdown">等待宝宝出生后解锁</span>
                      )}
                      <p className="letter-tease">时光会把这份爱，慢慢送到你手里</p>
                    </div>
                  ) : canOpen && !letter.opened ? (
                    <div className="letter-seal-wrap">
                      <div className="letter-wax letter-wax-open">
                        <StarIcon size={18} strokeWidth={1.8} />
                      </div>
                      <h3>{letter.to || '未来的你'}</h3>
                      <p className="letter-lock-note">时间到了，可以打开啦</p>
                      <button className="btn btn-primary btn-sm" onClick={() => open(letter.id)}>
                        <Icon name="feather" size={14} />
                        打开这封信
                      </button>
                    </div>
                  ) : (
                    <div className="letter-open">
                      <div className="letter-open-head">
                        <h3>{letter.to || '未来的你'}</h3>
                        <span className="letter-open-date">{formatDateCN(unlock)} 解锁</span>
                      </div>
                      <p className="letter-body">{letter.content}</p>
                      <span className="letter-signed">—— 爱你的爸爸妈妈</span>
                    </div>
                  )}
                  <button className="letter-del" aria-label="删除这封悄悄话" onClick={() => remove(letter.id)}>
                    <TrashIcon size={15} />
                  </button>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
