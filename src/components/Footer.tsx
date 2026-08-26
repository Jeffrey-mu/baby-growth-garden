import type { AppData } from '../lib/types'
import { MoonIcon, HeartIcon } from './Icons'

export default function Footer({ data }: { data: AppData }) {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div className="footer-mark">
          <MoonIcon size={20} />
          <span>宝宝成长记</span>
        </div>
        <p className="footer-quote">
          从一颗种子，到一生的花。愿这页纸，替我们记住每一个你。
        </p>
        <p className="footer-meta">
          {data.settings.nickname || '宝宝'}的成长手账 · 记录于 {new Date().getFullYear()} 年
          <span className="footer-heart">
            <HeartIcon size={12} />
          </span>
        </p>
      </div>
    </footer>
  )
}
