import type { JSX } from 'react'

interface IconProps {
  size?: number
  className?: string
  strokeWidth?: number
  style?: import('react').CSSProperties
}

function make(
  children: JSX.Element | JSX.Element[],
): (p: IconProps) => JSX.Element {
  return function Icon({ size = 22, className, strokeWidth = 1.6, style }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
        aria-hidden="true"
      >
        {children}
      </svg>
    )
  }
}

export const SproutIcon = make(
  <>
    <path d="M12 21v-9" />
    <path d="M12 12c0-3.5-2.5-6-6-6 0 3.5 2.5 6 6 6Z" />
    <path d="M12 9c0-2.8-2-4.8-4.8-4.8C7.2 7 9.2 9 12 9Z" />
    <path d="M12 12c3.5 0 6-2.5 6-6-3.5 0-6 2.5-6 6Z" />
  </>,
)

export const HeartbeatIcon = make(
  <>
    <path d="M20.8 10.2c.7-1.8-.1-3.9-1.9-4.7a3.6 3.6 0 0 0-4.9 2L12 11.5l-2-4a3.6 3.6 0 0 0-4.9-2c-1.8.8-2.6 2.9-1.9 4.7" />
    <path d="M3 14h4l1.2-2.6 2.3 5.1L12.5 14H21" />
  </>,
)

export const KickIcon = make(
  <>
    <path d="M4 20c2-4 4.5-6.5 8-7.5" />
    <path d="M12 12.5c.5 1.2 1.8 1.7 3 1.4.9-.2 1.5-1 1.3-1.9-.2-1-1.2-1.6-2.2-1.3-1.4.3-2.1-1.7-3.8-.7" />
    <path d="M7 17c1.4-1.4 3-2.4 5-3" />
  </>,
)

export const MoonIcon = make(
  <>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
    <path d="M18 4.5l.4 1.1 1.1.4-1.1.4-.4 1.1-.4-1.1-1.1-.4 1.1-.4.4-1.1Z" fill="currentColor" stroke="none" />
  </>,
)

export const FootprintsIcon = make(
  <>
    <ellipse cx="8" cy="14.5" rx="3" ry="2.2" />
    <path d="M5.6 12c.5-1.8 2-2.6 3.6-2.3" />
    <ellipse cx="15.5" cy="17" rx="3" ry="2.2" />
    <path d="M13 14.6c.4-1.8 1.9-2.6 3.5-2.4" />
  </>,
)

export const PacifierIcon = make(
  <>
    <circle cx="12" cy="9" r="5.5" />
    <path d="M12 14.5V18a2.5 2.5 0 0 0 5 0" />
    <path d="M12 14.5V18a2.5 2.5 0 0 1-5 0" />
    <path d="M9 6.5c.8.6 1.5.6 2.2 0M12.8 6.5c.7.6 1.4.6 2.2 0" />
  </>,
)

export const RattleIcon = make(
  <>
    <circle cx="6" cy="16" r="3.4" />
    <path d="M8.6 13.4 19 3" />
    <path d="M14.5 8.5l3-3M16.5 10.5l2-2" />
  </>,
)

export const BlocksIcon = make(
  <>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="5" rx="1.5" />
    <rect x="4" y="13" width="5" height="7" rx="1.5" />
    <rect x="11" y="11" width="9" height="9" rx="1.5" />
  </>,
)

export const CrayonIcon = make(
  <>
    <path d="M19 5c-1.2-1.2-3-1.2-4.2 0L5.5 14.3 4 20l5.7-1.5L19 9.2c1.2-1.2 1.2-3 0-4.2Z" />
    <path d="M15.5 4.5 19.5 8.5" />
    <path d="M6 15.5c2.5.5 3.5 1.5 4 4" />
  </>,
)

export const BackpackIcon = make(
  <>
    <path d="M5 9a7 7 0 0 1 14 0v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9Z" />
    <path d="M12 4c-1.5 0-2.5.7-3 2 1-.4 2-.6 3-.6s2 .2 3 .6c-.5-1.3-1.5-2-3-2Z" />
    <path d="M9 11h6" />
    <path d="M9 15h3" />
  </>,
)

export const BookIcon = make(
  <>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
    <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
    <path d="M8.5 7h7M8.5 10.5h5" />
  </>,
)

export const GuitarIcon = make(
  <>
    <circle cx="7" cy="17" r="3.4" />
    <path d="M9.6 14.6 18.5 5.7" />
    <path d="M15 6.5l2.5 2.5M16.5 5l3 3" />
    <path d="M7 14v-1.5c0-1 .5-2 1.4-2.4L13 8" />
  </>,
)

export const RocketIcon = make(
  <>
    <path d="M12 15c-1.5-3-1-6.5 2-10 2.5-3 5.5-3.5 5.5-3.5S19 4.5 19 7c0 2-2 6.5-5 8" />
    <path d="M9 12c-2 1-3.5 3-4 6l2.5.5c.5-2 1.5-3.5 3.5-4.5" />
    <path d="M12 15l-2.5.5L8.5 18l2-.5" />
    <circle cx="16.5" cy="5.5" r="1.2" fill="currentColor" stroke="none" />
    <path d="M4 21c1.5-.5 3-2 3.5-3.5" />
  </>,
)

export const LockIcon = make(
  <>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    <circle cx="12" cy="15.2" r="1.2" fill="currentColor" stroke="none" />
  </>,
)

export const HeartIcon = make(
  <path d="M12 20.5S3.5 15 3.5 9A4.5 4.5 0 0 1 12 6.5 4.5 4.5 0 0 1 20.5 9c0 6-8.5 11.5-8.5 11.5Z" />,
)

export const StarIcon = make(
  <path d="M12 3.5l2.4 5.2 5.6.6-4.2 3.8 1.2 5.5L12 15.9l-5 2.7 1.2-5.5L4 9.3l5.6-.6L12 3.5Z" />,
)

export const PlusIcon = make(<path d="M12 5v14M5 12h14" />)

export const TrashIcon = make(
  <>
    <path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13" />
    <path d="M10 11v5M14 11v5" />
  </>,
)

export const DownloadIcon = make(
  <>
    <path d="M12 3v11M7.5 10.5 12 15l4.5-4.5" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </>,
)

export const UploadIcon = make(
  <>
    <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </>,
)

export const GearIcon = make(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.8v2.2M12 19v2.2M2.8 12H5M19 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
  </>,
)

export const CalendarIcon = make(
  <>
    <rect x="4" y="5.5" width="16" height="15" rx="2" />
    <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
  </>,
)

export const CameraIcon = make(
  <>
    <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.5-2h6l1.5 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z" />
    <circle cx="12" cy="13" r="3.2" />
  </>,
)

export const PenIcon = make(
  <>
    <path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1Z" />
    <path d="M14 6.5l3.5 3.5" />
  </>,
)

export const ArrowDownIcon = make(<path d="M12 4v16M6 14l6 6 6-6" />)

export const CloudIcon = make(
  <path d="M7 18a4 4 0 0 1-.6-7.95A5.5 5.5 0 0 1 17.4 9.6 3.8 3.8 0 0 1 17.5 18H7Z" />,
)

export const FeatherIcon = make(
  <>
    <path d="M20 4c-7 0-12.5 4.5-13.5 12L4 20l4-2.5C15.5 16.5 20 11 20 4Z" />
    <path d="M8.5 15.5c3-1 6-3 8-6" />
  </>,
)

export const ClockIcon = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5l3.5 2" />
  </>,
)

export const CheckIcon = make(<path d="M5 12.5l4.5 4.5L19 7.5" />)

export const SparkleIcon = make(
  <>
    <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" fill="currentColor" stroke="none" />
    <path d="M19 16l.6 2L22 18.6l-2.4.6L19 21l-.6-1.8-2.4-.6L18.4 18l.6-2Z" fill="currentColor" stroke="none" />
  </>,
)

export const ICONS: Record<string, (p: IconProps) => JSX.Element> = {
  sprout: SproutIcon,
  heartbeat: HeartbeatIcon,
  kick: KickIcon,
  moon: MoonIcon,
  footprints: FootprintsIcon,
  pacifier: PacifierIcon,
  rattle: RattleIcon,
  blocks: BlocksIcon,
  crayon: CrayonIcon,
  backpack: BackpackIcon,
  book: BookIcon,
  guitar: GuitarIcon,
  rocket: RocketIcon,
  lock: LockIcon,
  heart: HeartIcon,
  star: StarIcon,
  plus: PlusIcon,
  trash: TrashIcon,
  download: DownloadIcon,
  upload: UploadIcon,
  gear: GearIcon,
  calendar: CalendarIcon,
  camera: CameraIcon,
  pen: PenIcon,
  arrowDown: ArrowDownIcon,
  cloud: CloudIcon,
  feather: FeatherIcon,
  clock: ClockIcon,
  check: CheckIcon,
  sparkle: SparkleIcon,
}

export function Icon({ name, ...rest }: IconProps & { name: string }) {
  const C = ICONS[name] ?? StarIcon
  return <C {...rest} />
}
