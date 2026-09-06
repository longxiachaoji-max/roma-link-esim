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
    <main className="relative min-h-[100svh] overflow-hidden bg-[linear-gradient(145deg,#080916_0%,#111528_42%,#171321_68%,#071b1d_100%)] px-4 py-6 text-white sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_4%,rgba(73,217,255,0.12)_30%,transparent_52%,rgba(255,109,151,0.08)_76%,transparent_96%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[18%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-[14%] h-px bg-gradient-to-r from-transparent via-cyan-200/15 to-transparent" />

      <section className="relative mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-lg items-center sm:min-h-[calc(100svh-5rem)]">
        <div className="card-glass-enter relative w-full overflow-hidden rounded-[36px] border border-white/20 bg-white/[0.075] p-2 shadow-[0_35px_100px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-[36px] sm:p-2.5">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          <div className="relative overflow-hidden rounded-[30px] border border-white/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.11),rgba(9,14,35,0.62)_45%,rgba(3,18,25,0.76))] px-5 py-7 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_14px_40px_rgba(0,0,0,0.18)] sm:px-7 sm:py-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.07] to-transparent" />
            <div className="relative mx-auto grid size-32 place-items-center overflow-hidden rounded-[30px] border border-white/40 bg-white shadow-[0_18px_55px_rgba(43,210,255,0.22),inset_0_0_0_1px_rgba(255,255,255,0.65)] sm:size-36">
              <Image
                src="/brand/first-roamlink-logo.png"
                alt="一飛通全球漫遊 FirstRoamLink"
                width={1254}
                height={1254}
                priority
                className="h-full w-full object-cover"
              />
            </div>

            <p className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.09] px-3.5 py-1.5 text-xs font-bold tracking-[0.18em] text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
              <Plane size={13} />
              TRAVEL eSIM
            </p>

            <h1 className="relative mt-4 text-3xl font-black tracking-normal sm:text-4xl">
              一飛通全球漫遊
              <span className="mt-1 block bg-gradient-to-r from-cyan-200 via-sky-300 to-teal-200 bg-clip-text text-xl text-transparent sm:text-2xl">
                FirstRoamLink
              </span>
            </h1>

            <p className="relative mx-auto mt-4 max-w-sm text-sm leading-7 text-white/68">
              專注旅遊與商務出國上網服務，提供多國 eSIM 方案、快速線上購買與安裝協助。出發前買好，落地就能連線。
            </p>

            <div className="relative mt-6 grid grid-cols-3 gap-2.5 text-left">
              <div className="rounded-[18px] border border-white/15 bg-white/[0.075] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
                <Wifi className="text-cyan-200" size={18} />
                <p className="mt-2 text-[11px] font-bold text-white/72">免換卡</p>
              </div>
              <div className="rounded-[18px] border border-white/15 bg-white/[0.075] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
                <Globe2 className="text-teal-200" size={18} />
                <p className="mt-2 text-[11px] font-bold text-white/72">多國上網</p>
              </div>
              <div className="rounded-[18px] border border-white/15 bg-white/[0.075] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
                <BadgePercent className="text-rose-200" size={18} />
                <p className="mt-2 text-[11px] font-bold text-white/72">經銷合作</p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 px-1 pb-1 pt-3">
            {links.map(({ label, description, href, icon: Icon, accent }, index) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ animationDelay: `${140 + index * 65}ms` }}
                className="card-glass-link group relative flex items-center gap-3 overflow-hidden rounded-[22px] border border-white/15 bg-white/[0.075] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.13),0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.13] active:translate-y-0 active:scale-[0.985]"
              >
                <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
                <span className={`card-glass-icon grid size-11 shrink-0 place-items-center rounded-[15px] bg-gradient-to-br ${accent} text-[#07101c] shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition duration-300`}>
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-sm font-black">{label}</span>
                  <span className="mt-0.5 block truncate text-xs text-white/45">{description}</span>
                </span>
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.06]">
                  <ArrowUpRight className="text-white/40 transition group-hover:text-cyan-100" size={16} />
                </span>
              </Link>
            ))}
          </div>

          <p className="px-5 pb-4 pt-3 text-center text-xs leading-5 text-white/38">
            日本、韓國、泰國、越南、中國、中港澳、歐美等旅遊上網方案陸續上架。
          </p>
        </div>
      </section>
    </main>
  );
}
