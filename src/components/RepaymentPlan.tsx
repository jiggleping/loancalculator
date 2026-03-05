import { useTranslation } from "react-i18next";
import type { AmortizationRow } from "../types/loan";
import { formatDate, formatNumber } from "../utils/loanCalculations";

interface Props {
  rows: AmortizationRow[];
}

export default function RepaymentPlan({ rows }: Props) {
  const { t } = useTranslation();

  const hasIntercalary = rows.some((r) => r.isIntercalary);

  // Totals (excluding intercalary for principal sum)
  const totals = rows.reduce(
    (acc, row) => ({
      payment: acc.payment + row.payment,
      principal: acc.principal + row.principal,
      interest: acc.interest + row.interest,
    }),
    { payment: 0, principal: 0, interest: 0 },
  );

  const isCurrentMonth = (row: AmortizationRow) => {
    const today = new Date();

    // If today's date is past the annuity date, highlight the next month's payment instead
    if (today.getDate() > row.date.getDate()) {
      today.setMonth(today.getMonth() + 1);
    }

    return (
      row.date.getMonth() === today.getMonth() &&
      row.date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-7 overflow-hidden">
      <h2 className="text-xl mb-5 text-blue-900 font-semibold">
        {t("repaymentPlan.title")}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-100">
              <th className="py-3 px-3 text-left font-semibold text-slate-600 text-sm">
                {t("repaymentPlan.columns.number")}
              </th>
              <th className="py-3 px-3 text-left font-semibold text-slate-600 text-sm">
                {t("repaymentPlan.columns.date")}
              </th>
              <th className="py-3 px-3 text-right font-semibold text-slate-600 text-sm">
                {t("repaymentPlan.columns.annuity")}
              </th>
              <th className="py-3 px-3 text-right font-semibold text-slate-600 text-sm">
                {t("repaymentPlan.columns.principal")}
              </th>
              <th className="py-3 px-3 text-right font-semibold text-slate-600 text-sm">
                {t("repaymentPlan.columns.interest")}
              </th>
              <th className="py-3 px-3 text-right font-semibold text-slate-600 text-sm">
                {t("repaymentPlan.columns.remainingBalance")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.number}
                className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                  isCurrentMonth(row) ? "bg-amber-100" : "even:bg-slate-50"
                }`}
              >
                <td className="py-3 px-3 text-sm text-slate-700">
                  {row.isIntercalary ? "0*" : row.number}
                </td>
                <td className="py-3 px-3 text-sm text-slate-700">
                  {formatDate(row.date)}
                </td>
                <td className="py-3 px-3 text-sm text-slate-700 text-right">
                  {formatNumber(row.payment)}
                </td>
                <td className="py-3 px-3 text-sm text-slate-700 text-right">
                  {formatNumber(row.principal)}
                </td>
                <td className="py-3 px-3 text-sm text-slate-700 text-right">
                  {formatNumber(row.interest)}
                </td>
                <td className="py-3 px-3 text-sm text-slate-700 text-right font-medium">
                  {formatNumber(row.remainingBalance)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold bg-slate-100 border-t-2 border-slate-200 text-slate-900">
              <td colSpan={2} className="py-3 px-4 text-left">
                {t("repaymentPlan.totals")}
              </td>
              <td className="py-3 px-3 text-right">
                {formatNumber(totals.payment)}
              </td>
              <td className="py-3 px-3 text-right">
                {formatNumber(totals.principal)}
              </td>
              <td className="py-3 px-3 text-right">
                {formatNumber(totals.interest)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      {hasIntercalary && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-4">
          {t("repaymentPlan.intercalaryNote")}
        </p>
      )}
    </div>
  );
}
