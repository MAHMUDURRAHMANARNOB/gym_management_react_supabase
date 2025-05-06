import { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

function Button({ variant = 'primary', onClick, children, className }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;