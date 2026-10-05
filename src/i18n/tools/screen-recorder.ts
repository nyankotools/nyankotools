import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ScreenRecorderPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  audioLabel: string;
  audioHint: string;
  startLabel: string;
  stopLabel: string;
  idleMessage: string;
  recording: string;
  /** {max} を置換する */
  limitNote: string;
  previewHeading: string;
  playbackAriaLabel: string;
  downloadLabel: string;
  discardLabel: string;
  /** {size} を置換する */
  sizeInfo: string;
  autoStopped: string;
  recorderUnsupported: string;
  errors: {
    cancelled: string;
    unsupported: string;
    insecure: string;
    unknown: string;
  };
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const screenRecorderContent: Record<Locale, ScreenRecorderPageContent> =
  {
    ja: {
      title: '画面録画（ブラウザだけで画面を録画・保存）',
      description:
        '画面全体・ウィンドウ・ブラウザのタブをブラウザだけで録画して、動画ファイルとして保存できる無料ツールです。ソフトのインストールは不要。録画データはブラウザ内で処理され、サーバーには送信されません。',
      h1: '画面録画',
      introHtml:
        '画面全体・アプリのウィンドウ・ブラウザのタブのいずれかを選んで録画し、動画ファイル（WebM）として保存できます。操作手順の記録や不具合の再現動画づくりに便利です。録画データはこのページの外には出ません。音声を確認したいときは <a href="/tools/mic-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">マイクテスト</a> もご利用ください。',
      audioLabel: '音声も録音する',
      audioHint:
        'タブの音声やシステム音声を録音します。共有ダイアログで「音声を共有」にチェックが必要です（ブラウザ・OSによっては録音できません）。マイクの音声は録音されません。',
      startLabel: '録画を開始',
      stopLabel: '録画を停止',
      idleMessage:
        '「録画を開始」を押すと、ブラウザが録画する画面・ウィンドウ・タブの選択画面を表示します。',
      recording: '録画中',
      limitNote:
        '録画は最大{max}分で自動的に停止します（メモリに溜め続けないための上限です）。',
      previewHeading: '録画したビデオ',
      playbackAriaLabel: '録画した動画のプレビュー',
      downloadLabel: '動画をダウンロード',
      discardLabel: '破棄する',
      sizeInfo: 'ファイルサイズ: {size}',
      autoStopped: '上限の時間に達したため、録画を自動で停止しました。',
      recorderUnsupported:
        'このブラウザは録画（MediaRecorder）に対応していません。',
      errors: {
        cancelled:
          '画面の共有が許可されなかったか、キャンセルされました。もう一度「録画を開始」を押して、録画する画面を選んでください。',
        unsupported:
          'このブラウザ・端末は画面録画に対応していません。PC版のChrome・Edge・Firefox・Safariなどをお試しください（スマートフォンの多くは非対応です）。',
        insecure:
          '画面録画はHTTPSで開いたページでのみ使えます。URLがhttps://で始まっているか確認してください。',
        unknown:
          '画面録画を開始できませんでした。ページを再読み込みして、もう一度お試しください。',
      },
      howToHeading: '使い方',
      howToSteps: [
        '音声も残したい場合は「音声も録音する」にチェックを入れます。',
        '「録画を開始」を押し、ブラウザの選択画面で録画する画面・ウィンドウ・タブを選びます。',
        '終わったら「録画を停止」を押します（ブラウザ側の共有停止ボタンでも止まります）。',
        'プレビューで確認して「動画をダウンロード」で保存します。',
      ],
      notesHeading: '注意事項',
      notes: [
        '画面に表示されているものがそのまま録画されます。パスワード・通知・個人情報が映り込まないよう、録画前に確認してください。',
        '保存形式はブラウザによって異なります（Chrome・EdgeはWebM、SafariはMP4）。WebMが再生できないソフトでは、動画変換ツールで変換してください。',
        '録画データはメモリに保存されるため、最大30分までです。長時間の録画には向きません。',
        'スマートフォンのブラウザは、画面録画に対応していないことが多いです。',
        'ブラウザの共有ダイアログに「音声を共有」が表示されない場合、その画面の種類では音声は録音できません。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'WebM',
          description:
            'Web向けの動画形式です。Chrome・Edge・Firefoxで標準的な録画形式で、ブラウザやVLCなどで再生できます。',
        },
        {
          term: 'タブ録画・ウィンドウ録画・画面全体の録画',
          description:
            'ブラウザの共有ダイアログで選べる録画範囲です。タブ録画では、そのタブの音声も一緒に録音できます。',
        },
      ],
    },
    en: {
      title: 'Screen Recorder (Record Your Screen in the Browser)',
      description:
        'Record your screen, a window or a browser tab in the browser and save a video file. Nothing to install; recordings never leave your browser.',
      h1: 'Screen Recorder',
      introHtml:
        'Pick your whole screen, an app window or a browser tab, record it, and save the result as a video file (WebM). Handy for documenting steps or reproducing a bug. The recording never leaves this page. To check your audio input, try the <a href="/en/tools/mic-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Microphone Test</a>.',
      audioLabel: 'Record audio too',
      audioHint:
        'Records tab or system audio. You must tick "Share audio" in the sharing dialog (some browsers and operating systems cannot capture it). Your microphone is not recorded.',
      startLabel: 'Start recording',
      stopLabel: 'Stop recording',
      idleMessage:
        'Press "Start recording" and your browser will ask which screen, window or tab to record.',
      recording: 'Recording',
      limitNote:
        'Recording stops automatically after {max} minutes (a cap so memory does not fill up).',
      previewHeading: 'Your recording',
      playbackAriaLabel: 'Preview of the recorded video',
      downloadLabel: 'Download video',
      discardLabel: 'Discard',
      sizeInfo: 'File size: {size}',
      autoStopped:
        'Recording stopped automatically because it reached the time limit.',
      recorderUnsupported:
        'This browser does not support recording (MediaRecorder).',
      errors: {
        cancelled:
          'Screen sharing was denied or cancelled. Press "Start recording" again and choose what to record.',
        unsupported:
          'This browser or device does not support screen recording. Try desktop Chrome, Edge, Firefox or Safari (most phones are not supported).',
        insecure:
          'Screen recording only works on pages opened over HTTPS. Check that the URL starts with https://.',
        unknown:
          'Could not start screen recording. Reload the page and try again.',
      },
      howToHeading: 'How to use',
      howToSteps: [
        'Tick "Record audio too" if you want sound.',
        'Press "Start recording", then choose a screen, window or tab in your browser’s picker.',
        'Press "Stop recording" when you are done (the browser’s own stop-sharing button works too).',
        'Check the preview, then press "Download video" to save it.',
      ],
      notesHeading: 'Notes',
      notes: [
        'Whatever is on screen is recorded as is. Check that passwords, notifications and personal information are not visible before you start.',
        'The saved format depends on the browser (WebM in Chrome and Edge, MP4 in Safari). If your player cannot open WebM, convert it with a video converter.',
        'The recording is kept in memory, so it is limited to 30 minutes. It is not meant for long sessions.',
        'Browsers on phones often do not support screen recording.',
        'If the sharing dialog has no "Share audio" option, audio cannot be captured for that kind of source.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'WebM',
          description:
            'A video format for the web. It is the standard recording format in Chrome, Edge and Firefox and plays in browsers and players such as VLC.',
        },
        {
          term: 'Tab, window and full-screen capture',
          description:
            'The recording areas you can choose in the browser’s sharing dialog. Tab capture can include that tab’s audio.',
        },
      ],
    },
  };
