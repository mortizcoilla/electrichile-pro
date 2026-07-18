'use client';

import { Input } from '@/components/ui/input';

interface UnitInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  unit: string;
  placeholder?: string;
  type?: string;
  step?: string;
}

export default function UnitInput({
  value,
  onChange,
  label,
  unit,
  placeholder,
  type = 'number',
  step = '0.1',
}: UnitInputProps) {
  return (
    <div className="space-y-2">
      <label className="label-text">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        suffix={unit}
        step={step}
      />
    </div>
  );
}
