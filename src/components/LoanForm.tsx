import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import type { LoanInput } from "../types/loan";

interface Props {
  onCalculate: (input: LoanInput) => void;
}

export default function LoanForm({ onCalculate }: Props) {
  const { t } = useTranslation();

  const today = new Date().toISOString().split("T")[0];

  // Load defaults from localStorage or use initial values
  const [amount, setAmount] = useState(
    localStorage.getItem("loanAmount") || "100000",
  );
  const [rate, setRate] = useState(localStorage.getItem("loanRate") || "3.99");
  const [termYears, setTermYears] = useState(
    localStorage.getItem("loanTermYears") || "20",
  );
  const [termMonths, setTermMonths] = useState(
    localStorage.getItem("loanTermMonths") || "6",
  );
  const [paymentDay, setPaymentDay] = useState(
    localStorage.getItem("loanPaymentDay") || "15",
  );
  const [disbursementDate, setDisbursementDate] = useState(
    localStorage.getItem("loanDisbursementDate") || today,
  );

  const totalMonths =
    (parseInt(termYears) || 0) * 12 + (parseInt(termMonths) || 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    const parsedRate = parseFloat(rate);
    const parsedDay = parseInt(paymentDay);

    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    if (isNaN(parsedRate) || parsedRate <= 0) return;
    if (totalMonths <= 0) return;
    if (isNaN(parsedDay) || parsedDay < 1 || parsedDay > 28) return;
    if (!disbursementDate) return;

    // Save values to localStorage
    localStorage.setItem("loanAmount", amount);
    localStorage.setItem("loanRate", rate);
    localStorage.setItem("loanTermYears", termYears);
    localStorage.setItem("loanTermMonths", termMonths);
    localStorage.setItem("loanPaymentDay", paymentDay);
    localStorage.setItem("loanDisbursementDate", disbursementDate);

    onCalculate({
      amount: parsedAmount,
      annualRate: parsedRate,
      termMonths: totalMonths,
      paymentDay: parsedDay,
      disbursementDate: new Date(disbursementDate + "T00:00:00"),
    });
  };

  return (
    <form className="bg-white rounded-xl shadow-sm p-7" onSubmit={handleSubmit}>
      <h2 className="text-xl mb-5 text-blue-900 font-semibold">
        {t("loanForm.title")}
      </h2>

      <div className="mb-4">
        <label
          className="block text-sm font-semibold text-slate-800 mb-1"
          htmlFor="amount"
        >
          {t("loanForm.amountLabel")}
        </label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          step="0.01"
          required
          className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-[0.95rem] text-slate-800 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-semibold text-slate-800 mb-1"
          htmlFor="rate"
        >
          {t("loanForm.rateLabel")}
        </label>
        <input
          id="rate"
          type="number"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          min="0.01"
          step="0.01"
          required
          className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-[0.95rem] text-slate-800 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-800 mb-1">
          {t("loanForm.termLabel")}
        </label>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 flex-1">
            <input
              id="termYears"
              type="number"
              value={termYears}
              onChange={(e) => setTermYears(e.target.value)}
              min="0"
              max="50"
              required
              className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-[0.95rem] text-slate-800 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">
              {t("loanForm.yearsLabel")}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-1">
            <input
              id="termMonths"
              type="number"
              value={termMonths}
              onChange={(e) => setTermMonths(e.target.value)}
              min="0"
              max="11"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-[0.95rem] text-slate-800 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">
              {t("loanForm.monthsLabel")}
            </span>
          </div>
        </div>
        {totalMonths > 0 && (
          <span className="block mt-1 text-xs text-slate-500">
            {t("loanForm.totalMonthsHelper", { totalMonths })}
          </span>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-semibold text-slate-800 mb-1"
          htmlFor="paymentDay"
        >
          {t("loanForm.paymentDayLabel")}
        </label>
        <input
          id="paymentDay"
          type="number"
          value={paymentDay}
          onChange={(e) => setPaymentDay(e.target.value)}
          min="1"
          max="28"
          required
          className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-[0.95rem] text-slate-800 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label
          className="block text-sm font-semibold text-slate-800 mb-1"
          htmlFor="disbursementDate"
        >
          {t("loanForm.disbursementDateLabel")}
        </label>
        <input
          id="disbursementDate"
          type="date"
          value={disbursementDate}
          onChange={(e) => setDisbursementDate(e.target.value)}
          required
          className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-[0.95rem] text-slate-800 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-md transition-colors cursor-pointer text-base shadow-sm active:transform active:scale-[0.98]"
      >
        {t("loanForm.calculateButton")}
      </button>
    </form>
  );
}
