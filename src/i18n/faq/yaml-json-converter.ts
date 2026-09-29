import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'YAMLのコメントはJSONに変換するとどうなりますか？',
      answer:
        'JSONにはコメントの記法がないため、YAMLのコメントは変換時に失われます。YAMLに戻しても復元されないので、元のファイルは残しておいてください。',
    },
    {
      question: 'インデントのエラーはどうやって見つければよいですか？',
      answer:
        'YAMLはインデントに意味があり、タブ文字は使えません。エラーが出たら、スペースで揃えられているか、リストの「-」の位置が揃っているかを確認してください。',
    },
    {
      question: 'Docker ComposeやKubernetesの設定にも使えますか？',
      answer:
        'はい。Docker ComposeやGitHub Actions、Kubernetesのマニフェストなどの設定ファイルを、別の形式で確認したいときに使えます。',
    },
  ],
  en: [
    {
      question: 'What happens to YAML comments when converting to JSON?',
      answer:
        'JSON has no comment syntax, so comments are lost. They will not come back when converting to YAML, so keep the original file.',
    },
    {
      question: 'How do I find indentation errors?',
      answer:
        'Indentation is significant in YAML and tabs are not allowed. If you get an error, check that spaces are used and list dashes line up.',
    },
    {
      question: 'Can I use it for Docker Compose or Kubernetes files?',
      answer:
        'Yes. It is handy for viewing configuration files such as Docker Compose, GitHub Actions workflows and Kubernetes manifests in another format.',
    },
  ],
};
