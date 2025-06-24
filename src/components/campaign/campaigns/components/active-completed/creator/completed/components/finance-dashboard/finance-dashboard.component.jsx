import { ChevronDown, ChevronUp } from "lucide-react";

const FinanceDashboard = ({
  paymentHistory,
  upcomingPayments,
  expandedMonths,
  setExpandedMonths,
}) => {
  const totalEarnings = Object.values(paymentHistory).reduce((sum, month) => sum + month.total, 0);

  const toggleMonth = (month) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
  };

  return (
    <div className="w-1/5 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Finance Dashboard</h2>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Earnings</p>
          <p className="text-3xl font-bold text-green-600">${totalEarnings.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Payment History */}
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Payment History</h3>
          <div className="space-y-2">
            {Object.entries(paymentHistory).map(([month, data]) => (
              <div key={month} className="border border-gray-200 rounded-lg">
                <div
                  onClick={() => toggleMonth(month)}
                  className="p-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">{month}</p>
                    <p className="text-green-600 font-semibold">${data.total}</p>
                  </div>
                  {expandedMonths[month] ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                {expandedMonths[month] && (
                  <div className="h-40 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {data.payments.map((payment, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                        <p className="font-medium text-gray-900 truncate">{payment.campaign}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-900">${payment.amount}</span>
                          <span className="text-gray-500">{payment.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Upcoming Payments</h3>
          <div className="space-y-3">
            {upcomingPayments.map((payment, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-900 truncate">{payment.campaign}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-lg font-semibold text-gray-900">${payment.amount}</span>
                  <span className="text-xs text-gray-600">
                    {new Date(payment.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
