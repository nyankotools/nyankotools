export type LoanMethod = 'equalPayment' | 'equalPrincipal' | 'revolving';

export interface LoanInput {
  /** 借入額（円） */
  principal: number;
  /** 実質年率（%） */
  annualInterestRate: number;
  method: LoanMethod;
  /** 返済回数（月数、整数）。元利均等・元金均等で使用 */
  months?: number;
  /** 毎月の支払額（円）。リボ払い（定額方式）で使用 */
  monthlyPayment?: number;
}

export interface LoanScheduleRow {
  /** 返済回（1始まり） */
  month: number;
  /** 支払額（元金＋利息・手数料） */
  payment: number;
  principal: number;
  interest: number;
  /** 支払後の残高 */
  balance: number;
}

export interface LoanResult {
  schedule: LoanScheduleRow[];
  /** 完済までの月数 */
  totalMonths: number;
  /** 初回の支払額 */
  firstPayment: number;
  /** 最終回の支払額 */
  lastPayment: number;
  totalPayment: number;
  totalInterest: number;
}

/** 返済回数として受け付ける最大月数（50年） */
export const MAX_LOAN_MONTHS = 600;

/**
 * ローン・リボ払いの返済計画を試算する。金利は一定、毎月末返済・日割りなし、
 * 1円未満の端数は丸めず（表示側で丸める）、最終回で残高を精算する。
 * - equalPayment: 元利均等（毎月の返済額が一定）
 * - equalPrincipal: 元金均等（毎月の元金が一定。利息分だけ返済額が逓減）
 * - revolving: リボ払い（定額方式。毎月一定額を支払い、残高に対する手数料を含む）
 * 入力が不正、またはリボ払いで支払額が手数料以下（完済しない）・完済まで
 * 600回を超える場合はnull。
 */
export function calculateLoan(input: LoanInput): LoanResult | null {
  const { principal, annualInterestRate, method } = input;
  if (!(principal > 0) || !(annualInterestRate >= 0)) return null;
  if (!Number.isFinite(principal) || !Number.isFinite(annualInterestRate))
    return null;

  const r = annualInterestRate / 100 / 12;
  const schedule: LoanScheduleRow[] = [];

  if (method === 'revolving') {
    const pay = input.monthlyPayment;
    if (pay === undefined || !(pay > 0) || !Number.isFinite(pay)) return null;
    // 初回の手数料以上の支払いでないと元金が減らず完済しない
    if (pay <= principal * r) return null;
    let balance = principal;
    while (balance > 1e-9) {
      if (schedule.length >= MAX_LOAN_MONTHS) return null;
      const interest = balance * r;
      const payment = Math.min(pay, balance + interest);
      const principalPart = payment - interest;
      balance = Math.max(0, balance - principalPart);
      if (balance < 1e-6) balance = 0;
      schedule.push({
        month: schedule.length + 1,
        payment,
        principal: principalPart,
        interest,
        balance,
      });
    }
  } else {
    const n = input.months;
    if (n === undefined || !Number.isInteger(n) || n < 1 || n > MAX_LOAN_MONTHS)
      return null;
    let balance = principal;
    const level =
      r === 0
        ? principal / n
        : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      let principalPart: number;
      if (i === n) principalPart = balance;
      else if (method === 'equalPrincipal') principalPart = principal / n;
      else principalPart = level - interest;
      balance = i === n ? 0 : Math.max(0, balance - principalPart);
      schedule.push({
        month: i,
        payment: principalPart + interest,
        principal: principalPart,
        interest,
        balance,
      });
    }
  }

  const totalPayment = schedule.reduce((s, row) => s + row.payment, 0);
  if (!Number.isFinite(totalPayment)) return null;
  return {
    schedule,
    totalMonths: schedule.length,
    firstPayment: schedule[0].payment,
    lastPayment: schedule[schedule.length - 1].payment,
    totalPayment,
    totalInterest: totalPayment - principal,
  };
}
