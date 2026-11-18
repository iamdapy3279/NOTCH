import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function BrochureEmailModal({
  isOpen,
  onClose,
  onSuccess,
  fileName = 'NOTCH_Product_Brochure.pdf',
  fileUrl = '/assets/NOTCH_Product_Brochure.pdf',
}) {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Trigger browser file download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const submittedEmail = email.trim();
    setEmail('');
    onClose?.();
    onSuccess?.(submittedEmail);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF7F2] text-[#1B251D] w-full max-w-sm rounded-2xl p-6 border border-[#D9D1C2] shadow-2xl relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close popup"
          className="absolute top-4 right-4 text-[#65736A] hover:text-[#19241C] p-1 rounded-full hover:bg-[#EAE2D5] transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-extrabold text-[#19241C] font-['Outfit'] pr-6">
          Download Brochure
        </h3>
        <p className="text-xs text-[#5A685E] mt-1">
          Enter your email to download the PDF catalogue.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5CCC0] text-sm text-[#19241C] focus:outline-none focus:border-[#28543E]"
          />
          <button
            type="submit"
            className="w-full bg-[#28543E] hover:bg-[#1E4231] text-white py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            Download PDF
          </button>
        </form>
      </div>
    </div>
  );
}
