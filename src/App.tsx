import { useState } from "react";
import { useTranslation } from "react-i18next";
import LoanForm from "./components/LoanForm";
import RepaymentPlan from "./components/RepaymentPlan";
import Statistics from "./components/Statistics";
import type { LoanInput, LoanResult } from "./types/loan";
import { calculateLoan } from "./utils/loanCalculations";

const App = () => {
  const { t } = useTranslation();

  const [result, setResult] = useState<LoanResult | null>(null);

  const handleCalculate = (input: LoanInput) => {
    setResult(calculateLoan(input));
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-[1200px] mx-auto px-6 pb-16">
        <header className="text-center py-10 pb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-1">
            {t("app.title")}
          </h1>
          <p className="text-slate-500 text-lg">{t("app.subtitle")}</p>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <LoanForm onCalculate={handleCalculate} />
            {result && <Statistics result={result} />}
          </div>

          {result && <RepaymentPlan rows={result.rows} />}
        </main>
      </div>
    </div>
  );
};

export default App;
