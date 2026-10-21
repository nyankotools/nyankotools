import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface RetirementAllowanceTaxPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  sectionHeading: string;
  payLabel: string;
  payPlaceholder: string;
  yearsLabel: string;
  monthsLabel: string;
  serviceHint: string;
  disabilityLabel: string;
  officerLabel: string;
  officerHint: string;
  error: string;
  halfRuleFull: string;
  halfRulePartial: string;
  halfRuleNone: string;
  yearUnit: string;
  resultTakeHomeLabel: string;
  resultTotalTaxLabel: string;
  resultRateLabel: string;
  resultCountedYearsLabel: string;
  resultDeductionLabel: string;
  resultAfterDeductionLabel: string;
  resultHalfRuleLabel: string;
  resultTaxableLabel: string;
  resultIncomeTaxBaseLabel: string;
  resultReconstructionLabel: string;
  resultIncomeTaxLabel: string;
  resultResidentTaxLabel: string;
  disclaimer: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const retirementAllowanceTaxContent: Record<
  Locale,
  RetirementAllowanceTaxPageContent
> = {
  ja: {
    title: '退職金の税金計算｜退職所得控除・所得税・住民税を試算',
    description:
      '退職金の額と勤続年数から、退職所得控除・2分の1課税を使って所得税（復興特別所得税込み）と住民税、手取り額を試算します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '退職金の税金計算（退職所得控除）',
    introHtml:
      '退職金（退職手当等）の額と勤続年数を入力すると、退職所得控除、2分の1課税、分離課税の所得税（復興特別所得税を含む）、住民税10%を計算して手取りの目安を表示します。勤続5年以下の短期退職手当等や役員等の特例、障害退職の加算にも対応しています。令和7年分の制度に基づく概算で、法的・税務上の助言ではありません。毎月の給与の手取りは <a href="/tools/salary-take-home-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">会社員の手取り計算機</a> をご利用ください。',
    numberLocale: 'ja-JP',
    sectionHeading: '退職金・勤続年数の入力',
    payLabel: '退職金の額面（円）',
    payPlaceholder: '20000000',
    yearsLabel: '勤続年数（年）',
    monthsLabel: '端数の月数（0〜11か月）',
    serviceHint:
      '入社から退職までの期間を入力します。1年未満の端数は切り上げて計算します（例: 10年1か月は11年）。',
    disabilityLabel:
      '障害者になったことが直接の原因で退職（控除に100万円加算）',
    officerLabel: '役員等として退職した（法人の役員・議員・公務員）',
    officerHint:
      '役員等としての勤続年数が5年以下の場合は、2分の1課税が適用されません。一般の従業員は、勤続5年以下でも退職所得控除後の300万円までの部分だけが2分の1になります。',
    error:
      '計算できませんでした（退職金は0以上の数値、勤続年数は0〜80年の整数、月数は0〜11の整数で、勤続期間が1か月以上になるよう入力してください）',
    halfRuleFull: '全額に2分の1を適用',
    halfRulePartial: '300万円以下の部分のみ2分の1（短期退職手当等）',
    halfRuleNone: '2分の1を適用しない（役員等の短期退職手当等）',
    yearUnit: '年',
    resultTakeHomeLabel: '手取り額（目安）',
    resultTotalTaxLabel: '税金の合計',
    resultRateLabel: '退職金に対する税の割合',
    resultCountedYearsLabel: '計算に使う勤続年数（端数切り上げ）',
    resultDeductionLabel: '退職所得控除額',
    resultAfterDeductionLabel: '退職金から控除額を引いた金額',
    resultHalfRuleLabel: '2分の1課税の扱い',
    resultTaxableLabel: '課税退職所得金額（1,000円未満切り捨て）',
    resultIncomeTaxBaseLabel: '所得税額（復興特別所得税を除く）',
    resultReconstructionLabel: '復興特別所得税',
    resultIncomeTaxLabel: '所得税と復興特別所得税の合計',
    resultResidentTaxLabel: '住民税（10%）',
    disclaimer:
      'この結果は令和7年分の制度にもとづく概算の目安であり、法的・税務上の助言ではありません。実際の税額は、退職所得の受給に関する申告書の提出有無や勤続期間の通算などで変わります。勤務先・税務署・お住まいの自治体で必ずご確認ください。',
    notesHeading: '注意事項',
    notes: [
      '令和7年分の制度に基づく概算です。退職所得控除は、勤続20年以下が40万円×勤続年数（最低80万円）、20年超が800万円+70万円×（勤続年数−20年）で、障害退職の場合は100万円を加算します。税制改正で変わる場合があります。',
      '退職金から退職所得控除を引いた金額の2分の1が課税退職所得金額になり（1,000円未満切り捨て）、他の所得とは合算しない分離課税で、所得税の速算表で税額を求めます。復興特別所得税として所得税額の2.1%を加えます。',
      '勤続5年以下の一般の従業員（短期退職手当等）は、控除後の金額が300万円を超える部分に2分の1課税が使えません。役員等としての勤続年数が5年以下の場合は、全額に2分の1課税が使えません。',
      '住民税は課税退職所得金額の10%（道府県民税4%・市町村民税6%）を目安にしています。自治体による差や端数処理の違いで数百円ずれることがあります。',
      '退職所得の受給に関する申告書を会社に提出していない場合は、退職金に対して一律20.42%が源泉徴収され、確定申告で精算します。このツールは申告書を提出した場合の税額を表示します。',
      '前年以前4年内（役員等は19年内）に別の退職金を受け取った場合の勤続期間の重複調整、退職金が年金形式の場合、確定拠出年金や企業年金の一時金などの個別の扱いには対応していません。',
      '退職金の一部として受け取った他の収入や、社会保険料などの扱いは含みません。実際の源泉徴収額は会社の計算に従うため、退職所得の源泉徴収票で確認してください。税務上・法律上の助言ではありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '退職所得控除',
        description:
          '退職金にかかる税金を軽くするための控除です。勤続年数が長いほど大きくなり、勤続20年以下は1年あたり40万円（最低80万円）、20年を超える部分は1年あたり70万円です。',
      },
      {
        term: '2分の1課税',
        description:
          '退職金から退職所得控除を引いた金額の2分の1を課税対象にする仕組みです。勤続5年以下の短期退職手当等や、役員等の勤続5年以下では適用が制限されます。',
      },
      {
        term: '分離課税',
        description:
          '退職所得を給与などの他の所得と合算せず、単独で税額を計算する課税方式です。そのため、同じ年に給与があっても退職金の税率が上がりにくくなります。',
      },
      {
        term: '短期退職手当等',
        description:
          '勤続年数が5年以下の人が受け取る退職手当等です。令和4年分から、控除後の金額のうち300万円を超える部分には2分の1課税が適用されません。',
      },
      {
        term: '復興特別所得税',
        description:
          '東日本大震災の復興財源として、所得税額に2.1%が上乗せされる税金です。退職金の源泉徴収でも所得税とあわせて徴収されます。',
      },
    ],
  },
  en: {
    title: 'Japan Retirement Allowance Tax Calculator (Severance Pay)',
    description:
      'Estimate income tax and resident tax on a Japanese retirement allowance with the retirement income deduction and half taxation. Runs in your browser, no upload.',
    h1: 'Japan Retirement Allowance Tax Calculator',
    introHtml:
      'Enter your severance (retirement allowance) and years of service. The tool applies the retirement income deduction, half taxation, separate-taxation income tax (including the reconstruction surtax), and 10% resident tax, then shows an estimated net amount. It also handles the short-term rules (five years or less), the officer exception, and the disability addition. This is a rough estimate based on the 2025 rules, not legal or tax advice. For regular monthly pay, use the <a href="/en/tools/salary-take-home-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Salary Take-Home Pay Calculator</a>.',
    numberLocale: 'en-US',
    sectionHeading: 'Retirement allowance and service period',
    payLabel: 'Gross retirement allowance (JPY)',
    payPlaceholder: '20000000',
    yearsLabel: 'Years of service',
    monthsLabel: 'Extra months (0 to 11)',
    serviceHint:
      'Enter the period from hire to retirement. A partial year is rounded up (for example, 10 years 1 month counts as 11 years).',
    disabilityLabel:
      'Retired because of becoming disabled (adds ¥1 million to the deduction)',
    officerLabel: 'Retired as an officer, legislator, or public servant',
    officerHint:
      'If the service period as such an officer is five years or less, half taxation does not apply. For ordinary employees with five years or less, half taxation applies only to the first ¥3 million after the deduction.',
    error:
      'Could not calculate (retirement allowance must be 0 or greater, years an integer from 0 to 80, months an integer from 0 to 11, and the service period at least one month)',
    halfRuleFull: 'Half taxation applies to the full amount',
    halfRulePartial:
      'Half taxation only up to ¥3 million (short-term allowance)',
    halfRuleNone: 'No half taxation (short-term allowance for officers)',
    yearUnit: ' years',
    resultTakeHomeLabel: 'Estimated net amount',
    resultTotalTaxLabel: 'Total tax',
    resultRateLabel: 'Tax as a share of the allowance',
    resultCountedYearsLabel: 'Years of service used (rounded up)',
    resultDeductionLabel: 'Retirement income deduction',
    resultAfterDeductionLabel: 'Allowance minus the deduction',
    resultHalfRuleLabel: 'Half taxation treatment',
    resultTaxableLabel: 'Taxable retirement income (rounded down to ¥1,000)',
    resultIncomeTaxBaseLabel: 'Income tax (before reconstruction surtax)',
    resultReconstructionLabel: 'Reconstruction surtax',
    resultIncomeTaxLabel: 'Income tax plus reconstruction surtax',
    resultResidentTaxLabel: 'Resident tax (10%)',
    disclaimer:
      'These results are rough estimates based on the 2025 rules and are not legal or tax advice. The actual tax depends on whether you file the retirement income declaration form, how service periods are combined and other factors. Please confirm with your employer, the tax office and your local government.',
    notesHeading: 'Notes',
    notes: [
      'This is an estimate based on the 2025 rules. The deduction is ¥400,000 per year of service for 20 years or less (minimum ¥800,000), and ¥8 million plus ¥700,000 per year beyond 20 years. A disability retirement adds ¥1 million. Tax reform can change these figures.',
      'Half of the allowance after the deduction becomes taxable retirement income (rounded down to ¥1,000). It is taxed separately from other income using the standard income tax brackets, and 2.1% of the income tax is added as the reconstruction surtax.',
      'For ordinary employees with five years of service or less (short-term allowance), half taxation does not apply to the part above ¥3 million after the deduction. For officers with five years or less in that role, half taxation does not apply at all.',
      'Resident tax is estimated at 10% of taxable retirement income (4% prefectural, 6% municipal). Differences between municipalities and rounding can shift the amount by a few hundred yen.',
      'If you have not given your employer the retirement income declaration form, a flat 20.42% is withheld from the allowance and settled through a tax return. This tool shows the tax when the form has been submitted.',
      'Not covered: the overlapping-service adjustment when you received another allowance within the previous four years (19 for officers), allowances paid as a pension, and special cases such as lump sums from defined contribution or corporate pension plans.',
      'Other income and social insurance are not included. Actual withholding follows your employer’s payroll, so check the retirement income withholding slip. This is not legal or tax advice.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Retirement income deduction',
        description:
          'A deduction that reduces the tax on a retirement allowance. It grows with years of service: ¥400,000 per year for 20 years or less (minimum ¥800,000) and ¥700,000 per year beyond that.',
      },
      {
        term: 'Half taxation',
        description:
          'Only half of the allowance after the retirement income deduction is taxed. It is restricted for short-term allowances and for officers with five years of service or less.',
      },
      {
        term: 'Separate taxation',
        description:
          'Retirement income is taxed on its own and not added to salary or other income, so having a salary in the same year does not push the tax rate up.',
      },
      {
        term: 'Short-term retirement allowance',
        description:
          'An allowance received after five years of service or less. From 2022, half taxation no longer applies to the part above ¥3 million after the deduction.',
      },
      {
        term: 'Reconstruction surtax',
        description:
          'A 2.1% surtax on income tax that funds reconstruction after the Great East Japan Earthquake. It is withheld together with income tax on retirement allowances.',
      },
    ],
  },
};
