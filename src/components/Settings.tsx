import { useMemo, useRef, useState } from 'react'
import type { Accent, AppData } from '../lib/types'
import { currentInfo, effectiveDueDate, formatAge, formatDateCN } from '../lib/dates'
import { exportJSON, parseImport } from '../lib/storage'
import { useReveal } from '../lib/useReveal'
import { DownloadIcon, GearIcon, UploadIcon, TrashIcon, HeartIcon } from './Icons'

interface Props {
  data: AppData
  patch: (updater: (prev: AppData) => AppData) => void
  reset: () => void
}

const ACCENTS: { id: Accent; name: string; colors: [string, string] }[] = [
  { id: 'peach', name: '温柔桃', colors: ['#e08a6b', '#f7ddcd'] },
  { id: 'sage', name: '春日青', colors: ['#7fa47f', '#d7e6d4'] },
  { id: 'moon', name: '月光紫', colors: ['#9a86c4', '#e2daf1'] },
]

export default function Settings({ data, patch, reset }: Props) {
  const ref = useReveal<HTMLElement>()
  const importRef = useRef<HTMLInputElement>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const info = useMemo(() => currentInfo(data.settings), [data.settings])
  const s = data.settings

  const set = (key: keyof AppData['settings'], value: string) => {
    patch((prev) => ({ ...prev, settings: { ...prev.settings, [key]: value } }))
  }

  const onImport = async (f: File | undefined) => {
    if (!f) return
    try {
      const text = await f.text()
      const parsed = parseImport(text)
      if (!parsed) {
        window.alert('这个文件不太对，请选择「宝宝成长记」导出的备份文件。')
      } else {
        patch(() => parsed)
        window.alert('导入成功，所有记录都回来啦。')
      }
    } catch {
      window.alert('读文件失败了，再试一次？')
    } finally {
      if (importRef.current) importRef.current.value = ''
    }
  }

  const nowLine = info.born
    ? `宝宝现在 ${formatAge(info.age)}（第 ${info.stageIndex + 1} 站）`
    : info.week > 0
      ? `孕期第 ${info.week} 周（第 ${info.stageIndex + 1} 站）`
      : '还没有填写日期，先填一填上面的信息吧'

  return (
    <section className="section settings-section" id="settings" ref={ref}>
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="kicker">SETTINGS</span>
          <h2>关于我们的小站</h2>
          <p>把日期和名字换成真实的，时间轴就会自动走到属于你们的那一站。</p>
        </div>

        <div className="settings-card reveal">
          <div className="settings-preview">
            <HeartIcon size={16} />
            {nowLine}
          </div>

          <div className="settings-grid">
            <div className="field">
              <label htmlFor="set-nick">宝宝的名字 / 小名</label>
              <input id="set-nick" value={s.nickname} onChange={(e) => set('nickname', e.target.value)} placeholder="宝宝" />
            </div>
            <div className="field">
              <label htmlFor="set-pet">我们怎么称呼你</label>
              <input id="set-pet" value={s.petName} onChange={(e) => set('petName', e.target.value)} placeholder="小宝贝" />
            </div>
            <div className="field">
              <label htmlFor="set-lmp">末次月经日期（孕周按它算）</label>
              <input id="set-lmp" type="date" value={s.lastPeriodDate ?? ''} onChange={(e) => set('lastPeriodDate', e.target.value || '')} />
              <span className="field-hint">
                {s.lastPeriodDate
                  ? `按此推算，预产期约 ${formatDateCN(effectiveDueDate(s))}`
                  : '填了末次月经，预产期会自动推算'}
              </span>
            </div>
            <div className="field">
              <label htmlFor="set-due">预产期（可选，手动覆盖）</label>
              <input id="set-due" type="date" value={s.dueDate ?? ''} onChange={(e) => set('dueDate', e.target.value || '')} />
              <span className="field-hint">一般不用填，B 超校正时可以填</span>
            </div>
            <div className="field">
              <label htmlFor="set-birth">出生日期（宝宝出生后填写）</label>
              <input id="set-birth" type="date" value={s.birthDate ?? ''} onChange={(e) => set('birthDate', e.target.value || '')} />
            </div>
            <div className="field">
              <label htmlFor="set-start">开始记录的日子</label>
              <input id="set-start" type="date" value={s.startDate ?? ''} onChange={(e) => set('startDate', e.target.value || '')} />
            </div>
            <div className="field">
              <label>主题色</label>
              <div className="accent-row" role="radiogroup" aria-label="主题色">
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    role="radio"
                    aria-checked={s.accent === a.id}
                    className={`accent-opt ${s.accent === a.id ? 'is-on' : ''}`}
                    onClick={() => set('accent', a.id)}
                    title={a.name}
                  >
                    <span className="accent-dot" style={{ background: a.colors[0] }} />
                    <span className="accent-dot2" style={{ background: a.colors[1] }} />
                    <span className="accent-name">{a.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="settings-data">
            <h3>
              <GearIcon size={17} />
              数据管理
            </h3>
            <p className="settings-note">
              记录保存在这台设备的浏览器里。请定期「导出备份」并保存好文件，换手机或换浏览器时用它一键找回。
            </p>
            <div className="settings-actions">
              <button className="btn btn-soft btn-sm" onClick={() => exportJSON(data)}>
                <DownloadIcon size={15} />
                导出备份
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => importRef.current?.click()}>
                <UploadIcon size={15} />
                导入备份
              </button>
              <input
                ref={importRef}
                type="file"
                accept="application/json,.json"
                className="visually-hidden"
                aria-label="导入备份文件"
                onChange={(e) => onImport(e.target.files?.[0])}
              />
              {confirmReset ? (
                <span className="reset-confirm">
                  确定清空所有记录吗？
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      reset()
                      setConfirmReset(false)
                    }}
                  >
                    确认清空
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setConfirmReset(false)}>
                    取消
                  </button>
                </span>
              ) : (
                <button className="btn btn-ghost btn-sm" onClick={() => setConfirmReset(true)}>
                  <TrashIcon size={15} />
                  清空重来
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
