import { LucideIcon } from 'lucide-react';

interface CalculatorCardProps {
  icon: LucideIcon;
  title: string;
  color: string;
  onClick: () => void;
}

export default function CalculatorCard({ icon: Icon, title, color, onClick }: CalculatorCardProps) {
  return (
    <button
      onClick={onClick}
      className="card w-full h-full flex flex-col items-center justify-center gap-3 p-5 hover:scale-[1.02] hover:shadow-xl transition-all duration-200 active:scale-[0.98] text-center"
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-8 h-8" style={{ color }} strokeWidth={1.5} />
      </div>
      <span className="text-sm font-medium text-foreground">{title}</span>
    </button>
  );
}
