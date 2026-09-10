import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner = () => {
  return (
    <div className="bg-amber-950/40 border border-amber-800/50 rounded-xl p-3 sm:p-3.5 mb-6 flex items-start space-x-3 text-xs sm:text-sm text-amber-200/90 shadow-sm">
      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-amber-300">Important Disclaimer:</span> This AI tool translates complex legal text into simplified summaries and flags potentially unfavorable clauses for educational & informational purposes. It does <span className="underline decoration-amber-400/50">not</span> constitute formal legal counsel. Always consult a qualified attorney for binding contract decisions.
      </div>
    </div>
  );
};
