import type { CategoryId } from '../data/tools';

/** カテゴリごとの識別色（カードの点）。Tailwindが検出できるよう、クラス名は完全な文字列で書く */
export const categoryDotClass: Record<CategoryId, string> = {
  text: 'bg-sky-500',
  data: 'bg-teal-500',
  encode: 'bg-violet-500',
  datetime: 'bg-amber-500',
  image: 'bg-pink-500',
  pdf: 'bg-red-500',
  calc: 'bg-emerald-500',
  dev: 'bg-indigo-500',
  generate: 'bg-orange-500',
  camera: 'bg-rose-500',
  security: 'bg-slate-500',
  file: 'bg-lime-600',
  hardware: 'bg-cyan-600',
  media: 'bg-fuchsia-500',
  games: 'bg-yellow-500',
};
