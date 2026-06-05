import React, { useState, useRef } from 'react';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesSelected }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingCount, setProcessingCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFilesList = (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    
    // Filter to PDF only
    const pdfFiles: File[] = [];
    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        pdfFiles.push(file);
      }
    }

    if (pdfFiles.length === 0) {
      alert("Please select PDF documents only.");
      return;
    }

    setProcessingCount(pdfFiles.length);
    setIsProcessing(true);

    // Simulate OCR & embedding processing for 2 seconds
    setTimeout(() => {
      onFilesSelected(pdfFiles);
      setIsProcessing(false);
      setProcessingCount(0);
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    processFilesList(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFilesList(e.target.files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="lg:col-span-2 bg-surface-bright rounded-xl border border-outline-variant/50 shadow-sm overflow-hidden flex flex-col">
      <div className="p-stack-md border-b border-outline-variant/30 bg-surface-container-lowest flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Upload Documents</h3>
        <span className="font-label-sm text-label-sm bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full">PDF only, max 50MB</span>
      </div>

      <div className="flex-1 p-stack-lg flex flex-col items-center justify-center min-h-[300px]">
        {/* Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-stack-lg transition-all duration-300 cursor-pointer group select-none min-h-[260px] ${
            isDragActive 
              ? 'border-secondary bg-surface-container-low/50 upload-zone-active' 
              : 'border-outline-variant/70 hover:border-secondary hover:bg-surface-container-low/50'
          }`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center animate-pulse text-secondary">
              <span className="material-symbols-outlined text-4xl mb-stack-sm animate-spin" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>
                autorenew
              </span>
              <p className="font-headline-md text-headline-md font-semibold text-center">
                Processing {processingCount} file(s)...
              </p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-unit">
                Extracting layouts & running semantic chunking
              </p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-stack-md group-hover:scale-110 transition-transform duration-300 shadow-sm border border-outline-variant/30">
                <span className="material-symbols-outlined text-4xl text-secondary">cloud_upload</span>
              </div>
              <p className="font-headline-md text-headline-md text-on-surface text-center mb-unit font-semibold">
                Drag and drop your PDFs here
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant text-center mb-stack-md">
                or click to browse from your computer
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // prevent double trigger
                  handleBrowseClick();
                }}
                className="bg-surface-container-lowest border border-outline-variant text-on-surface px-stack-md py-2 rounded-md font-body-md text-body-md font-medium hover:bg-surface-container-low transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 cursor-pointer"
              >
                Browse Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                multiple
                onChange={handleFileInputChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
