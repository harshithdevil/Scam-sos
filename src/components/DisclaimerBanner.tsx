import { memo } from 'react';
import { AlertCircle } from 'lucide-react';

interface DisclaimerBannerProps {
  text: string;
}

export const DisclaimerBanner = memo(function DisclaimerBanner({ text }: DisclaimerBannerProps) {
  return (
    <div
      role="note"
      className="glass-surface flex items-start gap-3 rounded-[20px] px-5 py-4 text-xs leading-relaxed text-cyber-secondary sm:text-sm print:border-slate-300 print:bg-slate-50 print:text-slate-700"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37] print:text-slate-700" aria-hidden="true" />
      <p className="print-muted-dark">{text}</p>
    </div>
  );
});
