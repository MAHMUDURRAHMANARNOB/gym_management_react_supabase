import { ChangeEvent } from 'react';

interface SelectProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  label: string;
}

function Select({ name, value, onChange, options, label }: SelectProps) {
  return (
    <div className="space-y-1">
      <label className="block text-[var(--black)] text-sm font-medium">{label}</label>
      <select name={name} value={value} onChange={onChange} className="select">
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;