"use client";

type DashboardClientProps = {
  initialData: any;
};

export default function DashboardClient({ initialData }: DashboardClientProps) {
  // TODO: replace this with your real dashboard UI
  return (
    <div dir="rtl">
      <h2>لوحة التحكم</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(initialData, null, 2)}
      </pre>
    </div>
  );
}
