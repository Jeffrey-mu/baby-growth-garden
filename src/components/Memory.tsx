import { useRef, useState } from 'react'
import type { AppData, MemoryEntry } from '../lib/types'
import { todayISO, uid } from '../lib/dates'
import { useReveal } from '../lib/useReveal'
import { CameraIcon, PlusIcon, TrashIcon, CalendarIcon } from './Icons'

interface Props {
  data: AppData
  patch: (updater: (prev: AppData) => AppData) => void
}

const TAGS = ['孕期', '出生', '第一次', '日常', '里程碑', '其他'] as const

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const max = 1000
        let { width, height } = img
        if (width > max || height > max) {
          const r = Math.min(max / width, max / height)
          width = Math.round(width * r)
          height = Math.round(height * r)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('no canvas'))
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.onerror = reject
      img.src = reader.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function Memory({ data, patch }: Props) {
  const ref = useReveal<HTMLElement>()
  const fileRef = useRef<HTMLInputElement>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ date: todayISO(), tag: TAGS[0] as string, title: '', note: '' })
  const [photo, setPhoto] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const onFile = async (f: File | undefined) => {
    if (!f) return
    setBusy(true)
    try {
      const url = await fileToDataURL(f)
      setPhoto(url)
    } catch {
      window.alert('这张图片读不出来，换一张试试～')
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const addEntry = () => {
    if (!form.title.trim() && !form.note.trim() && !photo) return
    const entry: MemoryEntry = {
      id: uid(),
      date: form.date,
      title: form.title.trim() || '没有标题的一天',
      note: form.note.trim(),
      photo,
      tag: form.tag,
    }
    patch((prev) => ({ ...prev, memories: [entry, ...prev.memories] }))
    setForm({ date: todayISO(), tag: TAGS[0], title: '', note: '' })
    setPhoto(null)
    setShowForm(false)
  }

  const remove = (id: string) => {
    if (!window.confirm('要删除这条记录吗？')) return
    patch((prev) => ({ ...prev, memories: prev.memories.filter((m) => m.id !== id) }))
  }

  const sorted = [...data.memories].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <section className="section memory-section" id="memory" ref={ref}>
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="kicker">MEMORIES</span>
          <h2>成长的每一页</h2>
          <p>照片、日记、小碎片——把舍不得忘记的瞬间，都轻轻收好。</p>
        </div>

        <button
          className="btn btn-primary btn-sm memory-add reveal"
          onClick={() => setShowForm((v) => !v)}
          aria-expanded={showForm}
        >
          <PlusIcon size={15} />
          {showForm ? '收起' : '记一笔'}
        </button>

        {showForm && (
          <form
            className="memory-form reveal is-in"
            onSubmit={(e) => {
              e.preventDefault()
              addEntry()
            }}
          >
            <div className="field">
              <label htmlFor="mem-date">日期</label>
              <input
                id="mem-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="mem-tag">标签</label>
              <select
                id="mem-tag"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
              >
                {TAGS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="mem-title">标题</label>
              <input
                id="mem-title"
                placeholder="今天发生了什么？"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="field field-wide">
              <label htmlFor="mem-note">想说的话</label>
              <textarea
                id="mem-note"
                rows={3}
                placeholder="记下这一刻的心情……"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>
            <div className="field field-wide">
              <span className="visually-hidden" id="mem-photo-label">
                上传一张照片
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="visually-hidden"
                aria-labelledby="mem-photo-label"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              {photo ? (
                <div className="mem-photo-preview">
                  <img src={photo} alt="待保存的照片预览" />
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPhoto(null)}>
                    换一张
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm mem-upload"
                  disabled={busy}
                  onClick={() => fileRef.current?.click()}
                >
                  <CameraIcon size={15} />
                  {busy ? '处理中……' : '加一张照片（可选）'}
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={!form.title.trim() && !form.note.trim() && !photo}>
              保存这一页
            </button>
          </form>
        )}

        {sorted.length === 0 ? (
          <div className="memory-empty reveal">
            <CameraIcon size={30} />
            <p>这里还是空白的一页。</p>
            <span>等宝宝的第一张照片、第一次笑，等你们的每一天。</span>
          </div>
        ) : (
          <div className="memory-grid">
            {sorted.map((m, i) => (
              <article
                key={m.id}
                className={`mem-card reveal tag-${TAGS.indexOf(m.tag as (typeof TAGS)[number])}`}
                style={{ '--d': `${Math.min(i * 0.05, 0.35)}s` } as import('react').CSSProperties}
              >
                {m.photo && (
                  <div className="mem-photo">
                    <img src={m.photo} alt={m.title} loading="lazy" />
                  </div>
                )}
                <div className="mem-body">
                  <div className="mem-meta">
                    <span className="mem-tag">{m.tag}</span>
                    <span className="mem-date">
                      <CalendarIcon size={12} />
                      {m.date}
                    </span>
                  </div>
                  <h3>{m.title}</h3>
                  {m.note && <p>{m.note}</p>}
                </div>
                <button className="mem-del" aria-label="删除这条记录" onClick={() => remove(m.id)}>
                  <TrashIcon size={15} />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
