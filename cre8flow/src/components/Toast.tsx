import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const bgColor = type === 'success' ? 'bg-[#16a34a]' : 'bg-[#dc2626]';
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${bgColor} text-white text-sm px-5 py-3 rounded-xl shadow-lg`}
      role="alert"
      onClick={onClose}
    >
      {message}
    </div>
  );
}
