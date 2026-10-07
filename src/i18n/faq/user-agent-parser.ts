import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'Windows 10とWindows 11を区別できないのはなぜですか？',
      answer:
        'User-Agent文字列ではどちらも「Windows NT 10.0」と表示されるためです。区別するにはClient Hints（userAgentData）のplatformVersionが必要で、このブラウザの情報欄では対応ブラウザに限り「Windows 11」などと表示します。',
    },
    {
      question: 'iPadがMacと判定されることがあるのはなぜですか？',
      answer:
        'iPadOS 13以降のSafariは、既定でMacと同じ「Macintosh」を名乗るためです。貼り付けたUA文字列だけでは区別できません。このブラウザの自動表示では、タッチ操作の対応数も参考にiPadOSと判定しています。',
    },
    {
      question: 'BraveやArcが「Chrome」と表示されます。',
      answer:
        'これらのブラウザは、User-Agent上はChromeとほぼ同一の文字列を送るため、UAからは区別できません。判定は文字列に含まれるトークンに基づく推定です。',
    },
    {
      question: 'Client Hintsが表示されないのはなぜですか？',
      answer:
        'navigator.userAgentDataに対応しているのは主にChrome・Edgeなどのブラウザで、FirefoxやSafariでは利用できません。また、HTTPS以外のページでは高エントロピー値を取得できない場合があります。',
    },
  ],
  en: [
    {
      question: "Why can't Windows 10 and Windows 11 be told apart?",
      answer:
        'Both report "Windows NT 10.0" in the User-Agent string. Telling them apart requires the platformVersion from Client Hints (userAgentData), which the "Your browser" section shows as "Windows 11" in browsers that support it.',
    },
    {
      question: 'Why is my iPad detected as a Mac?',
      answer:
        'Safari on iPadOS 13 and later identifies itself as "Macintosh" by default, so a pasted string alone looks like a Mac. For your own browser, this tool also checks the touch point count to detect iPadOS.',
    },
    {
      question: 'Brave or Arc shows up as "Chrome".',
      answer:
        "These browsers send a User-Agent that is almost identical to Chrome's, so they cannot be distinguished from the string alone. Detection is an estimate based on the tokens in the string.",
    },
    {
      question: 'Why are Client Hints not shown?',
      answer:
        'navigator.userAgentData is mainly supported by Chrome, Edge, and other Chromium-based browsers; Firefox and Safari do not provide it. High-entropy values may also be unavailable on non-HTTPS pages.',
    },
  ],
};
