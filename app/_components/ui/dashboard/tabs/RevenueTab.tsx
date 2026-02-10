import {
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { revenueData } from "@/app/_lib/Dummy";

// No prop needed anymore
export function RevenueTab() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "إجمالي الإيرادات",
            value: "197.8 ألف $",
            icon: TrendingUp,
            trend: "+23.1%",
            color: "text-green-500",
            IconComponent: TrendingUp,
          },
          {
            label: "إجمالي الطلبات",
            value: "860",
            icon: Package,
            trend: "+18.4%",
            color: "text-blue-500",
            IconComponent: Package,
          },
          {
            label: "متوسط قيمة الطلب",
            value: "230 $",
            icon: DollarSign,
            trend: "+4.2%",
            color: "text-purple-500",
            IconComponent: DollarSign,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="border border-border rounded-xl p-6 transition-colors duration-300 bg-marketplace-card shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-marketplace-text-secondary">
                {item.label}
              </div>
              <item.IconComponent className={`w-5 h-5 ${item.color}`} />
            </div>
            <div className="text-3xl font-bold text-marketplace-text-primary">
              {item.value}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400 mt-1">
              {item.trend} عن الشهر الماضي
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Analysis Table */}
      <div className="border border-border rounded-xl p-6 transition-colors duration-300 bg-marketplace-card shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-marketplace-text-primary">
          تحليل الإيرادات الشهرية
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right" dir="rtl">
            <thead className="bg-marketplace-bg/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-marketplace-text-secondary font-semibold">
                  الشهر
                </th>
                <th className="px-6 py-4 text-marketplace-text-secondary font-semibold">
                  الإيرادات
                </th>
                <th className="px-6 py-4 text-marketplace-text-secondary font-semibold">
                  الطلبات
                </th>
                <th className="px-6 py-4 text-marketplace-text-secondary font-semibold">
                  النمو
                </th>
                <th className="px-6 py-4 text-marketplace-text-secondary font-semibold">
                  الحالة
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {revenueData.map((data) => (
                <tr
                  key={data.month}
                  className="transition-colors hover:bg-marketplace-card-hover"
                >
                  <td className="px-6 py-4 font-semibold text-marketplace-text-primary">
                    {data.month}
                  </td>
                  <td className="px-6 py-4 text-marketplace-accent font-bold">
                    {data.revenue.toLocaleString()} $
                  </td>
                  <td className="px-6 py-4 text-marketplace-text-secondary">
                    {data.orders}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-1 font-semibold ${
                        data.growth >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {data.growth >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>
                        {data.growth >= 0 ? "+" : ""}
                        {data.growth}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {data.growth >= 10 ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : data.growth >= 0 ? (
                      <CheckCircle className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
