// DEPRECATED: Use the individual service files instead.
// This file is kept only for USER_MAPPER export.
// Do NOT re-add any server imports here.

export { supabase as getClientSupabase } from "../supabase/client";

export const USER_MAPPER = {
  roles: {
    dbToUi: { admin: "مدير", seller: "تاجر", buyer: "مشتري", guest: "زائر" },
    uiToDb: { مدير: "admin", تاجر: "seller", مشتري: "buyer", زائر: "guest" },
  },
  status: {
    dbToUi: (val: boolean) => (val ? "نشط" : "غير نشط"),
    uiToDb: (val: string) => val === "نشط",
  },
};
