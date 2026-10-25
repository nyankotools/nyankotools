import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '検出したBPMはどのくらい正確ですか？',
      answer:
        'あくまで目安です。ドラムなどで拍がはっきりしている曲では1〜2BPM以内に収まることが多いものの、アンビエントやテンポが揺れる演奏、ライブ録音では外れやすくなります。重要な用途では、タップテンポなどで耳でも確かめてください。',
    },
    {
      question: '実際の半分や2倍のBPMが表示されるのはなぜですか？',
      answer:
        '拍の周期性だけを手がかりにしているため、「1拍」と「2拍」、あるいは「4分」と「8分」のどちらで数えるかを機械的には決め切れないためです。画面には半分・2倍の候補も併記するので、曲に合うほうを選んでください。',
    },
    {
      question: 'テンポが途中で変わる曲はどう検出されますか？',
      answer:
        '曲全体（長い曲は中央付近の約90秒）で最も目立つ周期を1つだけ返します。テンポが変わる曲や、ゆっくり加速・減速する曲では、区間ごとの正確なBPMは分かりません。',
    },
    {
      question: '検出できるBPMの範囲はどのくらいですか？',
      answer:
        '60〜200 BPMの範囲で探索します。それより遅い曲や速い曲は、範囲内の倍数・約数（例: 50 BPMなら100 BPM）として検出されることがあります。',
    },
    {
      question: '4秒より短い音声や無音でもBPMを調べられますか？',
      answer:
        'できません。周期を確かめるには一定の長さが必要なため、4秒未満の音声と、ほぼ無音のファイルは「検出できませんでした」と表示されます。',
    },
  ],
  en: [
    {
      question: 'How accurate is the detected BPM?',
      answer:
        'Treat it as a rough guide. Tracks with a clear beat, such as drum-driven music, are often within 1 to 2 BPM, but ambient music, rubato playing and live recordings are more likely to be off. For anything important, double-check by ear with a tap tempo tool.',
    },
    {
      question: 'Why does it show half or double the real BPM?',
      answer:
        'The tool relies only on how regularly the beats repeat, so it cannot always tell whether you would count one beat or two, or quarter notes or eighth notes. Half and double candidates are shown next to the result so you can pick the one that fits the song.',
    },
    {
      question: 'What happens with songs whose tempo changes?',
      answer:
        'It returns the single most prominent period over the whole track (about 90 seconds from the middle for long ones). For songs that change tempo or speed up and slow down gradually, you will not get an exact BPM for each section.',
    },
    {
      question: 'What BPM range can it detect?',
      answer:
        'It searches from 60 to 200 BPM. Slower or faster songs may be reported as a multiple or fraction that falls in that range, for example 100 BPM for a 50 BPM song.',
    },
    {
      question: 'Can it analyze very short or silent audio?',
      answer:
        'No. Finding a repeating period needs some length, so audio shorter than 4 seconds and nearly silent files show a "could not detect" message.',
    },
  ],
};
