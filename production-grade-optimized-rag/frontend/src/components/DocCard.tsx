import React, { useState } from 'react';

export interface DocumentInfo {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  pages: number;
  status: 'Processed' | 'Processing' | 'Failed';
}

interface DocCardProps {
  doc: DocumentInfo;
  onDelete?: (id: string) => void;
  onClick?: (doc: DocumentInfo) => void;
}

export const DocCard: React.FC<DocCardProps> = ({ doc, onDelete, onClick }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(doc.id);
    }
    setShowMenu(false);
  };

  return (
    <div 
      onClick={() => onClick && onClick(doc)}
      className="bg-surface-bright border border-outline-variant/40 rounded-lg p-stack-md hover:shadow-md transition-all duration-200 group cursor-pointer relative overflow-hidden select-none active:scale-[0.99]"
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${
        doc.status === 'Processed' 
          ? 'bg-secondary' 
          : doc.status === 'Processing'
          ? 'bg-surface-tint opacity-50 animate-pulse'
          : 'bg-error'
      }`}></div>

      <div className="flex justify-between items-start mb-stack-md">
        <div className="flex items-center gap-stack-sm min-w-0 flex-1">
          <div className="w-10 h-10 rounded bg-error-container/30 text-error flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">picture_as_pdf</span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 
              className="font-body-md text-body-md font-semibold text-on-surface line-clamp-1 break-all" 
              title={doc.name}
            >
              {doc.name}
            </h4>
            <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
              {doc.size} • {doc.uploadedAt}
            </p>
          </div>
        </div>

        <div className="relative shrink-0 ml-1">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-md hover:bg-surface-container-low transition-colors duration-150"
          >
            <span className="material-symbols-outlined text-sm">more_vert</span>
          </button>
          
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 mt-1 w-36 bg-surface-container-lowest border border-outline-variant/50 rounded-md shadow-lg py-1 z-20 animate-in fade-in slide-in-from-top-1 duration-100">
                <button
                  onClick={handleDeleteClick}
                  className="w-full text-left px-stack-md py-1.5 text-body-md font-body-md text-error hover:bg-error-container/20 flex items-center gap-stack-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        {doc.status === 'Processed' ? (
          <span className="inline-flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded text-xs font-medium text-secondary">
            <span className="material-symbols-outlined text-[14px] fill" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Processed
          </span>
        ) : doc.status === 'Processing' ? (
          <span className="inline-flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded text-xs font-medium text-surface-tint animate-pulse">
            <span className="material-symbols-outlined text-[14px] animate-spin">autorenew</span>
            Processing
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-error-container px-2 py-1 rounded text-xs font-medium text-error">
            <span className="material-symbols-outlined text-[14px]">error</span>
            Failed
          </span>
        )}

        <span className="font-label-sm text-label-sm text-on-surface-variant">{doc.pages} pages</span>
      </div>
    </div>
  );
};
