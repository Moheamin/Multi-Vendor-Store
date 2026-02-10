import { StatCard } from "../components/Statcard";
import { statsData, usersData, storesData } from "@/app/_lib/Dummy";

// We no longer need the isDark prop!
export function OverviewTab() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatCard
            key={stat.label}
            stat={stat}
            index={index}
            // Removed isDark prop - StatCard should also be updated to use variables
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="border border-border rounded-xl p-6 transition-colors duration-300 bg-marketplace-card shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-marketplace-text-primary">
            المستخدمون الجدد
          </h2>
          <div className="space-y-3">
            {usersData.slice(0, 4).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg transition-colors bg-marketplace-bg hover:bg-marketplace-card-hover"
              >
                <div>
                  <div className="font-semibold text-marketplace-text-primary">
                    {user.name}
                  </div>
                  <div className="text-sm text-marketplace-text-secondary">
                    {user.email}
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs ${
                    user.status === "نشط"
                      ? "bg-green-500/20 text-green-500"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {user.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Stores */}
        <div className="border border-border rounded-xl p-6 transition-colors duration-300 bg-marketplace-card shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-marketplace-text-primary">
            أفضل المتاجر
          </h2>
          <div className="space-y-3">
            {storesData.slice(0, 4).map((store) => (
              <div
                key={store.id}
                className="flex items-center justify-between p-3 rounded-lg transition-colors bg-marketplace-bg hover:bg-marketplace-card-hover"
              >
                <div>
                  <div className="font-semibold text-marketplace-text-primary">
                    {store.name}
                  </div>
                  <div className="text-sm text-marketplace-text-secondary">
                    {store.products} منتج
                  </div>
                </div>
                <div className="text-marketplace-accent font-bold">
                  {store.revenue}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
