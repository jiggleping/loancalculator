import type { AmortizationRow, LoanInput, LoanResult } from "../types/loan";

function getDaysBetween(start: Date, end: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const startUTC = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  const endUTC = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endUTC - startUTC) / msPerDay);
}

function getFirstPaymentDate(disbursementDate: Date, paymentDay: number): Date {
  const year = disbursementDate.getFullYear();
  const month = disbursementDate.getMonth();
  const day = disbursementDate.getDate();

  if (day <= paymentDay) {
    return new Date(year, month, paymentDay);
  } else {
    return new Date(year, month + 1, paymentDay);
  }
}

function addMonthsToDate(
  baseYear: number,
  baseMonth: number,
  targetDay: number,
  months: number,
): Date {
  const targetMonth = baseMonth + months;
  const result = new Date(baseYear, targetMonth, 1);
  const lastDay = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate();
  result.setDate(Math.min(targetDay, lastDay));
  return result;
}

export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}.`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("hr-HR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Rounds up a number to the nearest second decimal.
 * If the third decimal is greater than 0, the second decimal is incremented by 1.
 * If the third decimal is greater than 2, the second decimal is incremented by 2.
 * For example:
 * - 295.4906 becomes 295.50
 * - 295.495 becomes 295.51
 */
export function roundUpToSecondDecimal(value: number): number {
  console.log(value);
  const rounded = parseFloat(value.toFixed(2));
  const difference = Math.abs(value - rounded);

  if (difference != 0) {
    if (difference > 0.05) {
      return rounded + 0.02;
    } else {
      return rounded + 0.01;
    }
  } else {
    return rounded;
  }
}

export function calculateLoan(input: LoanInput): LoanResult {
  const { amount, annualRate, termMonths, paymentDay, disbursementDate } =
    input;

  const monthlyRate = annualRate / 100 / 12;
  const dailyRate = annualRate / 100 / 360;

  // Intercalary period
  const firstPaymentDate = getFirstPaymentDate(disbursementDate, paymentDay);
  const intercalaryDays = getDaysBetween(disbursementDate, firstPaymentDate);
  const intercalaryInterest = amount * dailyRate * intercalaryDays;

  // Monthly annuity (standard formula)
  let annuity: number;
  if (monthlyRate === 0) {
    annuity = amount / termMonths;
  } else {
    annuity = roundUpToSecondDecimal(
      (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1),
    );
  }

  const rows: AmortizationRow[] = [];

  // Row 0: Intercalary interest (only if there are intercalary days)
  if (intercalaryDays > 0) {
    rows.push({
      number: 0,
      date: firstPaymentDate,
      payment: intercalaryInterest,
      principal: 0,
      interest: intercalaryInterest,
      remainingBalance: amount,
      isIntercalary: true,
    });
  }

  // Regular annuities
  let balance = amount;
  const baseYear = firstPaymentDate.getFullYear();
  const baseMonth = firstPaymentDate.getMonth();

  for (let i = 1; i <= termMonths; i++) {
    const date = addMonthsToDate(baseYear, baseMonth, paymentDay, i);
    const interest = parseFloat((balance * monthlyRate).toFixed(2));

    let principal: number;
    let currentPayment: number;

    if (i === termMonths) {
      // Last payment: pay off remaining balance exactly
      principal = balance;
      currentPayment = balance + interest;
    } else {
      currentPayment = annuity;
      principal = annuity - interest;
    }

    balance = i === termMonths ? 0 : balance - principal;

    rows.push({
      number: i,
      date,
      payment: currentPayment,
      principal,
      interest,
      remainingBalance: Math.max(0, balance),
      isIntercalary: false,
    });
  }

  const totalInterest = rows.reduce((sum, row) => sum + row.interest, 0);
  const totalPayment = rows.reduce((sum, row) => sum + row.payment, 0);

  return {
    rows,
    totalPayment,
    totalInterest,
    totalPrincipal: amount,
    intercalaryInterest,
    monthlyAnnuity: annuity,
    intercalaryDays,
  };
}

export function calculateRemainingPrincipal(
  rows: AmortizationRow[],
  today: Date,
): number {
  return rows
    .filter((row) => row.date > today)
    .reduce((sum, row) => sum + row.principal, 0);
}

export function calculateRemainingInterest(
  rows: AmortizationRow[],
  today: Date,
): number {
  return rows
    .filter((row) => row.date > today)
    .reduce((sum, row) => sum + row.interest, 0);
}

export function calculateAccumulatedInterest(
  rows: AmortizationRow[],
  today: Date,
): number {
  /*
   * Računanje dospjele kamate:
   * - ciklus počinje prvi dan nakon uplate anuiteta i završava danom uplate novog anuiteta, u mom slučaju od 16. do 15. u mjesecu
   * - kamata se dijeli brojem dana između 16. i 15. u mjesecu te množi brojem dana od 16. u mjesecu do danas
   * - primjer:
   *  - datum: 11.02.2026.
   *  - glavnica: 7553,48
   *  - kamata za 02/2026: 35,19
   *    - broj dana između 16.01. i 15.02.: 30
   *    - 11.02. je 26. dan u tom ciklusu
   *  - dospjela kamata:
   *    - (35,19 / 30) * 26 = 30,50
   * */

  const currentRow = rows.find((row) => row.date >= today);
  if (!currentRow || currentRow.date === today) return 0;

  const previousRow = rows[rows.indexOf(currentRow) - 1];
  if (!previousRow) return 0;

  const daysInPeriod = getDaysBetween(previousRow.date, currentRow.date) - 1;
  const daysElapsed = getDaysBetween(previousRow.date, today) - 1;

  const interest = (currentRow.interest / daysInPeriod) * daysElapsed;

  return interest > 0 ? interest : 0;
}
