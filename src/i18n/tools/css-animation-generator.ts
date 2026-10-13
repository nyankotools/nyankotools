import type { Locale } from '../../data/tools';
import type {
  Direction,
  EasingId,
  FillMode,
  PresetId,
} from '../../lib/tools/css-animation-generator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CssAnimationGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  settingsHeading: string;
  presetLabel: string;
  presetNames: Record<PresetId, string>;
  nameLabel: string;
  durationLabel: string;
  delayLabel: string;
  iterationsLabel: string;
  infiniteLabel: string;
  directionLabel: string;
  directionNames: Record<Direction, string>;
  fillModeLabel: string;
  fillModeNames: Record<FillMode, string>;
  easingHeading: string;
  easingLabel: string;
  easingNames: Record<EasingId, string>;
  bezierX1Label: string;
  bezierY1Label: string;
  bezierX2Label: string;
  bezierY2Label: string;
  curveLabel: string;
  reducedMotionLabel: string;
  previewHeading: string;
  replayButton: string;
  previewHint: string;
  cssHeading: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cssAnimationGeneratorContent: Record<
  Locale,
  CssAnimationGeneratorPageContent
> = {
  ja: {
    title:
      'CSSアニメーションジェネレーター（@keyframes・イージング編集・プレビュー付き）',
    description:
      'バウンス・フェード・回転などのプリセットから、CSSの@keyframesとanimationプロパティをプレビューしながら生成できる無料ツールです。cubic-bezierのイージング編集、duration・delay・繰り返し・方向・fill-modeの指定、prefers-reduced-motion対応にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'CSSアニメーションジェネレーター',
    introHtml:
      'バウンス・フェード・スライド・回転などのプリセットを選び、継続時間・遅延・繰り返し回数・方向・fill-mode・イージング（<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">cubic-bezier</code>）を調整すると、プレビューと<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">@keyframes</code>＋<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">animation</code>のCSSが同時に更新されます。動きを抑えたい環境向けの<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">prefers-reduced-motion</code>の記述も出力に含められます。影の表現には <a href="/tools/css-box-shadow-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS box-shadowジェネレーター</a> もご利用ください。',
    settingsHeading: 'アニメーションの設定',
    presetLabel: 'プリセット',
    presetNames: {
      'fade-in': 'フェードイン',
      'fade-out': 'フェードアウト',
      'slide-in-left': '左からスライドイン',
      'slide-in-up': '下からスライドイン',
      'zoom-in': 'ズームイン',
      bounce: 'バウンス',
      pulse: 'パルス（拡大縮小）',
      shake: 'シェイク（横揺れ）',
      swing: 'スイング（振り子）',
      spin: '回転',
      flip: 'フリップ（Y軸回転）',
    },
    nameLabel: 'アニメーション名（@keyframes名）',
    durationLabel: '継続時間（秒）',
    delayLabel: '開始までの遅延（秒）',
    iterationsLabel: '繰り返し回数',
    infiniteLabel: '無限に繰り返す',
    directionLabel: '再生方向（direction）',
    directionNames: {
      normal: 'normal（順方向）',
      reverse: 'reverse（逆方向）',
      alternate: 'alternate（往復）',
      'alternate-reverse': 'alternate-reverse（逆から往復）',
    },
    fillModeLabel: '開始前・終了後の状態（fill-mode）',
    fillModeNames: {
      none: 'none（元の状態に戻る）',
      forwards: 'forwards（終了時の状態を保持）',
      backwards: 'backwards（遅延中も開始時の状態）',
      both: 'both（両方）',
    },
    easingHeading: 'イージング（animation-timing-function）',
    easingLabel: 'イージングの種類',
    easingNames: {
      ease: 'ease',
      linear: 'linear',
      'ease-in': 'ease-in',
      'ease-out': 'ease-out',
      'ease-in-out': 'ease-in-out',
      'ease-out-back': 'ease-out-back（行き過ぎて戻る）',
      'ease-in-out-back': 'ease-in-out-back（溜めて行き過ぎる）',
      'ease-out-expo': 'ease-out-expo（急加速して減速）',
      'ease-in-out-cubic': 'ease-in-out-cubic（なめらか）',
      custom: 'カスタム（cubic-bezier）',
    },
    bezierX1Label: 'x1（0〜1）',
    bezierY1Label: 'y1',
    bezierX2Label: 'x2（0〜1）',
    bezierY2Label: 'y2',
    curveLabel: 'イージングカーブ',
    reducedMotionLabel:
      'prefers-reduced-motion: reduce のとき、アニメーションを無効にする記述を含める',
    previewHeading: 'プレビュー',
    replayButton: '最初から再生',
    previewHint:
      'プレビューは設定を変更するたびに最初から再生されます。OSの「視差効果を減らす」設定にかかわらず再生されます。',
    cssHeading: '生成されたCSS',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      'このツールは@keyframesを使うanimationプロパティを生成します。ホバーなどの状態変化に使うtransitionの値（継続時間・イージング）としても、同じイージングとdurationの値を流用できます。',
      'cubic-bezierのx1・x2はCSSの仕様上0〜1に制限されます。y1・y2は範囲外の値にすると、動きが行き過ぎて戻る（オーバーシュート）表現になります。',
      'イージングは「キーフレームとキーフレームの間の区間ごと」に適用されます。複数のキーフレームがあるプリセットでは、アニメーション全体ではなく各区間で加速・減速します。',
      'transformやopacityのアニメーションはGPUで処理されやすく、滑らかに動きます。幅・高さ・位置（top/left）を動かすとレイアウトの再計算が発生し、重くなる場合があります。',
      'アニメーション名は英数字・ハイフン・アンダースコアのみ使用できます。数字始まりの名前や、noneなどのキーワードと同じ名前は自動で補正されます。',
      '前庭障害などで動きの多い表示が負担になる人のため、prefers-reduced-motionの記述を含めることをおすすめします。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '@keyframes',
        description:
          'アニメーションの途中経過（何%の時点でどんなスタイルにするか）を定義するCSSのルール。名前を付け、animation-nameから参照して使う。',
      },
      {
        term: 'animation-timing-function（イージング）',
        description:
          '時間の経過に対して変化がどう進むかを決める関数。ease・linearなどのキーワードか、cubic-bezier()で曲線を指定する。',
      },
      {
        term: 'cubic-bezier',
        description:
          '2つの制御点（x1,y1）（x2,y2）で加速・減速の曲線を表す関数。cubic-bezier(0.25, 0.1, 0.25, 1)がeaseに相当する。',
      },
      {
        term: 'animation-fill-mode',
        description:
          'アニメーションの開始前・終了後にスタイルを適用するか決める値。forwardsで終了時の状態を保持し、backwardsで遅延中も開始時の状態にする。',
      },
      {
        term: 'prefers-reduced-motion',
        description:
          'OSの「視差効果を減らす」「アニメーションを減らす」設定を検出するメディアクエリ。reduceのときだけアニメーションを止めるといった配慮に使う。',
      },
    ],
  },
  en: {
    title: 'CSS Animation Generator (@keyframes & Easing Editor)',
    description:
      'Build CSS @keyframes animations from presets like bounce, fade, and spin. Edit cubic-bezier easing, duration, and delay with live preview. Runs in-browser.',
    h1: 'CSS Animation Generator',
    introHtml:
      'Pick a preset such as bounce, fade, slide, or spin, then tune the duration, delay, iteration count, direction, fill-mode, and easing (<code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">cubic-bezier</code>). The preview and the <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">@keyframes</code> plus <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">animation</code> CSS update together. You can also include a <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">prefers-reduced-motion</code> block for visitors who want less motion. For depth effects, see the <a href="/en/tools/css-box-shadow-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">CSS Box-Shadow Generator</a>.',
    settingsHeading: 'Animation settings',
    presetLabel: 'Preset',
    presetNames: {
      'fade-in': 'Fade in',
      'fade-out': 'Fade out',
      'slide-in-left': 'Slide in from left',
      'slide-in-up': 'Slide in from below',
      'zoom-in': 'Zoom in',
      bounce: 'Bounce',
      pulse: 'Pulse (scale)',
      shake: 'Shake (horizontal)',
      swing: 'Swing (pendulum)',
      spin: 'Spin',
      flip: 'Flip (Y axis)',
    },
    nameLabel: 'Animation name (@keyframes name)',
    durationLabel: 'Duration (s)',
    delayLabel: 'Delay (s)',
    iterationsLabel: 'Iteration count',
    infiniteLabel: 'Repeat forever',
    directionLabel: 'Direction',
    directionNames: {
      normal: 'normal',
      reverse: 'reverse',
      alternate: 'alternate (back and forth)',
      'alternate-reverse': 'alternate-reverse',
    },
    fillModeLabel: 'Fill mode',
    fillModeNames: {
      none: 'none (revert to original)',
      forwards: 'forwards (keep the end state)',
      backwards: 'backwards (apply start state during delay)',
      both: 'both',
    },
    easingHeading: 'Easing (animation-timing-function)',
    easingLabel: 'Easing type',
    easingNames: {
      ease: 'ease',
      linear: 'linear',
      'ease-in': 'ease-in',
      'ease-out': 'ease-out',
      'ease-in-out': 'ease-in-out',
      'ease-out-back': 'ease-out-back (overshoot, then settle)',
      'ease-in-out-back': 'ease-in-out-back (wind up, overshoot)',
      'ease-out-expo': 'ease-out-expo (fast start, long tail)',
      'ease-in-out-cubic': 'ease-in-out-cubic (smooth)',
      custom: 'Custom (cubic-bezier)',
    },
    bezierX1Label: 'x1 (0–1)',
    bezierY1Label: 'y1',
    bezierX2Label: 'x2 (0–1)',
    bezierY2Label: 'y2',
    curveLabel: 'Easing curve',
    reducedMotionLabel:
      'Include a rule that disables the animation under prefers-reduced-motion: reduce',
    previewHeading: 'Preview',
    replayButton: 'Replay',
    previewHint:
      'The preview restarts whenever you change a setting. It plays even if your OS is set to reduce motion.',
    cssHeading: 'Generated CSS',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'This tool generates an animation that uses @keyframes. For hover-style state changes with transition, you can reuse the same duration and easing values.',
      'In cubic-bezier, x1 and x2 are limited to 0–1 by the CSS spec. Values of y1 and y2 outside 0–1 produce overshoot, where the motion goes past its target and settles back.',
      'Easing applies to each interval between keyframes, not to the whole animation. A preset with several keyframes therefore speeds up and slows down within every segment.',
      'Animating transform and opacity is usually smooth because browsers can handle it on the GPU. Animating width, height, or top/left forces layout recalculation and may feel heavy.',
      'Animation names can only contain letters, digits, hyphens, and underscores. Names that start with a digit or collide with keywords such as none are corrected automatically.',
      'For visitors with vestibular disorders or motion sensitivity, including the prefers-reduced-motion block is recommended.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: '@keyframes',
        description:
          'A CSS rule that defines the intermediate steps of an animation (which styles apply at which percentage). It is named and referenced through animation-name.',
      },
      {
        term: 'animation-timing-function (easing)',
        description:
          'The function that controls how progress advances over time. It is either a keyword such as ease or linear, or a curve written with cubic-bezier().',
      },
      {
        term: 'cubic-bezier',
        description:
          'A function that describes an acceleration curve with two control points (x1, y1) and (x2, y2). cubic-bezier(0.25, 0.1, 0.25, 1) is equivalent to ease.',
      },
      {
        term: 'animation-fill-mode',
        description:
          'Controls whether styles apply before the animation starts and after it ends. forwards keeps the end state; backwards applies the start state during the delay.',
      },
      {
        term: 'prefers-reduced-motion',
        description:
          'A media query that detects the OS setting for reduced motion. It lets you turn animations off only for people who asked for less movement.',
      },
    ],
  },
};
