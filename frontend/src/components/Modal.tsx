import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--black)]">{title}</h2>
          <button onClick={onClose} className="text-[var(--maroon)] hover:text-[var(--black)]">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;