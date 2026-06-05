import React from 'react';

interface StatsPanelProps {
  storageUsed?: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ storageUsed = 45 }) => {
  return (
    <div className="bg-surface-bright rounded-xl border border-outline-variant/50 shadow-sm p-stack-md flex flex-col gap-stack-md">
      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold border-b border-outline-variant/30 pb-stack-sm">
        Processing Engine
      </h3>
      
      <div className="flex-1 flex flex-col gap-stack-sm justify-center py-2">
        <div className="flex items-start gap-stack-sm p-stack-sm rounded-lg bg-surface-container-lowest border border-outline-variant/30">
          <span className="material-symbols-outlined text-secondary mt-0.5 text-xl">document_scanner</span>
          <div>
            <h4 className="font-body-md text-body-md font-semibold text-on-surface">OCR Text Extraction</h4>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">High-fidelity parsing of complex layouts.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-stack-sm p-stack-sm rounded-lg bg-surface-container-lowest border border-outline-variant/30">
          <span className="material-symbols-outlined text-secondary mt-0.5 text-xl">account_tree</span>
          <div>
            <h4 className="font-body-md text-body-md font-semibold text-on-surface">Semantic Chunking</h4>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Optimized for context retrieval accuracy.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-stack-sm p-stack-sm rounded-lg bg-surface-container-lowest border border-outline-variant/30">
          <span className="material-symbols-outlined text-secondary mt-0.5 text-xl">database</span>
          <div>
            <h4 className="font-body-md text-body-md font-semibold text-on-surface">Vector Storage</h4>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Secure, isolated tenant embeddings.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-auto pt-stack-sm border-t border-outline-variant/30">
        <div className="flex justify-between items-center mb-unit">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Storage Capacity</span>
          <span className="font-label-sm text-label-sm font-semibold text-on-surface">{storageUsed}%</span>
        </div>
        <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-secondary h-1.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${storageUsed}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
