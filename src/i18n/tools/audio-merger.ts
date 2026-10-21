import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface AudioMergerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  dropLabel: string;
  dropHint: string;
  listHeading: string;
  listEmpty: string;
  /** `{duration}` `{channels}` を置換して使うテンプレート */
  itemInfoTemplate: string;
  /** `{name}` を置換して使うテンプレート */
  moveUpAria: string;
  moveDownAria: string;
  removeAria: string;
  moveUpButton: string;
  moveDownButton: string;
  removeButton: string;
  /** `{count}` `{duration}` を置換して使うテンプレート */
  summaryTemplate: string;
  transitionLabel: string;
  transitionGap: string;
  transitionCrossfade: string;
  gapLabel: string;
  gapHint: string;
  crossfadeLabel: string;
  crossfadeHint: string;
  fadeInLabel: string;
  fadeOutLabel: string;
  fadeHint: string;
  mergeButton: string;
  clearButton: string;
  processing: string;
  loading: string;
  resultsHeading: string;
  /** `{duration}` `{size}` `{rate}` を置換して使うテンプレート */
  resultInfoTemplate: string;
  downloadButton: string;
  errorUnsupportedFile: string;
  /** `{name}` を置換して使うテンプレート */
  errorDecodeTemplate: string;
  /** `{max}` を置換して使うテンプレート */
  errorFileTooLargeTemplate: string;
  /** `{max}` を置換して使うテンプレート */
  errorTooManyTemplate: string;
  errorTotalTooLong: string;
  errorGapInvalid: string;
  errorGapOutOfRange: string;
  errorCrossfadeInvalid: string;
  errorCrossfadeOutOfRange: string;
  errorFadeInInvalid: string;
  errorFadeInOutOfRange: string;
  errorFadeOutInvalid: string;
  errorFadeOutOutOfRange: string;
  errorFailed: string;
  notesHeading: string;
  notes: string[];
  howToHeading: string;
  howToSteps: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const audioMergerContent: Record<Locale, AudioMergerPageContent> = {
  ja: {
    title: '音声ファイル結合｜複数の音声を連結・フェード・WAV保存',
    description:
      '複数の音声ファイルを順番に連結し、クロスフェードや無音のすき間、フェードイン/アウトを付けてWAVで保存できる無料ツールです。並べ替えと試聴にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '音声ファイル結合・フェード（複数の音声をつなげてWAV保存）',
    introHtml:
      '複数の音声ファイルを選び、好きな順番に並べて1本につなげます。クリップ間にはすき間（無音）を入れるか、クロスフェードで滑らかにつなげるかを選べ、全体の先頭にフェードイン・末尾にフェードアウトも付けられます。結合結果はその場で試聴してWAVで保存できます。処理はすべてブラウザ内で行われ、ファイルは外部に送信されません。1本の音声の速度やキーを変えたいときは<a href="/tools/audio-speed-changer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">音声の速度・ピッチ変更</a>、MP3などへの変換は<a href="/tools/media-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">動画・音声変換</a>をご利用ください。',
    dropLabel: '音声ファイルを選択（複数可）',
    dropHint: 'ここにファイルをドラッグ＆ドロップして追加することもできます',
    listHeading: '結合する順番',
    listEmpty: 'まだファイルが追加されていません。',
    itemInfoTemplate: '{duration}・{channels}ch',
    moveUpAria: '{name} を上へ移動',
    moveDownAria: '{name} を下へ移動',
    removeAria: '{name} を削除',
    moveUpButton: '上へ',
    moveDownButton: '下へ',
    removeButton: '削除',
    summaryTemplate: '{count}ファイル・結合後の長さ（目安）{duration}',
    transitionLabel: 'クリップのつなぎ方',
    transitionGap: 'すき間（無音）を入れる',
    transitionCrossfade: 'クロスフェードで重ねる',
    gapLabel: 'すき間の長さ（秒）',
    gapHint: '0〜60。0ならすき間なしでそのままつなぎます。',
    crossfadeLabel: 'クロスフェードの長さ（秒）',
    crossfadeHint:
      '0〜30。前のクリップの終わりと次の始まりを重ねます。短いクリップでは、短い方の半分までに自動で制限されます。',
    fadeInLabel: '先頭のフェードイン（秒）',
    fadeOutLabel: '末尾のフェードアウト（秒）',
    fadeHint: '0〜60。0で無効です。結合後の音声全体の先頭と末尾に適用します。',
    mergeButton: '結合する',
    clearButton: 'すべて削除',
    processing: '結合中です。長い音声は少し時間がかかります…',
    loading: '読み込み中です…',
    resultsHeading: '結合結果',
    resultInfoTemplate: '出力: 長さ {duration}・{rate} Hz・WAV {size}',
    downloadButton: 'ダウンロード',
    errorUnsupportedFile: '音声ファイル以外は追加できません',
    errorDecodeTemplate:
      '「{name}」を読み込めませんでした。破損しているか、お使いのブラウザが対応していない形式の可能性があります。',
    errorFileTooLargeTemplate: 'ファイルサイズが上限（{max}）を超えています',
    errorTooManyTemplate: 'ファイルは最大{max}個までです',
    errorTotalTooLong: '結合後の長さが上限（10分）を超えてしまいます。',
    errorGapInvalid: 'すき間の長さは数値で入力してください（例: 0.5）',
    errorGapOutOfRange: 'すき間の長さは0〜60秒の範囲で指定してください',
    errorCrossfadeInvalid:
      'クロスフェードの長さは数値で入力してください（例: 2）',
    errorCrossfadeOutOfRange:
      'クロスフェードの長さは0〜30秒の範囲で指定してください',
    errorFadeInInvalid: 'フェードインは数値で入力してください（例: 1）',
    errorFadeInOutOfRange: 'フェードインは0〜60秒の範囲で指定してください',
    errorFadeOutInvalid: 'フェードアウトは数値で入力してください（例: 1）',
    errorFadeOutOutOfRange: 'フェードアウトは0〜60秒の範囲で指定してください',
    errorFailed: '結合に失敗しました。メモリが足りない可能性があります。',
    notesHeading: '注意点',
    notes: [
      '追加できるのは最大20ファイルで、結合後の長さの上限は10分、1ファイルのサイズ上限は50MBです。',
      'サンプルレートの異なるファイルは、ブラウザが読み込み時に共通のレート（48000 Hz）へ変換します。出力のWAVも48000 Hzになります。',
      'モノラルとステレオが混在している場合は、モノラルを左右に複製してステレオにそろえます。3チャンネル以上の音声は先頭の2チャンネル（左右）だけを使います。',
      'クロスフェードは、前のクリップが小さくなると同時に次のクリップが大きくなる等パワー方式です。両方の音が似ていると、重なり部分で少し音量が上がって聞こえることがあります。',
      '出力はWAV（16bit PCM）で、元の形式より容量が大きくなります。MP3などに圧縮したい場合は、保存したWAVを動画・音声変換ツールで変換してください。',
      '読み込めるのは、お使いのブラウザがデコードできる形式です（MP3・WAV・M4A・OGGなど）。',
      'すべての処理はブラウザ内で完結し、選択したファイルがサーバーに送信されることはありません。',
    ],
    howToHeading: '使い方',
    howToSteps: [
      '「音声ファイルを選択（複数可）」から結合したいファイルを追加します（ドラッグ＆ドロップも可能です）。',
      '「結合する順番」の「上へ」「下へ」「削除」で並び順を整えます。',
      '「クリップのつなぎ方」を選び、すき間やクロスフェードの秒数、フェードイン・フェードアウトの秒数を入力します。',
      '「結合する」を押して試聴し、問題なければ「ダウンロード」でWAVを保存します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'クロスフェード',
        description:
          '前の音を徐々に小さくしながら、次の音を徐々に大きくして重ねるつなぎ方。曲の切り替わりの違和感を減らせます。',
      },
      {
        term: 'フェードイン／フェードアウト',
        description:
          '音を無音から徐々に大きくする（イン）、または徐々に小さくして無音にする（アウト）処理。',
      },
      {
        term: 'サンプルレート',
        description:
          '1秒間に音を何回記録するかを表す数値（Hz）。値が大きいほど高い音まで記録できます。',
      },
      {
        term: 'WAV',
        description:
          '音声を圧縮せずに記録するファイル形式。音質は劣化しませんが、容量は大きくなります。',
      },
    ],
  },
  en: {
    title: 'Audio Merger – Join Audio Files with Fades Online',
    description:
      'Join several audio files into one. Reorder clips, add silence or crossfades between them, apply fade in/out, preview and save as WAV. Runs in your browser.',
    h1: 'Audio Merger: Join Audio Files with Crossfade and Fade In/Out',
    introHtml:
      'Pick several audio files, arrange them in the order you want and join them into a single track. Between clips you can insert a gap of silence or blend them with a crossfade, and you can also fade the whole track in at the start and out at the end. Listen to the result right away and save it as a WAV file. Everything runs in your browser, so your files are never uploaded. To change the speed or key of a single recording, use the <a href="/en/tools/audio-speed-changer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Audio Speed &amp; Pitch Changer</a>; to convert to MP3, use the <a href="/en/tools/media-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Video &amp; Audio Converter</a>.',
    dropLabel: 'Choose audio files (multiple allowed)',
    dropHint: 'You can also drag and drop files here to add them',
    listHeading: 'Merge order',
    listEmpty: 'No files added yet.',
    itemInfoTemplate: '{duration}, {channels} ch',
    moveUpAria: 'Move {name} up',
    moveDownAria: 'Move {name} down',
    removeAria: 'Remove {name}',
    moveUpButton: 'Up',
    moveDownButton: 'Down',
    removeButton: 'Remove',
    summaryTemplate: '{count} files, merged length (approx.) {duration}',
    transitionLabel: 'Join clips with',
    transitionGap: 'A gap of silence',
    transitionCrossfade: 'A crossfade (overlap)',
    gapLabel: 'Gap length (seconds)',
    gapHint: '0 to 60. With 0, clips are joined back to back.',
    crossfadeLabel: 'Crossfade length (seconds)',
    crossfadeHint:
      '0 to 30. The end of one clip overlaps the start of the next. For short clips it is automatically limited to half of the shorter clip.',
    fadeInLabel: 'Fade in at start (seconds)',
    fadeOutLabel: 'Fade out at end (seconds)',
    fadeHint:
      '0 to 60. 0 turns it off. Applied to the start and end of the whole merged track.',
    mergeButton: 'Merge',
    clearButton: 'Remove all',
    processing: 'Merging. Long recordings may take a moment…',
    loading: 'Loading files…',
    resultsHeading: 'Merged audio',
    resultInfoTemplate: 'Output: {duration}, {rate} Hz, WAV {size}',
    downloadButton: 'Download',
    errorUnsupportedFile: 'Only audio files can be added',
    errorDecodeTemplate:
      '"{name}" could not be read. It may be corrupted or in a format your browser cannot decode.',
    errorFileTooLargeTemplate: 'The file exceeds the size limit ({max})',
    errorTooManyTemplate: 'You can add up to {max} files',
    errorTotalTooLong: 'The merged length would exceed the 10-minute limit.',
    errorGapInvalid: 'Enter the gap length as a number (for example 0.5)',
    errorGapOutOfRange: 'Gap length must be between 0 and 60 seconds',
    errorCrossfadeInvalid:
      'Enter the crossfade length as a number (for example 2)',
    errorCrossfadeOutOfRange:
      'Crossfade length must be between 0 and 30 seconds',
    errorFadeInInvalid: 'Enter the fade in as a number (for example 1)',
    errorFadeInOutOfRange: 'Fade in must be between 0 and 60 seconds',
    errorFadeOutInvalid: 'Enter the fade out as a number (for example 1)',
    errorFadeOutOutOfRange: 'Fade out must be between 0 and 60 seconds',
    errorFailed: 'Merging failed. Your device may have run out of memory.',
    notesHeading: 'Notes',
    notes: [
      'You can add up to 20 files. The merged length is limited to 10 minutes and each file to 50 MB.',
      'Files with different sample rates are converted by your browser to one common rate (48000 Hz) when they are loaded, so the output WAV is 48000 Hz.',
      'When mono and stereo files are mixed, mono is copied to both channels. For audio with three or more channels, only the first two (left and right) are used.',
      'The crossfade is an equal-power one: the first clip fades down while the next fades up. If both sounds are similar, the overlap can sound slightly louder.',
      'The output is 16-bit PCM WAV, so it is larger than the originals. To compress it to MP3 or similar, run the saved WAV through the converter tool.',
      'Any format your browser can decode works (MP3, WAV, M4A, OGG and so on).',
      'All processing happens in your browser; the files you choose are never sent to a server.',
    ],
    howToHeading: 'How to use',
    howToSteps: [
      'Add the files you want to join with "Choose audio files (multiple allowed)" (drag and drop also works).',
      'Arrange the order in "Merge order" with "Up", "Down" and "Remove".',
      'Pick "Join clips with", then enter the gap or crossfade length and the fade in and fade out seconds.',
      'Press "Merge", listen to the result, and save the WAV with "Download".',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Crossfade',
        description:
          'A transition where the first sound gradually gets quieter while the next gets louder, overlapping the two. It softens the jump between tracks.',
      },
      {
        term: 'Fade in / fade out',
        description:
          'Gradually raising the volume from silence (fade in) or lowering it to silence (fade out).',
      },
      {
        term: 'Sample rate',
        description:
          'How many times per second the sound is recorded (in Hz). A higher rate can capture higher frequencies.',
      },
      {
        term: 'WAV',
        description:
          'A file format that stores audio uncompressed. There is no quality loss, but the files are large.',
      },
    ],
  },
};
