import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '入力したテキストはサーバーに送信されますか？',
      answer:
        '送信されません。このツールは端末に内蔵されたローカル音声だけを使い、テキストが外部に送られる可能性のあるクラウド音声（ChromeのGoogle音声、EdgeのOnline音声など）は一覧に表示せず、選べないようにしています。',
    },
    {
      question: '声の一覧が空、または日本語の声が出ないのはなぜですか？',
      answer:
        '使える声は端末・OS・ブラウザごとに異なります。クラウド音声しか持たない環境（一部のAndroidなど）では、ローカル音声が無いため読み上げできません。OSの設定で日本語の音声を追加するか、別のブラウザでお試しください。',
    },
    {
      question: '読み上げた音声をMP3やWAVで保存できますか？',
      answer:
        'できません。ブラウザの音声合成は、読み上げた音声のデータを取り出す手段を提供していないためです。保存が必要な場合は、OSの録音機能などを別途ご利用ください。',
    },
    {
      question: '長い文章が途中で止まることはありますか？',
      answer:
        'ブラウザによっては長い発話が途中で止まる不具合があるため、文の区切りごとに分けて順番に読み上げています。それでも止まる場合は、テキストを短く分けて試してください。',
    },
  ],
  en: [
    {
      question: 'Is my text sent to a server?',
      answer:
        'No. This tool uses only local voices built into your device. Cloud voices that may send text to an external server (such as Chrome’s Google voices or Edge’s Online voices) are hidden and cannot be selected.',
    },
    {
      question:
        'Why is the voice list empty, or why is there no voice for my language?',
      answer:
        'Available voices differ by device, OS and browser. On environments that only provide cloud voices (some Android devices, for example), there is no local voice, so nothing can be read aloud. Add a voice in your OS settings or try another browser.',
    },
    {
      question: 'Can I save the spoken audio as MP3 or WAV?',
      answer:
        'No. Browser speech synthesis does not let a page capture the audio it produces. If you need a recording, use your OS’s audio recording feature separately.',
    },
    {
      question: 'Can long text stop partway through?',
      answer:
        'Some browsers stop long utterances midway, so the text is split into sentences and read one after another. If it still stops, try splitting the text into shorter parts.',
    },
  ],
};
