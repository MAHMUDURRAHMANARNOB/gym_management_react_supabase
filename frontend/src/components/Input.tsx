import { ChangeEvent } from 'react';

interface InputProps {
  type: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  label: string;
}

function Input({ type, name, value, onChange, placeholder, required, label }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-[var(--black)] text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input"
      />
    </div>
  );
}

export default Input;