"use client";

import { useState, useEffect } from "react";
import { Check, X, Store, User, FileText, Loader2 } from "lucide-react";
import {
  getPendingRequests,
  handleRequestDecision,
} from "@/app/_lib/data-service";
import { toast } from "react-hot-toast"; // Assuming you use a toast library

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
        type === "approve" ? "تم قبول المتجر بنجاح" : "تم رفض الطلب",
      );
      setRequests((prev) => prev.filter((r) => r.id !== storeId));
    } catch (err) {
      toast.error("حدث خطأ أثناء المعالجة");
    } finally {
      setProcessingId(null);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-marketplace-accent" size={40} />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {requests.length === 0 ? (
          <div className="text-center p-20 bg-marketplace-card rounded-3xl border border-dashed border-border">
            <p className="text-marketplace-text-secondary">
              لا توجد طلبات انضمام حالياً
            </p>
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="bg-marketplace-card border border-border p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-marketplace-accent/10 rounded-2xl flex items-center justify-center text-marketplace-accent">
                  <Store size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-marketplace-text-primary">
                    {req.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-marketplace-text-secondary mt-1">
                    <User size={14} />
                    <span>المالك: {req.profiles?.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-marketplace-text-secondary">
                    <FileText size={14} />
                    <p className="max-w-md truncate">{req.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  disabled={!!processingId}
                  onClick={() => onAction(req.id, req.seller_id, "approve")}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 px-6 py-2.5 rounded-xl font-bold transition-all"
                >
                  <Check size={18} /> قبول
                </button>
                <button
                  disabled={!!processingId}
                  onClick={() => onAction(req.id, req.seller_id, "reject")}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-2.5 rounded-xl font-bold transition-all"
                >
                  <X size={18} /> رفض
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
