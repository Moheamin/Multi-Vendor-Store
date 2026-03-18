export default function DashboardLoadingSkeleton() {
  return (
    /* Change: Added 'md:mr-72' to match your Sidebar width and 'mr-0' for mobile.
       Added 'pt-20' on mobile to clear the absolute/fixed header if you have one.
    */
    <main
      className="md:mr-72 p-4 md:p-8 min-h-screen bg-marketplace-bg"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title Skeleton */}
        <div className="flex items-center justify-between mb-2">
          <div className="h-10 w-48 md:w-64 bg-marketplace-card/50 backdrop-blur-sm rounded-2xl animate-pulse" />
          <div className="hidden md:block h-10 w-32 bg-marketplace-card/30 rounded-xl animate-pulse" />
        </div>

        {/* Stats Grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-marketplace-card/40 backdrop-blur-md rounded-[2rem] border border-border/50 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }} // Staggered fade effect
            />
          ))}
        </div>

        {/* Main Content Area: Adjusted height for mobile/desktop */}
        <div className="space-y-6">
          <div className="h-[300px] md:h-[500px] bg-marketplace-card/40 backdrop-blur-md rounded-[2.5rem] border border-border/50 animate-pulse" />

          {/* Bottom section for mobile extra flair */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-marketplace-card/30 rounded-[2rem] animate-pulse" />
            <div className="h-64 bg-marketplace-card/30 rounded-[2rem] animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
