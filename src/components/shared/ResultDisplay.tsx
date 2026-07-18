interface ResultDisplayProps {
  label: string;
  value: string;
  unit?: string;
  status?: 'ok' | 'warning' | 'danger';
}

export default function ResultDisplay({ label, value, unit, status }: ResultDisplayProps) {
  const statusColors = {
    ok: 'text-accent-success',
    warning: 'text-accent-warning',
    danger: 'text-accent-danger',
  };

  const statusBgs = {
    ok: 'bg-accent-success/10 border-accent-success/30',
    warning: 'bg-accent-warning/10 border-accent-warning/30',
    danger: 'bg-accent-danger/10 border-accent-danger/30',
  };

  return (
    <div className={`p-4 rounded-xl border ${status ? statusBgs[status] : 'border-border bg-surface'}`}>
      <p className="text-xs text-muted mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${status ? statusColors[status] : 'text-foreground'}`}>
          {value}
        </span>
        {unit && <span className="text-sm text-muted">{unit}</span>}
      </div>
    </div>
  );
}
