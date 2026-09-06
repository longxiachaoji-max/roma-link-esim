import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  BadgePercent,
  Camera,
  Globe2,
  MessageCircle,
  Plane,
  Share2,
  Store,
  Wifi
} from 'lucide-react';
import { OFFICIAL_INSTAGRAM_URL, OFFICIAL_THREADS_URL } from '@/lib/social-profiles';

const links = [
  {
    label: '前往官網',
    description: '查看熱門國家 eSIM 方案',
    href: 'https://firstesim.space',
    icon: Globe2,
    accent: 'from-cyan-300 to-sky-500'
  },
  {
    label: 'LINE 客服',
    description: '訂單、安裝與旅遊上網諮詢',
    href: 'https://lin.ee/Td0EgHE',
    icon: MessageCircle,
    accent: 'from-emerald-300 to-[#06c755]'
  },
  {
    label: 'Instagram',
    description: '旅遊上網資訊與優惠活動',
    href: OFFICIAL_INSTAGRAM_URL,
    icon: Camera,
    accent: 'from-fuchsia-400 via-rose-400 to-amber-300'
  },
  {
    label: 'Threads',
    description: '追蹤一飛通最新消息',
    href: OFFICIAL_THREADS_URL,
    icon: Share2,
    accent: 'from-white to-slate-300'
  },
  {
    label: '經銷合作',
    description: '申請經銷商帳號與合作販售',
    href: 'https://firstesim.space/dealer',
    icon: Store,
    accent: 'from-[#ff6b86] to-[#ffd36b]'
  }
];

export const metadata: Metadata = {
  title: '一飛通全球漫遊 FirstRoamLink｜快速聯絡名片',
  description: '一飛通全球漫遊 FirstRoamLink 提供旅遊 eSIM、出國上網方案、LINE 客服與經銷合作入口。',
  alternates: { canonical: '/card' },
  openGraph: {
    type: 'website',
    url: '/card',
    title: '一飛通全球漫遊 FirstRoamLink｜快速聯絡名片',
    description: '出國旅遊、商務出差，一站式取得 eSIM 上網方案與客服協助。',
    images: [
      {
        url: '/brand/first-roamlink-logo.png',
        width: 1254,
        height: 1254,
        alt: '一飛通全球漫遊 FirstRoamLink'
      }
    ]
  }
};

export default function CardPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070817] px-5 py-8 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.06)_0,transparent_1px)] bg-[length:100%_100%,28px_28px]" />

      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center">
        <div className="w-full border border-white/14 bg-white/[0.08] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-6">
          <div className="border border-white/12 bg-[#0b1025]/85 p-6 text-center shadow-inner shadow-white/5">
            <div className="mx-auto grid size-36 place-items-center border border-white/12 bg-white shadow-[0_18px_50px_rgba(0,216,255,0.18)]">
              <Image
                src="/brand/first-roamlink-logo.png"
                alt="一飛通全球漫遊 FirstRoamLink"
                width={1254}
                height={1254}
                priority
                className="h-28 w-28 object-contain"
              />
            </div>

            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold tracking-[0.22em] text-cyan-100">
              <Plane size={13} />
              TRAVEL eSIM
            </p>

            <h1 className="mt-4 text-3xl font-black tracking-normal sm:text-4xl">
              一飛通全球漫遊
              <span className="mt-1 block bg-gradient-to-r from-cyan-200 via-sky-300 to-teal-200 bg-clip-text text-xl text-transparent sm:text-2xl">
                FirstRoamLink
              </span>
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/68">
              專注旅遊與商務出國上網服務，提供多國 eSIM 方案、快速線上購買與安裝協助。出發前買好，落地就能連線。
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2 text-left">
              <div className="border border-white/10 bg-white/[0.06] p-3">
                <Wifi className="text-cyan-200" size={18} />
                <p className="mt-2 text-[11px] font-bold text-white/72">免換卡</p>
              </div>
              <div className="border border-white/10 bg-white/[0.06] p-3">
                <Globe2 className="text-teal-200" size={18} />
                <p className="mt-2 text-[11px] font-bold text-white/72">多國上網</p>
              </div>
              <div className="border border-white/10 bg-white/[0.06] p-3">
                <BadgePercent className="text-rose-200" size={18} />
                <p className="mt-2 text-[11px] font-bold text-white/72">經銷合作</p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {links.map(({ label, description, href, icon: Icon, accent }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 border border-white/10 bg-white/[0.07] p-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200/30 hover:bg-white/[0.11]"
              >
                <span className={`grid size-11 shrink-0 place-items-center bg-gradient-to-br ${accent} text-[#07101c] shadow-lg`}>
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-sm font-black">{label}</span>
                  <span className="mt-0.5 block truncate text-xs text-white/45">{description}</span>
                </span>
                <ArrowUpRight className="text-white/35 transition group-hover:text-cyan-200" size={18} />
              </Link>
            ))}
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-white/38">
            日本、韓國、泰國、越南、中國、中港澳、歐美等旅遊上網方案陸續上架。
          </p>
        </div>
      </section>
    </main>
  );
}
