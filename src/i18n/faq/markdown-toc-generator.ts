import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '目次のリンクがGitHubで正しく飛ばないのはなぜですか？',
      answer:
        'アンカーは見出しの文字から作られるため、目次を作った後に見出しを書き換えるとずれます。見出しを変えたら目次を作り直してください。GitLabなど別サービスではアンカーの規則が少し違うことがあります。',
    },
    {
      question: '同じ名前の見出しが複数あるとどうなりますか？',
      answer:
        '2つ目以降に「-1」「-2」と連番を付けます。目次に含めない深さの見出しも数えるので、GitHubで実際に使われるアンカーと一致します。',
    },
    {
      question: 'コードブロックの中の「#」は見出しになりますか？',
      answer:
        'なりません。``` や ~~~ で囲まれた範囲、ファイル先頭のフロントマターは見出しとして扱いません。シェルのコメント行などが目次に混ざることはありません。',
    },
    {
      question: '日本語の見出しでもアンカーは作れますか？',
      answer:
        'はい。日本語の文字はそのままアンカーに使い、記号だけを取り除きます。例えば「使い方 (Usage)」は「#使い方-usage」になります。',
    },
  ],
  en: [
    {
      question: 'Why do the TOC links not jump correctly on GitHub?',
      answer:
        'Anchors are built from the heading text, so renaming a heading after generating the TOC breaks the link. Regenerate the TOC after editing headings. Platforms other than GitHub, such as GitLab, can use slightly different rules.',
    },
    {
      question: 'What happens when several headings share the same name?',
      answer:
        'The second and later ones get "-1", "-2" and so on. Headings outside your chosen depth are still counted, so the anchors match what GitHub actually generates.',
    },
    {
      question: 'Are "#" lines inside code blocks treated as headings?',
      answer:
        'No. Anything inside ``` or ~~~ fences, and front matter at the top of the file, is ignored, so shell comments never leak into the table of contents.',
    },
    {
      question: 'Do non-English headings get anchors too?',
      answer:
        'Yes. Letters from any language are kept in the anchor and only punctuation is dropped. For example, "使い方 (Usage)" becomes "#使い方-usage".',
    },
  ],
};
