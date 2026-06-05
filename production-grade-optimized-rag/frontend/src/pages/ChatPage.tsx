import React, { useRef, useEffect, useState } from 'react';
import { ChatBubble } from '../components/ChatBubble';
import type { ChatMessage } from '../components/ChatBubble';
import { ChatInput } from '../components/ChatInput';
import type { DocumentInfo } from '../components/DocCard';

interface ChatPageProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  selectedDoc: DocumentInfo | undefined;
  onAttachClick: () => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  messages,
  onSendMessage,
  selectedDoc,
  onAttachClick,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showContextPane, setShowContextPane] = useState(true);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col relative bg-surface-container-lowest overflow-hidden">
        
        {/* Active Document Header (For Chat Context status) */}
        <div className="px-margin-mobile md:px-gutter py-3 border-b border-outline-variant/30 bg-surface-bright flex justify-between items-center select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-body-md text-body-md font-semibold text-on-surface">
              {selectedDoc ? `Chatting with: ${selectedDoc.name}` : 'No document selected'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedDoc && (
              <button
                onClick={() => setShowContextPane(!showContextPane)}
                className="text-on-surface-variant hover:text-secondary flex items-center gap-1 font-label-sm text-label-sm py-1 px-2 rounded-md hover:bg-surface-container-low transition-colors cursor-pointer"
                title="Toggle Document Context Panel"
              >
                <span className="material-symbols-outlined text-sm">
                  {showContextPane ? 'right_panel_close' : 'right_panel_open'}
                </span>
                {showContextPane ? 'Hide Summary' : 'Show Summary'}
              </button>
            )}
            
            <button
              onClick={onAttachClick}
              className="bg-secondary text-on-secondary px-3 py-1.5 rounded-md font-label-sm text-label-sm font-semibold flex items-center gap-1 hover:bg-secondary-container transition-colors cursor-pointer active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-xs">refresh</span>
              Change Document
            </button>
          </div>
        </div>

        {/* Chat History Scrollable Area */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto chat-scroll-area px-margin-mobile md:px-gutter py-stack-lg"
        >
          <div className="max-w-container-max-width mx-auto flex flex-col gap-stack-lg min-h-full">
            {messages.length === 0 ? (
              // Empty State view when no conversations are active
              <div className="flex-1 flex flex-col items-center justify-center text-center p-stack-lg my-auto select-none">
                <div className="w-16 h-16 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-secondary mb-stack-md animate-bounce">
                  <span className="material-symbols-outlined text-3xl">chat_bubble</span>
                </div>
                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-unit">
                  Synthesize Document Knowledge
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                  {selectedDoc 
                    ? `Ask anything about "${selectedDoc.name}". Our semantic indexing engine will extract context, run cross-page retrieval, and draft precise answers with inline page references.`
                    : 'Upload and select a PDF document from the Document Library to initialize a Retrieval-Augmented Generation (RAG) chat session.'
                  }
                </p>
                
                {!selectedDoc && (
                  <button
                    onClick={onAttachClick}
                    className="mt-stack-md bg-secondary text-on-secondary px-gutter py-2 rounded-lg font-body-md font-semibold hover:bg-secondary-container transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    Go to Library
                  </button>
                )}
              </div>
            ) : (
              messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))
            )}
            
            {/* Pad spacing at the bottom */}
            <div className="h-4"></div>
          </div>
        </div>

        {/* Bottom Input Bar */}
        <ChatInput 
          onSend={onSendMessage} 
          selectedDocName={selectedDoc?.name} 
          onAttachClick={onAttachClick} 
        />
      </section>

      {/* Context Pane Sidebar (Document metadata summary) */}
      {selectedDoc && showContextPane && (
        <aside className="hidden lg:flex flex-col w-80 shrink-0 border-l border-outline-variant/30 bg-surface-bright dark:bg-tertiary-container h-full overflow-y-auto custom-scrollbar animate-in slide-in-from-right-4 duration-300">
          <div className="p-stack-md border-b border-outline-variant/30 bg-surface-container-lowest flex justify-between items-center select-none">
            <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Document Details</h3>
            <button 
              onClick={() => setShowContextPane(false)}
              className="text-on-surface-variant hover:text-on-surface rounded p-1 hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div className="p-stack-md space-y-stack-md">
            {/* Doc summary card */}
            <div className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-stack-sm flex items-center gap-stack-sm">
              <div className="w-10 h-10 rounded bg-error-container/30 text-error flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">picture_as_pdf</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-body-md text-body-md font-semibold text-on-surface truncate" title={selectedDoc.name}>
                  {selectedDoc.name}
                </h4>
                <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
                  {selectedDoc.size} • {selectedDoc.pages} pages
                </p>
              </div>
            </div>

            {/* Simulated index stats */}
            <div className="space-y-stack-sm">
              <h4 className="font-body-md text-body-md font-semibold text-on-surface border-b border-outline-variant/20 pb-unit">
                Vector Index Metadata
              </h4>
              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="bg-surface-container-lowest p-2 border border-outline-variant/30 rounded">
                  <span className="font-label-sm text-[10px] text-on-surface-variant block uppercase">Total Chunks</span>
                  <span className="font-headline-md text-headline-md font-bold text-secondary">{selectedDoc.pages * 3 + 12}</span>
                </div>
                <div className="bg-surface-container-lowest p-2 border border-outline-variant/30 rounded">
                  <span className="font-label-sm text-[10px] text-on-surface-variant block uppercase">Embed Model</span>
                  <span className="font-body-md text-body-md font-semibold truncate block">text-embed-3</span>
                </div>
              </div>
            </div>

            {/* Document Abstract/Key Topics */}
            <div className="space-y-stack-sm">
              <h4 className="font-body-md text-body-md font-semibold text-on-surface border-b border-outline-variant/20 pb-unit">
                Key Extracted Topics
              </h4>
              <div className="flex flex-wrap gap-1">
                {['EMEA Contraction', 'Supply Chain Bottlenecks', 'Compliance Costs', 'Q3 Performance', 'Revenue Analysis', 'Manufacturing Deficit'].map((tag, idx) => (
                  <span key={idx} className="font-label-sm text-[10px] bg-surface-container-high text-on-surface px-2 py-0.5 rounded-full border border-outline-variant/30">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* RAG settings override tip */}
            <div className="p-stack-sm bg-primary-fixed text-primary rounded-lg border border-outline-variant/30">
              <div className="flex gap-2">
                <span className="material-symbols-outlined text-secondary text-sm">info</span>
                <div>
                  <h5 className="font-label-sm text-[11px] font-bold">RAG Retrieval Advice</h5>
                  <p className="font-label-sm text-[10px] text-on-primary-fixed-variant leading-relaxed mt-unit">
                    This document contains dense tables. We suggest setting <strong>Chunk Size to 800</strong> and <strong>Retrieval Top-K to 5</strong> in Settings for detailed table queries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
