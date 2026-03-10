"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Store, User, FileText, Loader2, Clock } from "lucide-react";
import {
  getPendingRequests,
  handleRequestDecision,
} from "@/app/_lib/data-services/admin-service";
import { toast } from "react-hot-toast";

export function RequestsTab() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      const data = await getPendingRequests();
      setRequests(data);
    } catch (err) {
      toast.error("فشل في تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  }

  async function onAction(
    storeId: string,
    sellerId: string,
    type: "approve" | "reject",
  ) {
    setProcessingId(storeId);
    try {
      await handleRequestDecision(storeId, sellerId, type);
      toast.success(
        type === "approve" ? "✅ تم قبول المتجر بنجاح" : "❌ تم رفض الطلب",
      );
      setRequests((prev) => prev.filter((r) => r.id !== storeId));
    } catch (err) {
      toast.error("حدث خطأ أثناء المعالجة");
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="animate-spin text-marketplace-accent" size={40} />
        <p className="text-marketplace-text-secondary font-bold">
          جاري تحميل الطلبات...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-marketplace-card border border-marketplace-border rounded-[2rem] p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-marketplace-text-secondary text-xs font-bold uppercase tracking-wider">
              طلبات معلقة
            </p>
            <p className="text-3xl font-black text-marketplace-text-primary">
              {requests.length}
            </p>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-20 bg-marketplace-card rounded-3xl border border-dashed border-marketplace-border"
          >
            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-500" />
            </div>
            <h3 className="text-marketplace-text-primary font-black text-lg mb-2">
              لا توجد طلبات معلقة
            </h3>
            <p className="text-marketplace-text-secondary text-sm">
              تمت معالجة جميع طلبات الانضمام
            </p>
          </motion.div>
        ) : (
          requests.map((req, index) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-marketplace-card border border-marketplace-border p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="flex gap-4 flex-1">
                <div className="w-14 h-14 bg-marketplace-accent/10 rounded-2xl flex items-center justify-center text-marketplace-accent flex-shrink-0">
                  <Store size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-marketplace-text-primary mb-1">
                    {req.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-marketplace-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <User size={13} />
                      <span>
                        المالك:{" "}
                        <span className="font-bold text-marketplace-text-primary">
                          {req.profiles?.full_name || "—"}
                        </span>
                      </span>
                    </div>
                    {req.profiles?.email && (
                      <span className="text-xs opacity-60">
                        {req.profiles.email}
                      </span>
                    )}
                  </div>
                  {req.description && (
                    <div className="flex items-start gap-1.5 text-sm text-marketplace-text-secondary mt-1.5">
                      <FileText size={13} className="mt-0.5 flex-shrink-0" />
                      <p className="line-clamp-2 text-xs">{req.description}</p>
                    </div>
                  )}
                  {req.created_at && (
                    <p className="text-[10px] text-marketplace-text-secondary opacity-50 mt-1.5">
                      تاريخ الطلب:{" "}
                      {new Date(req.created_at).toLocaleDateString("ar-SA")}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  disabled={!!processingId}
                  onClick={() =>
                    onAction(req.id, req.seller_id || req.owner_id, "approve")
                  }
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 px-6 py-2.5 rounded-xl font-bold transition-all border border-green-500/20 disabled:opacity-50"
                >
                  {processingId === req.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  قبول
                </button>
                <button
                  disabled={!!processingId}
                  onClick={() =>
                    onAction(req.id, req.seller_id || req.owner_id, "reject")
                  }
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-2.5 rounded-xl font-bold transition-all border border-red-500/20 disabled:opacity-50"
                >
                  <X size={16} />
                  رفض
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
