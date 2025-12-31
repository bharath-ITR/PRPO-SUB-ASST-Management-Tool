import React from "react";

const statusLevelMap = {
  "pending for approval": 1,
  "in process": 2,
  processing: 3,
};

const currencyIcons = { INR: "₹", USD: "$", AED: "د.إ" };

const bgColors = ["bg-white", "bg-white", "bg-white"];
const iconColors = ["text-blue-600", "text-green-600", "text-orange-600"];
const badgeColors = ["bg-blue-500", "bg-green-500", "bg-orange-500"];

const CurrencyWidgets = ({ selectedLevel, dashboardData }) => {
  const getLevelCurrencyData = (level, data) => {
    if (!data) return {};
    const currencyTotals = {};
    data.forEach((pr) => {
      const prStatus = pr.status?.toLowerCase()?.trim();
      const prLevel = statusLevelMap[prStatus];
      if (prLevel !== level) return;

      const currency = pr.body?.currency || "INR";
      const amount = parseFloat(pr.body?.approxCost?.replace(/[^0-9.-]+/g, "")) || 0;

      if (!currencyTotals[currency]) currencyTotals[currency] = { totalAmount: 0, count: 0 };
      currencyTotals[currency].totalAmount += amount;
      currencyTotals[currency].count += 1;
    });
    return currencyTotals;
  };

  const levelData = getLevelCurrencyData(selectedLevel, dashboardData);

  return (
    <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {["INR", "USD", "AED"].map((currency, index) => {
        const data = levelData[currency] || { totalAmount: 0, count: 0 };

        const formattedAmount = data.totalAmount.toLocaleString("en-IN", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });

        return (
          <div
            key={currency}
            className={`rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-md border border-transparent hover:border-blue-400 transition-all duration-300 ${bgColors[index % 3]}`}
          >
            {/* Top section: amount on left + faded icon on right */}
            <div className="flex items-center justify-between mb-3">
              <div>
                {/* Show like INR 10,000 */}
                <p className="text-2xl font-semibold text-gray-800">
                  {currency} {formattedAmount}
                </p>
              </div>

              <span
                className={`text-5xl opacity-30 ${iconColors[index % 3]} select-none`}
              >
                {currencyIcons[currency] || currency}
              </span>
            </div>

            {/* Bottom section: PR count (left) & Level info (right) */}
            <div className="flex items-center justify-between mt-2">
              {/* PR count on left */}
              <span
                className={`text-xs ${badgeColors[index % 3]} px-2 py-0.5 rounded-full uppercase text-gray-100 font-medium`}
              >
                {data.count} PR(s)
              </span>

              {/* Level info on right */}
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">
                Level {selectedLevel} Pending
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CurrencyWidgets;
