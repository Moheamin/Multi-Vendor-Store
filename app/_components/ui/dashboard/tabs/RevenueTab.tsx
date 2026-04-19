"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  Store,
  X,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

import { updateOrderVerificationAction } from "@/app/_lib/actions/order-actions";

type OrderStatus =
  | "pending_verification"
  | "verified_sold"
  | "verified_not_sold";

interface OrderRevenueItem {
  id: string;
  date: string;
  month: string;
  year: number;
  storeName: string;
  productName: string;
  price: number;
  profit: number;
  status: OrderStatus;
}

type OrderRevenueItemWithComputed = OrderRevenueItem & {
  displayTime: string;
  shortDate: string;
};

export function RevenueTab({
  revenueData = [],
}: {
  revenueData: OrderRevenueItem[];
}) {
  const router = useRouter();

  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("الكل");
  const [selectedStore, setSelectedStore] = useState("الكل");

  const [selectedOrder, setSelectedOrder] =
    useState<OrderRevenueItemWithComputed | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "verified_sold":
        return {
          text: "مؤكد",
          color: "text-green-500",
          bg: "bg-green-500/10",
          border: "border-green-500/20",
        };
      case "verified_not_sold":
        return {
          text: "مرفوض",
          color: "text-red-500",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
        };
      default:
        return {
          text: "معلق",
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
        };
    }
  };

  const monthsList = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const storeNames = useMemo(
    () => Array.from(new Set(revenueData.map((d) => d.storeName))),
    [revenueData],
  );

  const filteredData = useMemo(() => {
    return revenueData.filter((d) => {
      const matchYear = d.year === selectedYear;
      const matchMonth = selectedMonth === "الكل" || d.month === selectedMonth;
      const matchStore =
        selectedStore === "الكل" || d.storeName === selectedStore;
      return matchYear && matchMonth && matchStore;
    });
  }, [revenueData, selectedYear, selectedMonth, selectedStore]);

  const totals = useMemo(() => {
    let vPrice = 0,
      vProfit = 0,
      vCount = 0,
      pProfit = 0,
      pCount = 0,
      rCount = 0;
    filteredData.forEach((order) => {
      if (order.status === "verified_sold") {
        vPrice += order.price;
        vProfit += order.profit;
        vCount++;
      } else if (order.status === "pending_verification") {
        pProfit += order.profit;
        pCount++;
      } else if (order.status === "verified_not_sold") {
        rCount++;
      }
    });
    return { vPrice, vProfit, vCount, pProfit, pCount, rCount };
  }, [filteredData]);

  const chartData = useMemo(() => {
    return filteredData.map((order) => {
      const d = new Date(order.date);
      return {
        ...order,
        displayTime: `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`,
        shortDate: `${d.getDate()}/${d.getMonth() + 1}`,
      };
    });
  }, [filteredData]);

  const handleStatusUpdate = async (targetStatus: OrderStatus) => {
    if (!selectedOrder || isUpdating) return;
    setIsUpdating(true);
    try {
      const result = await updateOrderVerificationAction(
        selectedOrder.id,
        targetStatus,
      );
      if (result.success) {
        setShowModal(false);
        router.refresh();
      }
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#111] border border-[#333] p-4 rounded-2xl shadow-xl text-right dir-rtl">
          <p className="text-marketplace-text-primary font-black text-xs mb-2 border-b border-white/5 pb-2">
            {data.shortDate} - {data.displayTime}
          </p>
          <p className="text-marketplace-accent font-bold text-[10px]">
            سعر المنتج: <span dir="ltr">{data.price.toLocaleString()} د.ع</span>
          </p>
          <p className="text-green-500 font-bold text-[10px] mt-1">
            ربح الإدارة:{" "}
            <span dir="ltr">{data.profit.toLocaleString()} د.ع</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-12" dir="rtl">
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-marketplace-text-primary tracking-tight">
            السجل المالي
          </h2>
          <p className="text-marketplace-text-secondary mt-1">
            إدارة تعميد الطلبات وتحليل الأرباح
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-marketplace-card border border-marketplace-border px-4 py-2.5 rounded-2xl">
            <Store size={18} className="text-marketplace-accent" />
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="bg-transparent text-sm font-bold outline-none text-marketplace-text-primary cursor-pointer"
            >
              <option value="الكل">جميع المتاجر</option>
              {storeNames.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-marketplace-card border border-marketplace-border px-4 py-2.5 rounded-2xl">
            <Calendar size={18} className="text-marketplace-accent" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-sm font-bold outline-none text-marketplace-text-primary cursor-pointer"
            >
              <option value="الكل">كل الأشهر</option>
              {monthsList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* --- SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          label="أرباح مؤكدة (مؤكد)"
          value={totals.vProfit}
          countLabel={`${totals.vCount} طلب ناجح`}
          icon={<CheckCircle2 />}
          themeColor="green"
          description="أرباح الإدارة المعتمدة حالياً"
        />
        <SummaryCard
          label="أرباح الإدارة (معلق)"
          value={totals.pProfit}
          countLabel={`${totals.pCount} طلب قيد التدقيق`}
          icon={<Clock />}
          themeColor="amber"
          description="أرباح بانتظار التأكيد النهائي"
        />
        <SummaryCard
          label="مبيعات مرفوضة"
          value={totals.rCount}
          countLabel="طلبات لم تتم"
          icon={<ShieldAlert />}
          themeColor="red"
          isCountOnly
          description="عدد العمليات التي تم رفضها"
        />
        <SummaryCard
          label="إجمالي قيمة المبيعات"
          value={totals.vPrice}
          countLabel={`${filteredData.length} عملية`}
          icon={<FileText />}
          themeColor="blue"
          description="أسعار المنتجات المباعة كلياً"
          showTrendIcon
        />
      </div>

      {/* --- CHART & TABLE SECTION --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* GRAPH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 bg-marketplace-card border border-marketplace-border p-8 rounded-[2.5rem] relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-marketplace-text-primary">
              المخطط الزمني - الكل
            </h3>
            <div className="flex items-center gap-4 text-[10px] font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-marketplace-accent" />{" "}
                سعر الطلب
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> ربح
                الإدارة
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00bcd4" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00bcd4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(128,128,128,0.05)"
                />
                <XAxis
                  dataKey="shortDate"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9e9e9e", fontSize: 10 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9e9e9e", fontSize: 10 }}
                  tickFormatter={(v) => `${v >= 1000 ? v / 1000 + "k" : v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#00bcd4"
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* TABLE */}
        <div className="bg-marketplace-card border border-marketplace-border rounded-[2.5rem] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-marketplace-border bg-marketplace-bg/30">
            <h3 className="text-lg font-black text-marketplace-text-primary">
              سجل الطلبات
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[480px] scrollbar-hide">
            <table className="w-full text-right border-collapse">
              <thead className="bg-marketplace-card/90 text-[10px] font-black text-marketplace-text-secondary border-b border-marketplace-border sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4">المنتج / المتجر</th>
                  <th className="px-6 py-4">السعر والأرباح</th>
                  <th className="px-6 py-4 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-marketplace-border">
                {chartData.map((row, idx) => {
                  const status = getStatusDetails(row.status);
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-marketplace-card-hover transition-colors cursor-pointer group"
                      onClick={() => {
                        setSelectedOrder(row);
                        setShowModal(true);
                      }}
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-[11px] text-marketplace-text-primary truncate max-w-[140px] group-hover:text-marketplace-accent transition-colors">
                            {row.productName}
                          </span>
                          <span className="text-[9px] text-marketplace-text-secondary">
                            {row.storeName} • {row.shortDate}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span
                            className="font-black text-[11px] text-marketplace-text-primary"
                            dir="ltr"
                          >
                            {row.price.toLocaleString()} د.ع
                          </span>
                          <span className="text-[9px] text-green-500 font-bold">
                            +{row.profit.toLocaleString()} عمولة
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black border ${status.bg} ${status.color} ${status.border}`}
                        >
                          {status.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL --- */}
      <AnimatePresence>
        {showModal && selectedOrder && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => !isUpdating && setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-marketplace-card border border-marketplace-border rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute left-8 top-8 text-marketplace-text-secondary hover:text-white cursor-pointer"
              >
                <X size={24} />
              </button>
              <h3 className="text-xl font-black text-marketplace-accent mb-10 text-center">
                تحديث حالة الطلب
              </h3>
              <div className="space-y-5 mb-10">
                <DetailRow label="المنتج" value={selectedOrder.productName} />
                <DetailRow label="المتجر" value={selectedOrder.storeName} />
                <DetailRow
                  label="السعر"
                  value={`${selectedOrder.price.toLocaleString()} د.ع`}
                  className="text-marketplace-accent font-black"
                />
                <DetailRow
                  label="الحاله الحاليه"
                  value={getStatusDetails(selectedOrder.status).text}
                  className={`${getStatusDetails(selectedOrder.status).color} font-black`}
                />
              </div>
              <div className="flex flex-col gap-4">
                {selectedOrder.status === "pending_verification" ? (
                  <div className="flex gap-4">
                    <button
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate("verified_sold")}
                      className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isUpdating ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <ShieldCheck size={18} />
                      )}{" "}
                      تأكيد البيع
                    </button>
                    <button
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate("verified_not_sold")}
                      className="flex-1 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShieldAlert size={18} /> رفض
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate("pending_verification")}
                    className="w-full py-4 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Clock size={18} /> إعادة لحالة المعلق
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- UPDATED MATTE SUMMARY CARD COMPONENT ---
function SummaryCard({
  label,
  value,
  countLabel,
  icon,
  themeColor = "blue",
  isCountOnly = false,
  description = "",
  showTrendIcon = false,
}: {
  label: string;
  value: number;
  countLabel: string;
  icon: React.ReactNode;
  themeColor: "blue" | "green" | "amber" | "red";
  isCountOnly?: boolean;
  description?: string;
  showTrendIcon?: boolean;
}) {
  const themes = {
    blue: {
      border: "border-blue-500/30",
      bg: "bg-blue-500/10",
      text: "text-blue-500",
    },
    green: {
      border: "border-green-500/30",
      bg: "bg-green-500/10",
      text: "text-green-500",
    },
    amber: {
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      text: "text-amber-500",
    },
    red: {
      border: "border-red-500/30",
      bg: "bg-red-500/10",
      text: "text-red-500",
    },
  };

  const current = themes[themeColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-marketplace-card border ${current.border} p-7 rounded-[2.5rem] group transition-all relative overflow-hidden`}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-12 h-12 rounded-[1.25rem] ${current.bg} ${current.text} flex items-center justify-center`}
        >
          {icon}
        </div>
        <div className={`${current.bg} px-3 py-1 rounded-full`}>
          <span
            className={`${current.text} text-[10px] font-black tracking-tight`}
          >
            {countLabel}
          </span>
        </div>
      </div>

      <p className="text-marketplace-text-secondary text-[11px] font-black uppercase tracking-wider">
        {label}
      </p>

      <div className="flex flex-col mt-2">
        <h3
          className="text-3xl font-black text-marketplace-text-primary leading-tight"
          dir="ltr"
        >
          {isCountOnly ? value : value.toLocaleString()}
          {!isCountOnly && (
            <span className="text-sm font-bold text-marketplace-text-secondary ml-1">
              د.ع
            </span>
          )}
        </h3>

        {description && (
          <div
            className={`flex items-center gap-1.5 mt-3 ${current.text} opacity-80`}
          >
            {showTrendIcon && <TrendingUp size={14} />}
            <p className="text-[11px] font-black">{description}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DetailRow({ label, value, className = "" }: any) {
  return (
    <div className="flex justify-between items-center border-b border-white/5 pb-4">
      <span className="text-[11px] font-bold text-marketplace-text-secondary">
        {label}:
      </span>
      <span
        className={`text-[11px] font-bold text-marketplace-text-primary text-left ${className}`}
      >
        {value}
      </span>
    </div>
  );
}
