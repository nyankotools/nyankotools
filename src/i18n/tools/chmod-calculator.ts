import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SubjectRow {
  subject: 'owner' | 'group' | 'other';
  label: string;
}

export interface ChmodCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  columnSubject: string;
  columnRead: string;
  columnWrite: string;
  columnExecute: string;
  subjectRows: SubjectRow[];
  ariaReadLabel: string;
  ariaWriteLabel: string;
  ariaExecuteLabel: string;
  setuidLabel: string;
  setgidLabel: string;
  stickyLabel: string;
  octalLabel: string;
  octalPlaceholder: string;
  symbolicLabel: string;
  symbolicPlaceholder: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  commandLabel: string;
  sampleFileName: string;
  errorInvalidOctal: string;
  errorInvalidSymbolic: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const chmodCalculatorContent: Record<
  Locale,
  ChmodCalculatorPageContent
> = {
  ja: {
    title: 'Chmodパーミッション計算機（8進数・シンボル表記変換）',
    description:
      'chmodのファイルパーミッションを、チェックボックス・8進数（755）・シンボル表記（rwxr-xr-x）で相互変換できる無料ツールです。setuid等にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Chmodパーミッション計算機',
    introHtml:
      '所有者・グループ・その他の読み取り/書き込み/実行権限をチェックボックスで指定すると、8進数（例: 755）とシンボル表記（例: rwxr-xr-x）、そのまま使えるchmodコマンドをリアルタイムで表示します。逆に8進数やシンボル表記を直接入力しても他の欄に反映されます。setuid・setgid・スティッキービットなどの特殊権限にも対応。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。正規表現でファイルパスを扱う場合は <a href="/tools/regex-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">正規表現テスター</a> もあわせてご利用ください。',
    columnSubject: '対象',
    columnRead: '読み取り (r)',
    columnWrite: '書き込み (w)',
    columnExecute: '実行 (x)',
    subjectRows: [
      { subject: 'owner', label: '所有者 (u)' },
      { subject: 'group', label: 'グループ (g)' },
      { subject: 'other', label: 'その他 (o)' },
    ],
    ariaReadLabel: '読み取り',
    ariaWriteLabel: '書き込み',
    ariaExecuteLabel: '実行',
    setuidLabel: 'setuid（所有者権限で実行）',
    setgidLabel: 'setgid（グループ権限で実行）',
    stickyLabel: 'スティッキービット',
    octalLabel: '8進数表記',
    octalPlaceholder: '755',
    symbolicLabel: 'シンボル表記',
    symbolicPlaceholder: 'rwxr-xr-x',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    commandLabel: 'chmodコマンド',
    sampleFileName: 'ファイル名',
    errorInvalidOctal:
      '8進数の形式が正しくありません（例: 755、特殊権限込みなら4755）',
    errorInvalidSymbolic:
      'シンボル表記の形式が正しくありません（例: rwxr-xr-x）',
    notesHeading: '注意事項',
    notes: [
      '8進数表記は3桁（例: 755）でも4桁（例: 4755）でも入力できます。3桁の場合はsetuid・setgid・スティッキービットなし、4桁の場合は先頭の桁がこれらの特殊権限を表します。',
      'シンボル表記は「rwxr-xr-x」の9文字のほか、「ls -l」の出力そのままである「-rwxr-xr-x」（先頭にファイル種別を表す1文字が付いた10文字）も入力できます。',
      'setuid・setgidを実行権限なしで設定した場合、シンボル表記では実行位置が大文字のS、スティッキービットの場合は大文字のTで表示されます（慣例に従った表記です）。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'パーミッション（アクセス権）',
        description:
          'Linux/UnixやmacOSのファイルシステムで、誰が読み取り(r)・書き込み(w)・実行(x)できるかを表す設定です。所有者(owner)・グループ(group)・その他(other)の3者それぞれに対して個別に設定できます。',
      },
      {
        term: '8進数表記（例: 755）',
        description:
          '読み取り=4・書き込み=2・実行=1として、所有者・グループ・その他それぞれの権限を1桁の数字（0〜7）に合計し、3桁並べた表記です。「chmod 755」のようにコマンドで使われます。',
      },
      {
        term: 'シンボル表記（例: rwxr-xr-x）',
        description:
          'r（読み取り）・w（書き込み）・x（実行）の文字を、権限が無い場合は「-」に置き換えて9文字で表す表記です。「ls -l」コマンドの出力でおなじみの形式です。',
      },
      {
        term: 'setuid・setgid・スティッキービット（特殊権限）',
        description:
          '通常のr/w/xとは別に存在する特殊な権限です。setuidはプログラム実行時に所有者の権限で動作させ、setgidはグループの権限で動作させます（ディレクトリに設定すると作成されるファイルのグループを継承させる用途にも使われます）。スティッキービットはディレクトリに設定すると、そのディレクトリ内のファイルを所有者以外が削除できないようにします。8進数では4桁目（例: 4755）、シンボル表記では実行権限の位置がs/S/tになります。',
      },
    ],
  },
  en: {
    title: 'Chmod Permission Calculator (Octal & Symbolic Notation)',
    description:
      'Convert chmod permissions between checkboxes, octal (755) and symbolic (rwx), with setuid/setgid/sticky. Runs in your browser; nothing is sent to a server.',
    h1: 'Chmod Permission Calculator',
    introHtml:
      'Check the read/write/execute boxes for the owner, group, and other, and this tool shows the octal notation (e.g. 755), the symbolic notation (e.g. rwxr-xr-x), and a ready-to-use chmod command in real time. You can also type an octal or symbolic value directly and the other fields update to match, including special permissions like setuid, setgid, and the sticky bit. Everything happens in your browser, and nothing you type is ever sent to a server. If you work with file paths using regular expressions, try the <a href="/en/tools/regex-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Regex Tester</a> as well.',
    columnSubject: 'Subject',
    columnRead: 'Read (r)',
    columnWrite: 'Write (w)',
    columnExecute: 'Execute (x)',
    subjectRows: [
      { subject: 'owner', label: 'Owner (u)' },
      { subject: 'group', label: 'Group (g)' },
      { subject: 'other', label: 'Other (o)' },
    ],
    ariaReadLabel: 'read',
    ariaWriteLabel: 'write',
    ariaExecuteLabel: 'execute',
    setuidLabel: 'setuid (run as owner)',
    setgidLabel: 'setgid (run as group)',
    stickyLabel: 'Sticky bit',
    octalLabel: 'Octal notation',
    octalPlaceholder: '755',
    symbolicLabel: 'Symbolic notation',
    symbolicPlaceholder: 'rwxr-xr-x',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    commandLabel: 'chmod command',
    sampleFileName: 'file',
    errorInvalidOctal:
      'Invalid octal format (e.g. 755, or 4755 with special permissions)',
    errorInvalidSymbolic: 'Invalid symbolic format (e.g. rwxr-xr-x)',
    notesHeading: 'Notes',
    notes: [
      'Octal notation can be entered as 3 digits (e.g. 755) or 4 digits (e.g. 4755). With 3 digits, setuid/setgid/sticky are all off; with 4 digits, the leading digit sets these special permissions.',
      'Symbolic notation accepts the 9-character "rwxr-xr-x" form, or the raw "ls -l" output "-rwxr-xr-x" (10 characters, with a leading file-type character).',
      'When setuid or setgid is set without the matching execute permission, the symbolic notation shows an uppercase S in that position (and uppercase T for the sticky bit) — this is the standard convention.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Permissions (file access mode)',
        description:
          'On Linux/Unix and macOS filesystems, permissions control who can read (r), write (w), and execute (x) a file. They can be set independently for the owner, the group, and everyone else (other).',
      },
      {
        term: 'Octal notation (e.g. 755)',
        description:
          'Read = 4, write = 2, execute = 1 — add these up for the owner, group, and other, and you get three digits (0-7 each), as used in commands like "chmod 755".',
      },
      {
        term: 'Symbolic notation (e.g. rwxr-xr-x)',
        description:
          'A 9-character format spelling out r (read), w (write), and x (execute), with "-" where a permission is missing — the same format shown by the "ls -l" command.',
      },
      {
        term: 'setuid, setgid, and the sticky bit (special permissions)',
        description:
          "These special bits sit alongside the usual r/w/x. setuid makes a program run with the file owner's privileges, and setgid makes it run with the group's privileges (on a directory, it also makes new files inherit that group). The sticky bit, set on a directory, prevents anyone but the owner from deleting files inside it. In octal this is a 4th leading digit (e.g. 4755); in symbolic notation it shows up as s/S or t in the execute position.",
      },
    ],
  },
};
