import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface MosaicSmootherPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  /** `{width}` `{height}` `{size}` を置換 */
  sourceInfoTemplate: string;
  autoBlockLabel: string;
  autoBlockHint: string;
  blockSizeLabel: string;
  influenceLabel: string;
  influenceHint: string;
  grainLabel: string;
  grainHint: string;
  /** `{value}` を置換 */
  pxValueTemplate: string;
  percentValueTemplate: string;
  canvasLabel: string;
  canvasHint: string;
  touchModeLabel: string;
  touchModeSelect: string;
  touchModeScroll: string;
  touchModeHint: string;
  /** `{count}` を置換 */
  regionCountTemplate: string;
  /** `{size}` を置換 */
  detectedTemplate: string;
  detectedNone: string;
  undoButton: string;
  resetButton: string;
  formatLabel: string;
  downloadButton: string;
  clearButton: string;
  errorUnsupportedFile: string;
  errorLoadFailed: string;
  errorExportFailed: string;
  /** `{max}` を置換 */
  errorFileTooLargeTemplate: string;
  /** `{max}` を置換(百万画素) */
  errorTooManyPixelsTemplate: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const mosaicSmootherContent: Record<Locale, MosaicSmootherPageContent> =
  {
    ja: {
      title: 'モザイクを自然な色面に置き換え｜周囲の色となじませる無料ツール',
      description:
        '画像のモザイク部分を、周囲の色とモザイクの色から作った滑らかな色の変化に置き換える無料ツールです。ブロックサイズは自動検出。スライドや素材のモザイク跡の整形に。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: 'モザイクを自然な色の変化に置き換えるツール',
      introHtml:
        '画像のモザイクをドラッグで囲むと、ブロックの色と周囲の色をなめらかにつないだ色の面に置き換えます。スライドや素材画像に残ったモザイクを目立たなくしたいときに使えます。<strong>隠されていた元の絵を復元するツールではありません</strong>（モザイクで失われた情報は戻せません）。画像はアップロードされず、すべてブラウザ内で処理されます。モザイクやぼかしをかけたい場合は<a href="/tools/image-blur-mosaic/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像モザイク・ぼかしツール</a>をご利用ください。',
      dropLabel: '画像ファイルを選択',
      dropHint: 'ここに画像ファイルをドラッグ＆ドロップすることもできます',
      sourceInfoTemplate: '元画像: {width}×{height}px（{size}）',
      autoBlockLabel: 'ブロックサイズを自動検出する',
      autoBlockHint:
        'モザイクのブロックの大きさと位置を、範囲内の色の境目から推定します。うまく検出できないときはオフにして手動で指定してください。',
      blockSizeLabel: 'ブロックサイズ',
      influenceLabel: 'モザイクの色の反映度',
      influenceHint:
        '大きいほどモザイクの色の動きを残します。小さいほど周囲の色だけで滑らかに埋めます。',
      grainLabel: '粒状感（ノイズ）',
      grainHint:
        '周囲の画像のノイズ量に合わせた粒状感を加えます。0%だと塗ったようになめらかになります。',
      pxValueTemplate: '{value}px',
      percentValueTemplate: '{value}%',
      canvasLabel: '編集中の画像（モザイク部分をドラッグで囲む）',
      canvasHint:
        'モザイクの部分を、少し大きめにドラッグ（スマホは指でなぞる）して囲むと、その範囲が置き換わります。',
      touchModeLabel: 'スマホでの操作',
      touchModeSelect: '範囲を選択',
      touchModeScroll: 'スクロール',
      touchModeHint:
        '「範囲を選択」中は画像の上で指をなぞると範囲を指定でき、ページはスクロールしません。スクロールしたいときは「スクロール」に切り替えてください。',
      regionCountTemplate: '置き換えた範囲: {count}件',
      detectedTemplate: '直前の範囲: ブロックサイズ {size}px を検出して適用',
      detectedNone:
        '直前の範囲: モザイクのブロックを検出できなかったため、周囲の色だけで補間しました',
      undoButton: '1つ元に戻す',
      resetButton: 'すべてリセット',
      formatLabel: '保存形式',
      downloadButton: '加工した画像をダウンロード',
      clearButton: '画像をクリア',
      errorUnsupportedFile:
        '対応していないファイル形式です（PNG/JPEG/WebP/GIF/BMPのみ読み込めます）',
      errorLoadFailed:
        '画像を読み込めませんでした。ファイルが破損している可能性があります。',
      errorExportFailed:
        '画像の書き出しに失敗しました。別の保存形式をお試しください。',
      errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
      errorTooManyPixelsTemplate:
        '画像が大きすぎます（上限は約{max}百万画素です）。縮小してからお試しください。',
      notesHeading: '注意点',
      notes: [
        'このツールは、モザイクで隠された元の内容を復元するものではありません。モザイクの色と周囲の色から、それらしいなめらかな色の変化を作って置き換えるだけです。',
        '空・壁・肌・グラデーション背景のような、色がなだらかに変わる場所で自然に仕上がります。模様や文字が細かい背景、顔や文字そのものは再現できず、ぼんやりした色の面になります。',
        'モザイクの範囲は、全体が入るように少し大きめに囲んでください。範囲が小さいと、外側に残ったブロックが周囲の色として扱われ、跡が残ります。',
        'ブロックサイズの自動検出は、ブロックの境目がはっきりした画像で働きます。JPEG圧縮でにじんでいる場合や、範囲にモザイクでない部分が多く含まれる場合は、手動で指定してください。',
        '範囲が大きいほど、置き換わった部分がのっぺりして見えます。粒状感を上げると周囲の質感になじみやすくなります。',
        '他人の画像から個人情報や内容を読み取る目的や、修正（検閲）処理を外す目的での利用はおやめください。',
        'ファイル名や撮影位置などのメタデータ（EXIF）は、書き出し時に再エンコードされるため引き継がれません。GIFは先頭フレームのみが対象です。',
        'すべての処理はブラウザ内で完結し、選択した画像がサーバーに送信されることはありません。',
      ],
      howToHeading: '使い方',
      howToSteps: [
        '画像ファイルを選択します（ドラッグ＆ドロップも可能です）。',
        '必要なら「ブロックサイズを自動検出する」「モザイクの色の反映度」「粒状感（ノイズ）」を調整します。',
        '画像のモザイク部分を、少し大きめにドラッグで囲みます。複数の範囲を続けて指定でき、間違えたら「1つ元に戻す」を押します。',
        '保存形式を選んで、加工した画像をダウンロードします。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'モザイクのブロック',
          description:
            'モザイクを構成する、同じ色で塗られた正方形の小さな区画。1辺の長さ（ブロックサイズ）が大きいほど粗いモザイクになります。',
        },
        {
          term: '補間',
          description:
            '分かっている点の色から、間の色を滑らかにつないで求めること。このツールでは範囲の外側の色を境界として、内側を埋めています。',
        },
        {
          term: '粒状感（ノイズ）',
          description:
            '写真に含まれる細かなざらつき。補間しただけの部分は不自然になめらかなので、周囲と同程度のざらつきを足してなじませます。',
        },
      ],
    },
    en: {
      title: 'Replace Mosaic with a Smooth Color Blend (Free, In-Browser)',
      description:
        'Replace a mosaic area with a smooth color blend built from its blocks and the surrounding pixels. Auto-detects block size. Runs in your browser.',
      h1: 'Mosaic to Smooth Gradient Tool',
      introHtml:
        'Drag a box around a mosaic and it is replaced with a smooth patch of color that blends the block colors with the surrounding pixels. It is useful for tidying leftover pixelation in slides or stock images. <strong>It does not recover the hidden original</strong>: whatever the mosaic destroyed stays gone. Your image is never uploaded; everything happens in your browser. To add mosaic or blur instead, use the <a href="/en/tools/image-blur-mosaic/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Blur & Mosaic tool</a>.',
      dropLabel: 'Choose an image file',
      dropHint: 'You can also drag and drop an image file here',
      sourceInfoTemplate: 'Original: {width}×{height}px ({size})',
      autoBlockLabel: 'Auto-detect block size',
      autoBlockHint:
        'Estimates the size and position of the mosaic blocks from color edges inside the selection. Turn it off and set the size yourself if detection fails.',
      blockSizeLabel: 'Block size',
      influenceLabel: 'Mosaic color influence',
      influenceHint:
        'Higher keeps more of the color variation from the mosaic. Lower fills smoothly from the surrounding colors only.',
      grainLabel: 'Grain (noise)',
      grainHint:
        'Adds grain that matches the noise level of the surrounding image. At 0% the patch looks painted and perfectly smooth.',
      pxValueTemplate: '{value}px',
      percentValueTemplate: '{value}%',
      canvasLabel: 'Image being edited (drag around the mosaic)',
      canvasHint:
        'Drag a box slightly larger than the mosaic (or swipe with your finger on a phone) to replace that area.',
      touchModeLabel: 'Touch mode',
      touchModeSelect: 'Select area',
      touchModeScroll: 'Scroll',
      touchModeHint:
        'In Select area mode, swiping on the image selects an area and the page will not scroll. Switch to Scroll to move the page.',
      regionCountTemplate: 'Areas replaced: {count}',
      detectedTemplate: 'Last area: detected {size}px blocks and applied them',
      detectedNone:
        'Last area: no mosaic blocks were detected, so it was filled from the surrounding colors only',
      undoButton: 'Undo last',
      resetButton: 'Reset all',
      formatLabel: 'Save as',
      downloadButton: 'Download edited image',
      clearButton: 'Clear image',
      errorUnsupportedFile:
        'Unsupported file type (only PNG, JPEG, WebP, GIF, and BMP can be opened)',
      errorLoadFailed: 'Could not load the image. The file may be corrupted.',
      errorExportFailed:
        'Could not export the image. Try a different save format.',
      errorFileTooLargeTemplate: 'This file exceeds the size limit ({max})',
      errorTooManyPixelsTemplate:
        'This image is too large (limit: about {max} megapixels). Please shrink it first.',
      notesHeading: 'Notes',
      notes: [
        'This tool does not recover what a mosaic hid. It only builds a plausible smooth color transition from the mosaic colors and the surrounding pixels and swaps it in.',
        'It works best where color changes gently: sky, walls, skin, gradient backgrounds. Fine patterns, text, and faces cannot be reproduced and become soft blobs of color.',
        'Select a little more than the whole mosaic. If the box is too small, leftover blocks outside it are treated as surrounding color and a trace remains.',
        'Auto-detection works when block edges are crisp. If JPEG compression has smeared them, or the box contains a lot of non-mosaic area, set the block size manually.',
        'The larger the area, the flatter the replacement looks. Raising the grain helps it blend with the surrounding texture.',
        'Please do not use it to read personal information or content from other people’s images, or to strip censorship from images.',
        'Metadata such as EXIF (camera info, GPS location) is dropped because the image is re-encoded on export. For GIFs, only the first frame is used.',
        'All processing happens in your browser — the image you select is never sent to a server.',
      ],
      howToHeading: 'How to use',
      howToSteps: [
        'Choose an image file (drag & drop also works).',
        'If needed, adjust "Auto-detect block size", "Mosaic color influence" and "Grain (noise)".',
        'Drag a box slightly larger than the mosaic. You can mark several areas in a row; press "Undo last" if you make a mistake.',
        'Choose a save format and download the edited image.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Mosaic block',
          description:
            'One of the small single-color squares that make up a mosaic. The longer its side (the block size), the coarser the mosaic.',
        },
        {
          term: 'Interpolation',
          description:
            'Estimating the colors in between from known points by blending smoothly. Here, the colors just outside the selection act as the boundary and the inside is filled in.',
        },
        {
          term: 'Grain (noise)',
          description:
            'The fine roughness in a photo. A purely interpolated patch looks unnaturally smooth, so grain at the surrounding level is added to blend it in.',
        },
      ],
    },
  };
