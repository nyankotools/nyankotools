import type { Locale } from '../../data/tools';

export interface NoteFrequencyConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  a4Label: string;
  a4PresetsLabel: string;
  accidentalLabel: string;
  accidentalSharp: string;
  accidentalFlat: string;
  noteLabel: string;
  noteHint: string;
  midiLabel: string;
  frequencyLabel: string;
  resultHeading: string;
  /** `{note}` `{cents}` `{nearest}` を置換する */
  resultFormat: string;
  invalidNote: string;
  invalidMidi: string;
  invalidFrequency: string;
  copyFrequencyLabel: string;
  copiedMessage: string;
  copyFailedMessage: string;
  tableHeading: string;
  tableHint: string;
  tableOctaveColumn: string;
  tableScrollLabel: string;
  /** `{label}` `{value}` を置換する */
  copyCellLabel: string;
  copyTableLabel: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const noteFrequencyConverterContent: Record<
  Locale,
  NoteFrequencyConverterPageContent
> = {
  ja: {
    title: '音名⇔周波数変換（Hz・MIDI・セント）',
    description:
      '音名（C4・A4など）、MIDIノート番号、周波数（Hz）を平均律で相互変換。基準ピッチ（A4=440Hzなど）を変更でき、セントのずれや全音域の周波数一覧表も表示。計算はブラウザ内で行われ、サーバーには送信されません。',
    h1: '音名・MIDIノート番号・周波数（Hz）の相互変換',
    introHtml:
      '音名、MIDIノート番号、周波数（Hz）のどれか1つを入力すると、残りを平均律で計算します。基準ピッチ（A4）は440Hzのほか、442Hzや432Hzなどにも変更できます。周波数から入力すると、最も近い音名と、そこからのずれ（セント）も分かります。マイクで音程を確かめるなら<a href="/tools/instrument-tuner/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">楽器チューナー</a>もご利用ください。計算はこのページ内で行われ、外部には送信されません。',
    a4Label: '基準ピッチ A4（Hz）',
    a4PresetsLabel: 'よく使う基準ピッチ',
    accidentalLabel: '黒鍵の表記',
    accidentalSharp: 'シャープ（C#）',
    accidentalFlat: 'フラット（Db）',
    noteLabel: '音名（例: C#4、Bb3）',
    noteHint: 'C4が中央のドです。オクターブは -1〜9、#・b・♯・♭が使えます。',
    midiLabel: 'MIDIノート番号（0〜127）',
    frequencyLabel: '周波数（Hz）',
    resultHeading: '変換結果',
    resultFormat:
      '最も近い音: {note}（{cents} セント）／ その音の周波数: {nearest} Hz',
    invalidNote:
      '音名を読み取れません。C4、F#3、Bb2 のように入力してください。',
    invalidMidi: 'MIDIノート番号は 0〜127 の数値で入力してください。',
    invalidFrequency: '周波数は 1〜30000 Hz の数値で入力してください。',
    copyFrequencyLabel: '周波数をコピー',
    copiedMessage: 'コピーしました',
    copyFailedMessage: 'コピーできませんでした',
    tableHeading: '音名と周波数の一覧表',
    tableHint:
      '現在の基準ピッチで計算した、C0〜B8 の周波数（Hz）です。値をクリックするとコピーします。',
    tableOctaveColumn: 'オクターブ',
    tableScrollLabel: '周波数の一覧表（横にスクロールできます）',
    copyCellLabel: '{label}: {value} Hz をコピー',
    copyTableLabel: '表をコピー',
    howToHeading: '使い方',
    howToSteps: [
      '必要なら「基準ピッチ A4（Hz）」を変えます。ふつうは440Hz、オーケストラでは442Hzなどが使われます。',
      '「音名（例: C#4、Bb3）」「MIDIノート番号（0〜127）」「周波数（Hz）」のどれかに入力します。残りの欄が自動で更新されます。',
      '「変換結果」で、最も近い音名と基準からのずれ（セント）を確認します。',
      '音域全体の周波数が必要なときは「音名と周波数の一覧表」から値をクリックしてコピーします。',
    ],
    notesHeading: '注意事項',
    notes: [
      '12平均律（1オクターブを12等分した音律）で計算しています。純正律など他の音律とは周波数が異なります。',
      'オクターブは科学的ピッチ表記（C4 = 中央のド = MIDI 60）です。ソフトによってはC3を中央のドとするため、1オクターブずれて見えることがあります。',
      '周波数は小数第2位までに丸めて表示しています。内部の計算は丸めずに行っています。',
      '音名は MIDI 0〜127（C-1〜G9）の範囲で受け付けます。周波数は 1〜30000 Hz です。',
      '周波数から入力した場合、音名の欄は最も近い音を表示し、MIDIノート番号の欄は小数も含めて表示します。音名とのずれは「変換結果」のセントで確認できます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '平均律',
        description:
          '1オクターブ（周波数2倍）を12等分し、隣り合う半音の周波数比をすべて同じ（2の12乗根、約1.0595倍）にした音律です。どの調でも同じように演奏でき、現在のピアノや電子楽器の標準です。',
      },
      {
        term: 'セント',
        description:
          '音程の差を表す単位で、半音が100セント、1オクターブが1200セントです。±5セント程度なら、多くの人はずれを聞き分けられません。',
      },
      {
        term: '基準ピッチ（A4）',
        description:
          'チューニングの基準になる、中央のドの上のラの周波数です。国際標準は440Hzで、オーケストラでは442Hz前後、バロック音楽では415Hz前後が使われます。',
      },
      {
        term: 'MIDIノート番号',
        description:
          '音の高さを0〜127の整数で表す番号です。中央のド（C4）が60、A4が69で、1増えるごとに半音上がります。',
      },
      {
        term: '科学的ピッチ表記',
        description:
          '音名にオクターブ番号を添える表記（C4、A#3など）です。C4を中央のドとし、オクターブはCから次のBまでの区切りで数えます。',
      },
    ],
  },
  en: {
    title: 'Note Name to Frequency Converter (Hz, MIDI, Cents)',
    description:
      'Convert note names, MIDI note numbers and frequencies in Hz in equal temperament. Change the A4 reference pitch, see cents offsets and a full frequency table.',
    h1: 'Note Name, MIDI Number and Frequency (Hz) Converter',
    introHtml:
      'Enter any one of a note name, a MIDI note number or a frequency in hertz and the other two are calculated in 12-tone equal temperament. The A4 reference pitch is 440 Hz by default and can be changed to 442 Hz, 432 Hz and so on. Start from a frequency to also see the nearest note and how many cents off it is. To check a pitch with your microphone, try the <a href="/en/tools/instrument-tuner/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Instrument Tuner</a>. Everything is calculated on this page and nothing is sent anywhere.',
    a4Label: 'Reference pitch A4 (Hz)',
    a4PresetsLabel: 'Common reference pitches',
    accidentalLabel: 'Black key spelling',
    accidentalSharp: 'Sharps (C#)',
    accidentalFlat: 'Flats (Db)',
    noteLabel: 'Note name (e.g. C#4, Bb3)',
    noteHint:
      'C4 is middle C. Octaves run from -1 to 9, and #, b, ♯ and ♭ are accepted.',
    midiLabel: 'MIDI note number (0-127)',
    frequencyLabel: 'Frequency (Hz)',
    resultHeading: 'Result',
    resultFormat:
      'Nearest note: {note} ({cents} cents) / its frequency: {nearest} Hz',
    invalidNote:
      'Could not read the note name. Use a form like C4, F#3 or Bb2.',
    invalidMidi: 'Enter a MIDI note number between 0 and 127.',
    invalidFrequency: 'Enter a frequency between 1 and 30000 Hz.',
    copyFrequencyLabel: 'Copy frequency',
    copiedMessage: 'Copied',
    copyFailedMessage: 'Could not copy',
    tableHeading: 'Note frequency table',
    tableHint:
      'Frequencies in Hz from C0 to B8 at the current reference pitch. Click a value to copy it.',
    tableOctaveColumn: 'Octave',
    tableScrollLabel: 'Frequency table (scrolls horizontally)',
    copyCellLabel: 'Copy {label}: {value} Hz',
    copyTableLabel: 'Copy table',
    howToHeading: 'How to use',
    howToSteps: [
      'If needed, change "Reference pitch A4 (Hz)". It is usually 440 Hz, and orchestras often use 442 Hz.',
      'Type into any one of "Note name (e.g. C#4, Bb3)", "MIDI note number (0-127)" or "Frequency (Hz)". The other fields update automatically.',
      'Check the nearest note and its offset in cents under "Result".',
      'For frequencies across the whole range, click a value in "Note frequency table" to copy it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Values use 12-tone equal temperament, which splits the octave into 12 equal steps. Other tunings, such as just intonation, give different frequencies.',
      'Octave numbers follow scientific pitch notation (C4 = middle C = MIDI 60). Some software calls middle C C3, so octaves can look shifted by one.',
      'Frequencies are shown to two decimal places. The calculation itself is not rounded.',
      'Note names are accepted for MIDI 0 to 127 (C-1 to G9), and frequencies from 1 to 30000 Hz.',
      'When you start from a frequency, the note name field shows the nearest note and the MIDI field shows the fractional value. The offset from that note is shown in cents under "Result".',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Equal temperament',
        description:
          'A tuning that divides the octave (a doubling of frequency) into 12 equal semitones, each a ratio of the 12th root of 2, about 1.0595. Every key sounds the same, and it is the standard for pianos and electronic instruments.',
      },
      {
        term: 'Cent',
        description:
          'A unit for pitch differences: a semitone is 100 cents and an octave is 1200 cents. Most listeners cannot hear an offset of about 5 cents.',
      },
      {
        term: 'Reference pitch (A4)',
        description:
          'The frequency of the A above middle C that all tuning is based on. The international standard is 440 Hz, orchestras often use around 442 Hz, and Baroque music around 415 Hz.',
      },
      {
        term: 'MIDI note number',
        description:
          'An integer from 0 to 127 that names a pitch. Middle C (C4) is 60 and A4 is 69, and each step up is one semitone.',
      },
      {
        term: 'Scientific pitch notation',
        description:
          'A way of writing a note with an octave number, such as C4 or A#3. C4 is middle C, and the octave number changes at each C.',
      },
    ],
  },
};
