import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner = () => {
  return (
    <div className="bg-amber-500/[0.07] border border-amber-500/25 rounded-2xl p-4 mb-8 flex items-start space-x-3 text-xs sm:text-sm text-amber-200/90 shadow-[0_0_20px_rgba(245,158,11,0.08)] backdrop-blur-md">
      <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
      </div>
      <div>
        <span className="font-bold text-amber-300">Legal Notice:</span> This AI application analyzes contracts and privacy policies to generate simplified summaries and highlight potentially risky terms for informational purposes. It does <span className="underline decoration-amber-400 font-semibold text-amber-200">not</span> constitute formal legal counsel. Always consult a licensed attorney for binding legal matters.
      </div>
    </div>
  );
};
