import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  selectedDocName?: string;
  onAttachClick?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  selectedDocName,
  onAttachClick,
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize logic in React
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to compute scrollHeight
    textarea.style.height = '44px';
    const scrollHeight = textarea.scrollHeight;

    if (valLengthWithoutNewline(text) === 0) {
      textarea.style.height = '44px';
      textarea.style.overflowY = 'hidden';
    } else if (scrollHeight > 128) {
      textarea.style.height = '128px';
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.height = `${scrollHeight}px`;
      textarea.style.overflowY = 'hidden';
    }
  }, [text]);

  const valLengthWithoutNewline = (str: string) => {
    return str.replace(/\r?\n|\r/g, '').length;
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
    
    // Focus back on textarea and reset height
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-margin-mobile md:px-gutter pb-stack-lg pt-stack-sm bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest to-transparent relative z-10">
      <div className="max-w-container-max-width mx-auto">
        {selectedDocName && (
          <div className="flex items-center gap-1 mb-2 px-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <span className="material-symbols-outlined text-xs text-secondary fill" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
            <span className="font-label-sm text-[10px] text-on-surface-variant font-medium">
              Context: <strong className="text-secondary font-semibold">{selectedDocName}</strong>
            </span>
          </div>
        )}
        
        <div className="relative flex items-end gap-2 bg-surface-bright border border-outline-variant rounded-[16px] p-2 focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
          <button 
            type="button"
            onClick={onAttachClick}
            className="p-2 text-on-surface-variant hover:text-secondary transition-colors rounded-lg flex-shrink-0 cursor-pointer" 
            title="Attach / Switch Document Context"
          >
            <span className="material-symbols-outlined">attach_file</span>
          </button>
          
          <textarea 
            ref={textareaRef}
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 resize-none py-2 px-1 font-body-lg text-body-lg text-on-surface placeholder-on-surface-variant max-h-32 min-h-[44px]" 
            placeholder={selectedDocName ? "Ask a question about this document..." : "Select a document to begin chatting..."}
            rows={1}
            disabled={!selectedDocName}
          />
          
          <button 
            type="button"
            onClick={handleSend}
            disabled={!text.trim() || !selectedDocName}
            className={`p-2 rounded-lg transition-all flex-shrink-0 active:scale-95 flex items-center justify-center h-10 w-10 cursor-pointer ${
              text.trim() && selectedDocName
                ? 'bg-secondary text-on-secondary hover:bg-secondary-container' 
                : 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
              send
            </span>
          </button>
        </div>
        
        <div className="text-center mt-2">
          <span className="font-label-sm text-[10px] text-on-surface-variant">KnowledgeSynthesizer can make mistakes. Verify critical data points.</span>
        </div>
      </div>
    </div>
  );
};
