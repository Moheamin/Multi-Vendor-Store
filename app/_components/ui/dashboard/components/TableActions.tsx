import { motion } from "motion/react";
import { Eye, Info, Ban, Edit, Trash2, MoreVertical } from "lucide-react";

interface ActionConfig {
  icon: typeof Eye | typeof Info | typeof Ban | typeof Edit | typeof Trash2;
  color: string;
  hoverBg: string; // Now uses standard tailwind classes
  title: string;
  delay: number;
}

interface TableActionsProps {
  isHovered: boolean;
  actions: ActionConfig[];
}

export function TableActions({ isHovered, actions }: TableActionsProps) {
  if (!isHovered) {
    return (
      <div className="flex justify-end">
        <button className="p-2 rounded-lg transition-colors hover:bg-marketplace-card-hover">
          <MoreVertical className="w-5 h-5 text-marketplace-text-secondary" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: action.delay }}
            className={`p-1.5 ${action.hoverBg} rounded-md transition-colors`}
            title={action.title}
          >
            <Icon className={`w-4 h-4 ${action.color}`} />
          </motion.button>
        );
      })}
    </div>
  );
}

// Predefined action configurations
// Note: We use standard theme colors which work in both modes
export const userActions: ActionConfig[] = [
  {
    icon: Eye,
    color: "text-marketplace-accent",
    hoverBg: "hover:bg-marketplace-accent/10",
    title: "عرض المستخدم",
    delay: 0.05,
  },
  {
    icon: Info,
    color: "text-marketplace-accent",
    hoverBg: "hover:bg-marketplace-accent/10",
    title: "التفاصيل",
    delay: 0.1,
  },
  {
    icon: Ban,
    color: "text-red-500 dark:text-red-400",
    hoverBg: "hover:bg-red-500/10",
    title: "تعليق",
    delay: 0.15,
  },
];

export const storeActions: ActionConfig[] = [
  {
    icon: Eye,
    color: "text-marketplace-accent",
    hoverBg: "hover:bg-marketplace-accent/10",
    title: "عرض المتجر",
    delay: 0.05,
  },
  {
    icon: Info,
    color: "text-marketplace-accent",
    hoverBg: "hover:bg-marketplace-accent/10",
    title: "التفاصيل",
    delay: 0.1,
  },
  {
    icon: Ban,
    color: "text-red-500 dark:text-red-400",
    hoverBg: "hover:bg-red-500/10",
    title: "تعليق",
    delay: 0.15,
  },
];

export const productActions: ActionConfig[] = [
  {
    icon: Eye,
    color: "text-marketplace-accent",
    hoverBg: "hover:bg-marketplace-accent/10",
    title: "عرض المنتج",
    delay: 0.05,
  },
  {
    icon: Edit,
    color: "text-blue-500 dark:text-blue-400",
    hoverBg: "hover:bg-blue-500/10",
    title: "تعديل",
    delay: 0.1,
  },
  {
    icon: Trash2,
    color: "text-red-500 dark:text-red-400",
    hoverBg: "hover:bg-red-500/10",
    title: "حذف",
    delay: 0.15,
  },
];
