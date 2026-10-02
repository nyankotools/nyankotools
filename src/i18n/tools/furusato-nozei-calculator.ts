import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface FurusatoNozeiCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  sectionHeading: string;
  grossLabel: string;
  grossPlaceholder: string;
  age40Label: string;
  socialInsuranceLabel: string;
  socialInsuranceHint: string;
  socialInsurancePlaceholder: string;
  otherDeductionsLabel: string;
  otherDeductionsPlaceholder: string;
  error: string;
  resultLimitLabel: string;
  resultLimitNote: string;
  resultSafeLimitLabel: string;
  resultDeductibleLabel: string;
  resultLevyLabel: string;
  resultMarginalRateLabel: string;
  resultSalaryIncomeLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const furusatoNozeiCalculatorContent: Record<
  Locale,
  FurusatoNozeiCalculatorPageContent
> = {
  ja: {
    title: 'ふるさと納税の上限額シミュレーション（年収から控除上限を試算）',
    description:
      '年収から、ふるさと納税で自己負担2,000円で寄付できる控除上限額の目安を試算する無料ツールです。会社員向け。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ふるさと納税の上限額シミュレーション',
    introHtml:
      '額面の年収と所得控除を入力すると、自己負担2,000円でふるさと納税ができる寄付額の上限の目安を計算します。住民税所得割額と所得税の税率から求める、令和7・8年分の税制に基づく簡易シミュレーションです。手取りの目安は <a href="/tools/salary-take-home-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">会社員の手取り計算機</a> でも確認できます。',
    numberLocale: 'ja-JP',
    sectionHeading: '給与・控除の入力',
    grossLabel: '額面の年収（賞与込み・円）',
    grossPlaceholder: '5000000',
    age40Label: '40歳以上（介護保険料を含める）',
    socialInsuranceLabel: '社会保険料の年間額（わかる場合のみ・円）',
    socialInsuranceHint:
      '空欄の場合は年収から概算します。源泉徴収票の「社会保険料等の金額」を入力すると精度が上がります。',
    socialInsurancePlaceholder: '概算する',
    otherDeductionsLabel:
      '基礎控除以外の所得控除の合計（配偶者控除・扶養控除・生命保険料控除等）（円）',
    otherDeductionsPlaceholder: '0',
    error:
      '計算できませんでした（年収・社会保険料・その他の所得控除は0以上の値を入力してください）',
    resultLimitLabel: '寄付できる上限額の目安（自己負担2,000円）',
    resultLimitNote:
      '上限ぎりぎりまで寄付すると、算定の誤差で自己負担が増えることがあります。余裕をみて下の「安全圏」の額までにするのがおすすめです。',
    resultSafeLimitLabel: '余裕をみた寄付額（上限の約9割）',
    resultDeductibleLabel: '控除される税額の合計（上限額−2,000円）',
    resultLevyLabel: '住民税所得割額（調整控除後）',
    resultMarginalRateLabel: '所得税の税率',
    resultSalaryIncomeLabel: '給与所得（給与所得控除後）',
    notesHeading: '注意事項',
    notes: [
      '本ツールは、給与収入のみの会社員を前提とした簡易シミュレーションです。個人事業主・年金受給者や、給与以外の所得がある場合は正確に計算できません。',
      '上限額は「住民税所得割額×20%÷(90%−所得税率×1.021)＋2,000円」で計算しています。実際の上限は、お住まいの自治体の住民税額や各種控除によって前後するため、正確な金額は源泉徴収票や住民税決定通知書をもとに確認してください。',
      '住宅ローン控除（初年度は確定申告が必要）、医療費控除、iDeCo等の控除は個別には反映していません。所得控除に当たるものは「その他の所得控除」に入力できますが、住宅ローン控除で住民税から控除されている場合は上限額が下がるため、実際の上限はこの試算より低くなります。',
      '扶養家族・配偶者がいる場合は、扶養控除・配偶者控除の合計を「その他の所得控除」に入力してください。調整控除は基礎控除分の5万円のみを想定しています。',
      '寄付は1月1日〜12月31日の年単位で集計されます。ワンストップ特例制度は寄付先が5自治体以内、確定申告が不要な給与所得者が対象で、確定申告をする場合は所得税の還付分と住民税の控除に分かれます。上限額の考え方はどちらも同じです。',
      '返礼品の価格や「寄付額」と「控除額」の違いにご注意ください。控除されるのは寄付額から自己負担2,000円を引いた額で、返礼品の市場価値そのものではありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ふるさと納税の控除上限額',
        description:
          '自己負担2,000円だけで寄付できる寄付額の上限です。これを超えた分は税金から控除されず、全額が自己負担になります。収入や家族構成、控除の額によって人ごとに異なります。',
      },
      {
        term: '住民税所得割',
        description:
          '住民税のうち課税所得に応じて決まる部分で、税率は一律約10%（道府県民税4%＋市町村民税6%）です。ふるさと納税の控除上限は、この所得割額の20%がひとつの目安になります。',
      },
      {
        term: '調整控除',
        description:
          '所得税と住民税の人的控除（基礎控除など）の額の差による負担増を調整するために、住民税の所得割から差し引かれる控除です。基礎控除分のみなら課税所得が200万円以下で2,500円です。',
      },
      {
        term: 'ワンストップ特例制度',
        description:
          '確定申告が不要な給与所得者が、1年間の寄付先が5自治体以内の場合に、寄付先へ申請書を送るだけで控除を受けられる制度です。所得税の還付はなく、控除は翌年度の住民税から全額行われます。',
      },
      {
        term: '自己負担2,000円',
        description:
          'ふるさと納税では、寄付額から2,000円を引いた分が所得税の還付と住民税の控除として戻ります。この2,000円は控除されないため、実質の自己負担になります。',
      },
    ],
  },
  en: {
    title: 'Furusato Donation Limit Calculator',
    description:
      'Estimate how much you can donate through furusato nozei for a ¥2,000 out-of-pocket cost, based on your salary. For employees in Japan. Runs in your browser.',
    h1: 'Furusato Nozei Donation Limit Calculator',
    introHtml:
      'Enter your gross annual salary and deductions, and this tool estimates the maximum furusato nozei (hometown tax) donation you can make with only a ¥2,000 out-of-pocket cost. It uses your resident tax income levy and income tax rate under the 2025–2026 tax rules, as a simplified simulation. To see your estimated take-home pay, try the <a href="/en/tools/salary-take-home-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Japan Salary Take-Home Pay Calculator</a>.',
    numberLocale: 'en-US',
    sectionHeading: 'Salary and deductions',
    grossLabel: 'Gross annual salary, bonuses included (JPY)',
    grossPlaceholder: '5000000',
    age40Label: 'Age 40 or older (include nursing care insurance)',
    socialInsuranceLabel:
      'Annual social insurance premiums, if known (JPY, optional)',
    socialInsuranceHint:
      'Leave blank to estimate from your salary. Entering the amount from your year-end tax statement improves accuracy.',
    socialInsurancePlaceholder: 'Estimate',
    otherDeductionsLabel:
      'Other income deductions besides the basic deduction (spouse, dependents, life insurance, etc.) (JPY)',
    otherDeductionsPlaceholder: '0',
    error:
      'Could not calculate (salary, social insurance, and other deductions must be 0 or greater)',
    resultLimitLabel: 'Estimated donation limit (¥2,000 out of pocket)',
    resultLimitNote:
      'Donating right up to the limit can leave you paying more than ¥2,000 because of estimation error. Staying at or below the "with margin" amount below is safer.',
    resultSafeLimitLabel: 'Donation with margin (about 90% of the limit)',
    resultDeductibleLabel: 'Total tax deducted (limit minus ¥2,000)',
    resultLevyLabel: 'Resident tax income levy (after adjustment credit)',
    resultMarginalRateLabel: 'Income tax rate',
    resultSalaryIncomeLabel: 'Employment income (after salary deduction)',
    notesHeading: 'Notes',
    notes: [
      'This is a simplified simulation for an employee whose only income is salary. It cannot accurately handle self-employed people, pensioners, or anyone with income other than salary.',
      'The limit is calculated as resident tax income levy × 20% ÷ (90% − income tax rate × 1.021) + ¥2,000. Your actual limit varies with your municipality’s resident tax and other deductions, so confirm the exact figure with your year-end tax statement or resident tax notice.',
      'The housing loan deduction (which requires a tax return in the first year), medical expense deduction, and iDeCo are not applied individually. Income deductions can be entered under "other income deductions", but if you receive a housing loan deduction against resident tax, your real limit is lower than this estimate.',
      'If you have dependents or a spouse, enter the total of their deductions under "other income deductions". The adjustment credit assumes only the ¥50,000 basic-deduction difference.',
      'Donations are counted per calendar year (January 1 to December 31). The One-Stop Exception applies to employees who donate to five or fewer municipalities and do not need to file a tax return; with a tax return, the benefit is split between an income tax refund and a resident tax deduction. The limit works the same way either way.',
      'Remember that the deduction equals your donation minus ¥2,000, not the market value of the gift you receive.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Furusato nozei donation limit',
        description:
          'The maximum donation you can make while paying only ¥2,000 yourself. Anything above it is not deducted from your taxes and is entirely out of pocket. It varies by income, family, and deductions.',
      },
      {
        term: 'Resident tax income levy',
        description:
          'The part of resident tax that depends on taxable income, at about 10% (4% prefectural + 6% municipal). 20% of this amount is a key reference point for the furusato nozei limit.',
      },
      {
        term: 'Adjustment credit',
        description:
          'A credit subtracted from the resident tax income levy to offset the difference between income tax and resident tax personal deductions such as the basic deduction. With only the basic deduction it is ¥2,500 for taxable income up to ¥2 million.',
      },
      {
        term: 'One-Stop Exception',
        description:
          'A system that lets employees who do not need to file a tax return claim the deduction by mailing an application to each municipality, for up to five municipalities a year. There is no income tax refund; the entire deduction applies to next year’s resident tax.',
      },
      {
        term: '¥2,000 out-of-pocket cost',
        description:
          'With furusato nozei, the donation minus ¥2,000 comes back as an income tax refund and a resident tax deduction. The remaining ¥2,000 is not refunded and is your actual cost.',
      },
    ],
  },
};
