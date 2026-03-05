import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { LoanResult } from "../types/loan";
import {
  calculateAccumulatedInterest,
  calculateRemainingInterest,
  calculateRemainingPrincipal,
  formatNumber,
} from "../utils/loanCalculations";

interface Props {
  result: LoanResult;
}

export default function Statistics({ result }: Props) {
  const { t } = useTranslation();

  const today = new Date().toISOString().split("T")[0];

  const [simulationDate, setSimulationDate] = useState(today);

  const remainingPrincipal = calculateRemainingPrincipal(
    result.rows,
    new Date(simulationDate),
  );
  const remainingInterest = calculateRemainingInterest(
    result.rows,
    new Date(simulationDate),
  );
  const accumulatedInterest = calculateAccumulatedInterest(
    result.rows,
    new Date(simulationDate),
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-7 h-fit self-start">
      <h2 className="text-xl mb-5 text-blue-900 font-semibold">
        {t("statistics.title")}
      </h2>

      <div className="mb-4">
        <label
          htmlFor="simulationDate"
          className="block text-sm font-semibold text-slate-800 mb-1"
        >
          {t("statistics.selectedDate")}
        </label>
        <input
          id="simulationDate"
          type="date"
          value={simulationDate}
          onChange={(e) => setSimulationDate(e.target.value)}
          required
          className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-[0.95rem] text-slate-800 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {simulationDate !== today && (
          <div className="w-full text-center mt-2">
            <button
              type="button"
              onClick={() =>
                setSimulationDate(new Date().toISOString().split("T")[0])
              }
              className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer underline hover:no-underline"
            >
              {t("loanForm.resetToToday")}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-grow">
        <div className="bg-gray-100 rounded-md p-4 flex flex-col justify-end h-22">
          <span className="text-sm font-medium text-gray-500">
            {t("statistics.remainingPayOff")}
          </span>
          <span className="block text-lg font-bold text-gray-800">
            {formatNumber(remainingPrincipal + accumulatedInterest)} €
          </span>
        </div>

        <div className="bg-gray-100 rounded-md p-4 flex flex-col justify-end h-22">
          <span className="text-sm font-medium text-gray-500">
            {t("statistics.accumulatedInterest")}
          </span>
          <span className="block text-lg font-bold text-gray-800">
            {formatNumber(accumulatedInterest)} €
          </span>
        </div>

        <div className="bg-gray-100 rounded-md p-4 flex flex-col justify-end h-22">
          <span className="text-sm font-medium text-gray-500">
            {t("statistics.remainingPrincipal")}
          </span>
          <span className="block text-lg font-bold text-gray-800">
            {formatNumber(remainingPrincipal)} €
          </span>
        </div>

        <div className="bg-gray-100 rounded-md p-4 flex flex-col justify-end h-22">
          <span className="text-sm font-medium text-gray-500">
            {t("statistics.remainingInterest")}
          </span>
          <span className="block text-lg font-bold text-gray-800">
            {formatNumber(remainingInterest)} €
          </span>
        </div>
      </div>

      <div className="my-3 h-0.5 bg-gray-100" />

      <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-grow">
        <div className="bg-gray-100 rounded-md p-4 flex flex-col justify-end h-22">
          <span className="text-sm font-medium text-gray-500">
            {t("statistics.totalPrincipal")}
          </span>
          <span className="block text-lg font-bold text-gray-800">
            {formatNumber(result.totalPrincipal)} €
          </span>
        </div>

        <div className="bg-gray-100 rounded-md p-4 flex flex-col justify-end h-22">
          <span className="text-sm font-medium text-gray-500">
            {t("statistics.totalInterest")}
          </span>
          <span className="block text-lg font-bold text-gray-800">
            {formatNumber(result.totalInterest)} €
          </span>
        </div>

        <div className="bg-gray-100 rounded-md p-4 flex flex-col justify-end h-22">
          <span className="text-sm font-medium text-gray-500">
            {t("statistics.monthlyAnnuity")}
          </span>
          <span className="block text-lg font-bold text-gray-800">
            {formatNumber(result.monthlyAnnuity)} €
          </span>
        </div>

        <div className="bg-blue-600 text-white rounded-md p-4 flex flex-col justify-end h-22">
          <span className="text-sm font-medium">
            {t("statistics.totalPayment")}
          </span>
          <span className="block text-lg font-bold">
            {formatNumber(result.totalPayment)} €
          </span>
        </div>
      </div>
    </div>
  );
}
