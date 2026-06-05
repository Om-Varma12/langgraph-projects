import React, { useState } from 'react';

export interface RagSettings {
  chunkSize: number;
  chunkOverlap: number;
  topK: number;
  temperature: number;
  model: string;
  systemPrompt: string;
}

interface SettingsPageProps {
  settings: RagSettings;
  onSaveSettings: (settings: RagSettings) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onSaveSettings }) => {
  const [localSettings, setLocalSettings] = useState<RagSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSliderChange = (key: keyof RagSettings, val: number) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalSettings(prev => ({
      ...prev,
      model: e.target.value
    }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalSettings(prev => ({
      ...prev,
      systemPrompt: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      onSaveSettings(localSettings);
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }, 800);
  };

  const handleReset = () => {
    setLocalSettings({
      chunkSize: 500,
      chunkOverlap: 50,
      topK: 4,
      temperature: 0.2,
      model: 'gemini-1.5-flash',
      systemPrompt: 'You are an advanced RAG AI assistant. Answer the user queries accurately using the retrieved contexts. Always include inline citations in the format [pg X] and reference source details.'
    });
  };

  return (
    <main className="flex-1 overflow-y-auto bg-surface flex flex-col items-center py-stack-lg px-margin-mobile md:px-gutter custom-scrollbar select-none">
      <div className="w-full max-w-container-max-width">
        {/* Page Header */}
        <div className="mb-stack-lg text-left">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-stack-sm font-bold">
            RAG Pipeline Settings
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Fine-tune chunk extraction, document retrieval scales, and LLM text generation parameters.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-md text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-md">
            
            {/* Left Column: Extraction & Retrieval */}
            <div className="bg-surface-bright border border-outline-variant/40 rounded-xl p-stack-md shadow-sm space-y-stack-md">
              <h3 className="font-headline-md text-headline-md font-semibold text-on-surface border-b border-outline-variant/20 pb-unit flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">database</span>
                Retrieval & Chunking
              </h3>

              {/* Chunk Size */}
              <div className="space-y-unit">
                <div className="flex justify-between items-center">
                  <label className="font-body-md text-body-md font-semibold text-on-surface">Chunk Size</label>
                  <span className="font-label-sm text-label-sm bg-surface-container-high px-2 py-0.5 rounded text-secondary font-semibold">
                    {localSettings.chunkSize} tokens
                  </span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="2000" 
                  step="50"
                  value={localSettings.chunkSize}
                  onChange={(e) => handleSliderChange('chunkSize', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
                />
                <p className="font-label-sm text-[10px] text-on-surface-variant">
                  Defines the block length for segmenting documents. Larger chunks keep more local context but consume more LLM input tokens.
                </p>
              </div>

              {/* Chunk Overlap */}
              <div className="space-y-unit">
                <div className="flex justify-between items-center">
                  <label className="font-body-md text-body-md font-semibold text-on-surface">Chunk Overlap</label>
                  <span className="font-label-sm text-label-sm bg-surface-container-high px-2 py-0.5 rounded text-secondary font-semibold">
                    {localSettings.chunkOverlap} tokens
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="500" 
                  step="10"
                  value={localSettings.chunkOverlap}
                  onChange={(e) => handleSliderChange('chunkOverlap', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
                />
                <p className="font-label-sm text-[10px] text-on-surface-variant">
                  Token count duplicate index between consecutive chunks. Prevents splitting contextual sentences at boundaries.
                </p>
              </div>

              {/* Top-K Chunks */}
              <div className="space-y-unit">
                <div className="flex justify-between items-center">
                  <label className="font-body-md text-body-md font-semibold text-on-surface">Retrieve Top-K</label>
                  <span className="font-label-sm text-label-sm bg-surface-container-high px-2 py-0.5 rounded text-secondary font-semibold">
                    {localSettings.topK} passages
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="12" 
                  step="1"
                  value={localSettings.topK}
                  onChange={(e) => handleSliderChange('topK', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
                />
                <p className="font-label-sm text-[10px] text-on-surface-variant">
                  The number of relevant chunk extracts to retrieve from vector database and pass to the generation LLM.
                </p>
              </div>
            </div>

            {/* Right Column: LLM Configuration */}
            <div className="bg-surface-bright border border-outline-variant/40 rounded-xl p-stack-md shadow-sm space-y-stack-md">
              <h3 className="font-headline-md text-headline-md font-semibold text-on-surface border-b border-outline-variant/20 pb-unit flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">smart_toy</span>
                LLM Parameters
              </h3>

              {/* Model Select */}
              <div className="space-y-unit">
                <label className="font-body-md text-body-md font-semibold text-on-surface block">Generation Model</label>
                <select
                  value={localSettings.model}
                  onChange={handleSelectChange}
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg py-2 px-3 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Default)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  <option value="gpt-4o">GPT-4o (OpenAI)</option>
                  <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                </select>
                <p className="font-label-sm text-[10px] text-on-surface-variant">
                  Select the underlying large language model used to synthesize the retrieved context and draft queries.
                </p>
              </div>

              {/* Temperature */}
              <div className="space-y-unit">
                <div className="flex justify-between items-center">
                  <label className="font-body-md text-body-md font-semibold text-on-surface">Temperature</label>
                  <span className="font-label-sm text-label-sm bg-surface-container-high px-2 py-0.5 rounded text-secondary font-semibold">
                    {localSettings.temperature}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0.0" 
                  max="1.0" 
                  step="0.05"
                  value={localSettings.temperature}
                  onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
                />
                <p className="font-label-sm text-[10px] text-on-surface-variant">
                  Controls creativity: lower values result in deterministic, fact-driven citations, while higher values generate flexible wording.
                </p>
              </div>

              {/* System Instructions */}
              <div className="space-y-unit">
                <label className="font-body-md text-body-md font-semibold text-on-surface block">System Prompt Instructions</label>
                <textarea
                  value={localSettings.systemPrompt}
                  onChange={handleTextAreaChange}
                  rows={4}
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2 text-body-md font-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all resize-none"
                  placeholder="System prompt instructions..."
                />
                <p className="font-label-sm text-[10px] text-on-surface-variant">
                  System instructions injected to shape behavior, citation styles, or persona responses.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons bar */}
          <div className="flex justify-between items-center border-t border-outline-variant/20 pt-stack-md select-none">
            <button
              type="button"
              onClick={handleReset}
              className="px-gutter py-2 border border-outline-variant rounded-lg font-body-md text-on-surface hover:bg-surface-container-low transition-all cursor-pointer active:scale-95"
            >
              Reset to Defaults
            </button>

            <div className="flex items-center gap-stack-md">
              {savedSuccess && (
                <span className="text-secondary font-body-md font-semibold flex items-center gap-1 animate-fade-in">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                  Settings saved!
                </span>
              )}
              
              <button
                type="submit"
                disabled={isSaving}
                className="bg-secondary text-on-secondary px-gutter py-2 rounded-lg font-body-md font-semibold hover:bg-secondary-container transition-all cursor-pointer active:scale-95 shadow-sm disabled:bg-surface-container-high disabled:text-on-surface-variant/40"
              >
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};
