import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface PresetRow {
  umask: string;
  use: string;
}

export interface UmaskCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  umaskLabel: string;
  umaskPlaceholder: string;
  fileHeading: string;
  directoryHeading: string;
  octalLabel: string;
  symbolicLabel: string;
  commandLabel: string;
  symbolicOutputLabel: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  errorInvalidUmask: string;
  reverseHeading: string;
  reverseDescription: string;
  desiredLabel: string;
  desiredPlaceholder: string;
  kindLabel: string;
  kindFile: string;
  kindDirectory: string;
  reverseResultLabel: string;
  errorInvalidMode: string;
  unreachableMessage: string;
  presetsHeading: string;
  presetColumnUmask: string;
  presetColumnFile: string;
  presetColumnDirectory: string;
  presetColumnUse: string;
  presets: PresetRow[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const umaskCalculatorContent: Record<
  Locale,
  UmaskCalculatorPageContent
> = {
  ja: {
    title: 'umask計算機（022・002・077の実効パーミッションと逆算）',
    description:
      'umask値から新規ファイル（666基準）・ディレクトリ（777基準）の実効パーミッションをrwx表記と8進数で算出。欲しいパーミッションからumaskの逆算も可能。ブラウザ内で処理され、サーバーには送信されません。',
    h1: 'umask計算機',
    introHtml:
      'umask値（例: 022）を入力すると、新規ファイル（基準666）と新規ディレクトリ（基準777）に付くパーミッションを、8進数とrwx表記で表示します。逆に「ファイルを644にしたい」「ディレクトリを750にしたい」といった希望のパーミッションから、設定すべきumaskを逆算することもできます。既存ファイルのパーミッションを変換したい場合は <a href="/tools/chmod-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Chmodパーミッション計算機</a> をご利用ください。データはブラウザ内で処理され、サーバーには送信されません。',
    umaskLabel: 'umask値（8進数）',
    umaskPlaceholder: '022',
    fileHeading: '新規ファイル（基準 666）',
    directoryHeading: '新規ディレクトリ（基準 777）',
    octalLabel: '8進数',
    symbolicLabel: 'rwx表記',
    commandLabel: 'umaskコマンド',
    symbolicOutputLabel: 'umask -S の表示（ディレクトリ基準）',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorInvalidUmask:
      'umaskの形式が正しくありません（0〜7の数字で最大3桁。例: 022）',
    reverseHeading: 'umaskの逆算',
    reverseDescription:
      '欲しいパーミッションを入力すると、それを実現するumaskを求めます。',
    desiredLabel: '欲しいパーミッション（8進数）',
    desiredPlaceholder: '644',
    kindLabel: '対象の種類',
    kindFile: 'ファイル',
    kindDirectory: 'ディレクトリ',
    reverseResultLabel: '必要なumask',
    errorInvalidMode:
      'パーミッションの形式が正しくありません（0〜7の数字で3桁。例: 644）',
    unreachableMessage:
      '新規ファイルには実行権限(x)が付かないため、指定のx権限はumaskでは実現できません（chmodで付与してください）。得られるのは',
    presetsHeading: 'よく使うumask',
    presetColumnUmask: 'umask',
    presetColumnFile: 'ファイル',
    presetColumnDirectory: 'ディレクトリ',
    presetColumnUse: '用途',
    presets: [
      { umask: '022', use: '多くのLinuxの標準。自分だけが書き込める' },
      {
        umask: '002',
        use: 'グループで共同編集する場合（Debian/Ubuntuの一般ユーザー等）',
      },
      { umask: '027', use: 'グループは読み取りのみ、その他は一切不可' },
      { umask: '077', use: '自分以外には一切見せない（秘密鍵やサーバー用途）' },
      { umask: '000', use: '制限なし（非推奨）' },
    ],
    notesHeading: '注意事項',
    notes: [
      'ファイルの基準を666としているのは、通常のファイル作成では実行権限(x)が最初から付かないためです。umaskにxのビットが含まれていても、新規ファイルの結果は変わりません。',
      'umaskの入力は022のように3桁でも、22や0022のように桁数が異なっていても受け付けます。4桁の場合は先頭が0のものだけ有効です。',
      '実際の結果は、プログラムが指定する作成モード（例えば0600で作る場合）によっても変わります。ここでは一般的な基準（ファイル666・ディレクトリ777）での計算です。',
      'ACLが設定されたディレクトリでは、umaskではなくデフォルトACLが優先される場合があります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'umask',
        description:
          '新規に作成するファイルやディレクトリから、あらかじめ取り除く権限を指定する値です。基準のパーミッションからumaskのビットを引いたものが、実際に付与される権限になります。',
      },
      {
        term: '基準パーミッション（666・777）',
        description:
          '新規ファイルは実行権限なしの666（rw-rw-rw-）、新規ディレクトリは777（rwxrwxrwx）を出発点とし、そこからumaskで指定した権限を取り除きます。',
      },
      {
        term: '8進数とrwx表記',
        description:
          '読み取り=4・書き込み=2・実行=1を足した1桁を、所有者・グループ・その他の順に3桁並べたものが8進数です。rwx表記は同じ内容をr・w・xの9文字で表したものです。',
      },
    ],
  },
  en: {
    title: 'umask Calculator (Effective Permissions & Reverse)',
    description:
      'Find the permissions new files (666 base) and directories (777 base) get from a umask, or work back to the umask you need. Runs in your browser.',
    h1: 'umask Calculator',
    introHtml:
      'Enter a umask (for example 022) to see the permissions that new files (base 666) and new directories (base 777) will get, in both octal and rwx notation. You can also work backwards: type the permissions you want, such as 644 for files or 750 for directories, and the tool tells you which umask to set. To convert permissions on existing files, use the <a href="/en/tools/chmod-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Chmod Permission Calculator</a>. Everything runs in your browser and nothing is sent to a server.',
    umaskLabel: 'umask (octal)',
    umaskPlaceholder: '022',
    fileHeading: 'New file (base 666)',
    directoryHeading: 'New directory (base 777)',
    octalLabel: 'Octal',
    symbolicLabel: 'rwx notation',
    commandLabel: 'umask command',
    symbolicOutputLabel: 'umask -S output (directory base)',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorInvalidUmask: 'Invalid umask (up to 3 digits from 0-7, e.g. 022)',
    reverseHeading: 'Find the umask for the permissions you want',
    reverseDescription:
      'Enter the permissions you want new files or directories to have, and get the umask that produces them.',
    desiredLabel: 'Desired permissions (octal)',
    desiredPlaceholder: '644',
    kindLabel: 'Type',
    kindFile: 'File',
    kindDirectory: 'Directory',
    reverseResultLabel: 'Required umask',
    errorInvalidMode: 'Invalid permissions (3 digits from 0-7, e.g. 644)',
    unreachableMessage:
      'New files never get the execute bit, so umask cannot grant the x permission you asked for (use chmod for that). What you actually get is',
    presetsHeading: 'Common umask values',
    presetColumnUmask: 'umask',
    presetColumnFile: 'File',
    presetColumnDirectory: 'Directory',
    presetColumnUse: 'Typical use',
    presets: [
      {
        umask: '022',
        use: 'Default on most Linux systems; only you can write',
      },
      {
        umask: '002',
        use: 'Shared group editing (e.g. regular users on Debian/Ubuntu)',
      },
      { umask: '027', use: 'Group can read only; others get nothing' },
      { umask: '077', use: 'Private to you (keys, server accounts)' },
      { umask: '000', use: 'No restriction (not recommended)' },
    ],
    notesHeading: 'Notes',
    notes: [
      'Files use 666 as the base because normal file creation never sets the execute bit. Execute bits in the umask do not change the result for new files.',
      'The umask can be entered as 022, 22, or 0022. A 4-digit value is only accepted when its first digit is 0.',
      'The real result also depends on the creation mode a program requests (for example 0600). This tool uses the usual bases: 666 for files and 777 for directories.',
      'On directories with a default ACL, the ACL may take precedence over the umask.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'umask',
        description:
          'A mask that removes permissions from newly created files and directories. The permissions actually granted are the base permissions minus the bits set in the umask.',
      },
      {
        term: 'Base permissions (666 and 777)',
        description:
          'New files start at 666 (rw-rw-rw-, no execute) and new directories at 777 (rwxrwxrwx). The umask then strips bits from that starting point.',
      },
      {
        term: 'Octal and rwx notation',
        description:
          'Add read = 4, write = 2, execute = 1 for each of owner, group, and other to get three octal digits. rwx notation expresses the same thing in nine characters.',
      },
    ],
  },
};
