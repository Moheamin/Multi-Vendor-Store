"use client";

export default function Footer() {
  return (
    <footer
      className="border-t mt-20 transition-colors duration-300
        /* Light Mode */
        border-gray-200 bg-gray-50
        /* Dark Mode */
        dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-[var(--marketplace-text-primary)] mb-4">
              حول
            </h3>
            <p className="text-sm text-[var(--marketplace-text-secondary)]">
              سوق متعدد البائعين يربط المشترين بالتجار الموثوقين.
            </p>
          </div>

          {/* Link groups */}
          {[
            {
              title: "للمشترين",
              links: ["تصفح المتاجر", "كيف يعمل", "الدعم"],
            },
            {
              title: "للتجار",
              links: ["كن تاجراً", "لوحة التحكم", "الموارد"],
            },
            {
              title: "قانوني",
              links: ["شروط الخدمة", "سياسة الخصوصية", "سياسة الكوكيز"],
            },
          ].map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold text-[var(--marketplace-text-primary)] mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2 text-sm text-[var(--marketplace-text-secondary)]">
                {group.links.map((link) => (
                  <li
                    key={link}
                    className="hover:text-[var(--marketplace-accent)] cursor-pointer transition-colors"
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-[var(--marketplace-text-secondary)] border-gray-200 dark:border-[#2a2a2a]">
          © 2026 السوق الإلكتروني. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
