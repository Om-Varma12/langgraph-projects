import React from 'react';
import { DropZone } from '../components/DropZone';
import { StatsPanel } from '../components/StatsPanel';
import { DocCard } from '../components/DocCard';
import type { DocumentInfo } from '../components/DocCard';

interface UploadPageProps {
  documents: DocumentInfo[];
  onUploadDocuments: (files: File[]) => void;
  onDeleteDocument: (id: string) => void;
  onSelectDocument: (doc: DocumentInfo) => void;
  selectedDoc: DocumentInfo | undefined;
  searchQuery: string;
}

export const UploadPage: React.FC<UploadPageProps> = ({
  documents,
  onUploadDocuments,
  onDeleteDocument,
  onSelectDocument,
  selectedDoc,
  searchQuery,
}) => {
  // Filter documents by search query
  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate storage usage: e.g. each page takes ~0.2% of our quota
  const totalPages = documents.reduce((sum, doc) => sum + doc.pages, 0);
  const calculatedStorage = Math.min(Math.round(totalPages * 0.15) + 30, 100);

  return (
    <main className="flex-1 overflow-y-auto bg-surface flex flex-col items-center py-stack-lg px-margin-mobile md:px-gutter custom-scrollbar select-none">
      <div className="w-full max-w-container-max-width">
        
        {/* Page Header */}
        <div className="mb-stack-lg text-left">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-stack-sm font-bold">
            Document Library
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Upload PDFs to synthesize and chat with your proprietary knowledge base.
          </p>
        </div>

        {/* Bento Grid Layout for Upload & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-md mb-stack-lg">
          <DropZone onFilesSelected={onUploadDocuments} />
          <StatsPanel storageUsed={calculatedStorage} />
        </div>

        {/* Recently Uploaded Section */}
        <div>
          <div className="flex justify-between items-end mb-stack-md border-b border-outline-variant/30 pb-stack-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Recently Uploaded {searchQuery && `(${filteredDocs.length} found)`}
            </h3>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              {documents.length} document{documents.length !== 1 ? 's' : ''} total
            </span>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-stack-lg border border-dashed border-outline-variant rounded-lg bg-surface-bright text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-stack-sm animate-pulse">
                find_in_page
              </span>
              <h4 className="font-body-md text-body-md font-semibold text-on-surface">No documents found</h4>
              <p className="font-label-sm text-label-sm text-on-surface-variant max-w-xs mt-unit">
                {searchQuery 
                  ? `No files matching "${searchQuery}". Clear your search term in the header to view all.` 
                  : "Your document list is empty. Drop some PDFs above to start semantic processing."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
              {filteredDocs.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;
                return (
                  <div 
                    key={doc.id}
                    className={`transition-all duration-200 rounded-lg ${
                      isSelected 
                        ? 'ring-2 ring-secondary ring-offset-2 scale-[1.01]' 
                        : ''
                    }`}
                  >
                    <DocCard
                      doc={doc}
                      onDelete={onDeleteDocument}
                      onClick={onSelectDocument}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
