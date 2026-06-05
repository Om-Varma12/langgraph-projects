import React, { useState } from 'react';

export interface Citation {
  label: string; // e.g. "pg 14"
  source: string; // e.g. "Source: Page 14, Paragraph 2"
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  citations?: Citation[];
  timestamp?: Date;
}

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const { sender, text, citations } = message;
  const isAi = sender === 'ai';
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Helper to parse text and render bold text, lists, and citations
  const renderFormattedText = (rawText: string) => {
    // If the message is user, just render it simply
    if (!isAi) {
      return <p className="">{rawText}</p>;
    }

    // Split text by lines to handle lists vs paragraphs
    const lines = rawText.split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();
      
      // Determine if list item
      const isListItem = trimmed.startsWith('- ') || trimmed.startsWith('* ');
      const content = isListItem ? trimmed.substring(2) : line;

      // Helper to replace **bold** and citations in a line
      const formatInline = (str: string) => {
        // We will match **text** and replace with <strong>
        // Also match [citation:pg 14] or similar if we want.
        // For our predefined mock outputs, we'll parse standard bold syntax
        const parts = [];
        let currentIndex = 0;
        
        // Regex for bold text
        const boldRegex = /\*\*(.*?)\*\*/g;
        let match;

        while ((match = boldRegex.exec(str)) !== null) {
          // Push text before match
          if (match.index > currentIndex) {
            parts.push(str.substring(currentIndex, match.index));
          }
          // Push bold text
          parts.push(<strong key={`bold-${match.index}`} className="font-semibold">{match[1]}</strong>);
          currentIndex = boldRegex.lastIndex;
        }

        if (currentIndex < str.length) {
          parts.push(str.substring(currentIndex));
        }

        // Now inject citation pills if present in the text line
        // E.g. we look for [pg 14] and match it to our citation list
        const textWithCitations = [];
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (typeof part === 'string') {
            const citRegex = /\[(pg \d+)\]/g;
            let citMatch;
            let currentCitIndex = 0;
            
            while ((citMatch = citRegex.exec(part)) !== null) {
              if (citMatch.index > currentCitIndex) {
                textWithCitations.push(part.substring(currentCitIndex, citMatch.index));
              }
              
              const label = citMatch[1];
              const citationData = citations?.find(c => c.label === label);
              const sourceTitle = citationData ? citationData.source : `Source: Reference for ${label}`;

              textWithCitations.push(
                <span 
                  key={`cit-${citMatch.index}`}
                  className="inline-flex items-center px-2 py-0.5 mx-1 rounded-full bg-surface-variant text-on-surface-variant font-label-sm text-[10px] cursor-help hover:bg-surface-dim transition-colors"
                  title={sourceTitle}
                >
                  {label}
                </span>
              );
              currentCitIndex = citRegex.lastIndex;
            }
            
            if (currentCitIndex < part.length) {
              textWithCitations.push(part.substring(currentCitIndex));
            }
          } else {
            textWithCitations.push(part);
          }
        }

        return textWithCitations.length > 0 ? textWithCitations : str;
      };

      if (isListItem) {
        return (
          <ul key={index} className="list-disc pl-6 space-y-1">
            <li>{formatInline(content)}</li>
          </ul>
        );
      } else {
        return (
          <p key={index} className={trimmed === '' ? 'h-2' : ''}>
            {formatInline(line)}
          </p>
        );
      }
    });
  };

  return (
    <div className={`flex flex-col max-w-[85%] ${isAi ? 'items-start' : 'items-end self-end'}`}>
      {/* Header Info */}
      <div className={`flex items-center gap-stack-sm mb-unit px-1 ${!isAi ? 'flex-row-reverse' : ''}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center border border-outline-variant ${
          isAi ? 'bg-secondary text-on-secondary' : 'bg-surface-variant text-on-surface-variant'
        }`}>
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: '"FILL" 1' }}>
            {isAi ? 'smart_toy' : 'person'}
          </span>
        </div>
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          {isAi ? 'KnowledgeSynthesizer' : 'You'}
        </span>
      </div>

      {/* Bubble Box */}
      <div className={`border border-outline-variant rounded-xl p-stack-md font-body-lg text-body-lg ${
        isAi 
          ? 'bg-surface shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] text-on-surface space-y-4' 
          : 'bg-surface-container-lowest text-on-surface'
      }`}>
        <div className="space-y-2 select-text">
          {renderFormattedText(text)}
        </div>

        {/* AI Action Row */}
        {isAi && (
          <div className="mt-4 pt-4 border-t border-outline-variant flex gap-2 select-none">
            <button 
              onClick={handleCopy}
              className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 hover:text-secondary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span> 
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`font-label-sm text-label-sm flex items-center gap-1 hover:text-secondary transition-colors cursor-pointer ${
                isLiked ? 'text-secondary font-semibold' : 'text-on-surface-variant'
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${isLiked ? 'fill' : ''}`} style={isLiked ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                thumb_up
              </span> 
              {isLiked ? 'Helpful!' : 'Helpful'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
