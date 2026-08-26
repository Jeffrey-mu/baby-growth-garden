import { useEffect, useState } from 'react'
import { MoonIcon, PenIcon } from './Icons'

const LINKS = [
  { href: '#timeline', label: '成长时间轴' },
  { href: '#letters', label: '悄悄话' },
  { href: '#memory', label: '成长记录' },
  { href: '#settings', label: '设置' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap-wide header-inner">
        <a className="brand" href="#top" aria-label="回到首页">
          <span className="brand-mark">
            <MoonIcon size={18} />
          </span>
          <span className="brand-name">宝宝成长记</span>
        </a>
        <nav className="header-nav noscroll-x" aria-label="主导航">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="header-link">
              {l.label}
            </a>
          ))}
          <a href="#letters" className="header-write">
            <PenIcon size={14} />
            写悄悄话
          </a>
        </nav>
      </div>
    </header>
  )
}
