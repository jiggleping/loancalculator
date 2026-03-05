export interface LoanInput {
  amount: number;
  annualRate: number;
  termMonths: number;
  paymentDay: number;
  disbursementDate: Date;
}

export interface AmortizationRow {
  number: number;
  date: Date;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  isIntercalary: boolean;
}

export interface LoanResult {
  rows: AmortizationRow[];
  totalPayment: number;
  totalInterest: number;
  totalPrincipal: number;
  intercalaryInterest: number;
  monthlyAnnuity: number;
  intercalaryDays: number;
}
