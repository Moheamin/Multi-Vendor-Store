"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { FormField, Input, Select, SubmitButton } from "./FormComponents";
import {
  adminUpdateUser,
  adminCreateUser,
} from "@/app/_lib/data-services/admin-service";
import { toast } from "react-hot-toast";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any | null;
  onSuccess: () => void;
}

const EMPTY_FORM = {
  full_name: "",
  email: "",
  phone: "",
  role: "buyer",
  status: "نشط",
};

export function UserModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UserModalProps) {
  const isEdit = Boolean(user?.id);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && user) {
      const roleToValue: Record<string, string> = {
        مدير: "admin",
        تاجر: "seller",
        مشتري: "buyer",
        زائر: "guest",
      };

      setForm({
        full_name: user.full_name ?? user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        role: roleToValue[user.role] || user.role || "buyer",
        status:
          user.status === true || user.status === "نشط" ? "active" : "inactive",
      });
    } else {
      setForm({ ...EMPTY_FORM });
    }
  }, [isOpen, user, isEdit]);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.full_name.trim()) {
      toast.error("الاسم الكامل مطلوب");
      return;
    }
    setIsLoading(true);
    try {
      if (isEdit) {
        await adminUpdateUser(user.id, form);
        toast.success("تم تحديث المستخدم بنجاح");
      } else {
        await adminCreateUser(form);
        toast.success("تم إنشاء المستخدم بنجاح");
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "تعديل بيانات المستخدم" : "إضافة مستخدم جديد"}
    >
      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
        <FormField label="الاسم الكامل" required>
          <Input
            placeholder="أدخل الاسم الكامل"
            value={form.full_name}
            onChange={(e) => updateField("full_name", e.target.value)}
          />
        </FormField>

        <FormField label="رقم الهاتف">
          <Input
            type="tel"
            placeholder="05xxxxxxxx"
            dir="ltr"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
        </FormField>

        <FormField label="البريد الإلكتروني">
          <Input
            type="email"
            placeholder="example@email.com"
            dir="ltr"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="الدور الوظيفي">
            <Select
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
            >
              <option value="buyer">مشتري</option>
              <option value="seller">تاجر</option>
              <option value="admin">مدير</option>
              <option value="guest">زائر</option>
            </Select>
          </FormField>

          <FormField label="حالة الحساب">
            <Select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
            >
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </Select>
          </FormField>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-marketplace-border">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-marketplace-border text-sm font-semibold hover:bg-marketplace-bg/60 transition"
          >
            إلغاء
          </button>
          <SubmitButton
            isLoading={isLoading}
            label={isEdit ? "حفظ التغييرات" : "إنشاء المستخدم"}
            className="w-40 bg-marketplace-accent"
          />
        </div>
      </form>
    </Modal>
  );
}
