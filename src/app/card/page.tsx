import type { Metadata } from 'next';
import CardExperience from './card-experience';

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
  return <CardExperience />;
}
