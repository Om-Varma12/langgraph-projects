import { useState, useEffect } from 'react';
import { SideNavBar } from './components/SideNavBar';
import { TopAppBar } from './components/TopAppBar';
import { ChatPage } from './pages/ChatPage';
import { UploadPage } from './pages/UploadPage';
import { SettingsPage } from './pages/SettingsPage';
import type { RagSettings } from './pages/SettingsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import type { DocumentInfo } from './components/DocCard';
import type { ChatMessage, Citation } from './components/ChatBubble';
import './App.css';

function App() {
  // Navigation tabs state: 'chat' | 'library' | 'settings' | 'analytics'
  const [currentTab, setCurrentTab] = useState<string>('library');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // RAG system configuration settings
  const [settings, setSettings] = useState<RagSettings>({
    chunkSize: 500,
    chunkOverlap: 50,
    topK: 4,
    temperature: 0.2,
    model: 'gemini-1.5-flash',
    systemPrompt: 'You are an advanced RAG AI assistant. Answer the user queries accurately using the retrieved contexts. Always include inline citations in the format [pg X] and reference source details.'
  });

  // Prepopulated library documents
  const [documents, setDocuments] = useState<DocumentInfo[]>([
    {
      id: 'doc-1',
      name: 'Global_Market_Analysis_Q3_2023.pdf',
      size: '4.2 MB',
      uploadedAt: '2 hours ago',
      pages: 142,
      status: 'Processed'
    },
    {
      id: 'doc-2',
      name: 'Project_Apollo_Specifications_v2.pdf',
      size: '1.8 MB',
      uploadedAt: 'Yesterday',
      pages: 36,
      status: 'Processed'
    },
    {
      id: 'doc-3',
      name: 'Employee_Handbook_2024.pdf',
      size: '8.4 MB',
      uploadedAt: 'Oct 12, 2024',
      pages: 89,
      status: 'Processed'
    }
  ]);

  // Selected document context state
  const [selectedDoc, setSelectedDoc] = useState<DocumentInfo | undefined>(undefined);

  // Chat message histories mapped by document ID
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({});

  // Set the first document as selected by default, or let user pick
  useEffect(() => {
    if (documents.length > 0 && !selectedDoc) {
      setSelectedDoc(documents[0]);
    }
  }, [documents, selectedDoc]);

  // Handle document upload simulation
  const handleUploadDocuments = (files: File[]) => {
    const newDocs: DocumentInfo[] = files.map((file, idx) => ({
      id: `doc-uploaded-${Date.now()}-${idx}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedAt: 'Just now',
      pages: Math.floor(Math.random() * 80) + 15, // Mock page count
      status: 'Processing'
    }));

    setDocuments(prev => [...newDocs, ...prev]);

    // Transition from Processing -> Processed after 2.5 seconds
    newDocs.forEach(newDoc => {
      setTimeout(() => {
        setDocuments(prev => 
          prev.map(d => d.id === newDoc.id ? { ...d, status: 'Processed' } : d)
        );
      }, 2500);
    });
  };

  // Handle document deletion
  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    
    // Clear message history for this doc
    setChatHistories(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    if (selectedDoc?.id === id) {
      setSelectedDoc(undefined);
    }
  };

  // Select a document context and jump to chat
  const handleSelectDocument = (doc: DocumentInfo) => {
    if (doc.status !== 'Processed') {
      alert("This document is currently undergoing OCR extraction and indexing. Please wait.");
      return;
    }
    setSelectedDoc(doc);
    setCurrentTab('chat');
  };

  // Helper to fetch messages for the active document context
  const getActiveHistory = (): ChatMessage[] => {
    if (!selectedDoc) return [];
    
    const history = chatHistories[selectedDoc.id];
    if (history) return history;

    // Initialize with mock AI introduction bubble matching reference-chat.html
    const welcomeMsg: ChatMessage = {
      id: `welcome-${selectedDoc.id}`,
      sender: 'ai',
      text: selectedDoc.name === 'Global_Market_Analysis_Q3_2023.pdf' 
        ? `I have processed **Global_Market_Analysis_Q3_2023.pdf**. I am ready to answer detailed questions regarding its contents, synthesize summaries, or extract specific data points. What would you like to explore?`
        : `I have processed **${selectedDoc.name}** and completed semantic index caching. I can retrieve text extracts and answer questions. What would you like to explore?`,
      timestamp: new Date()
    };
    
    return [welcomeMsg];
  };

  // Handle sending user message and generating mock RAG responses
  const handleSendMessage = (text: string) => {
    if (!selectedDoc) return;

    const activeDocId = selectedDoc.id;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    // Update state with user message
    const currentMsgs = getActiveHistory();
    const updatedMsgs = [...currentMsgs, userMsg];
    
    setChatHistories(prev => ({
      ...prev,
      [activeDocId]: updatedMsgs
    }));

    // Trigger mock AI response after typing simulation
    setTimeout(() => {
      let responseText = '';
      let responseCitations: Citation[] = [];

      const queryLower = text.toLowerCase();

      // Custom smart mock responses based on queries & document name
      if (selectedDoc.name === 'Global_Market_Analysis_Q3_2023.pdf') {
        if (queryLower.includes('emea') || queryLower.includes('revenue') || queryLower.includes('decline')) {
          responseText = `Based on Section 2.2 of the provided report, the EMEA market experienced a noticeable contraction in Q3. The primary factors cited are:\n\n- Persistent supply chain bottlenecks affecting manufacturing output in central Europe. [pg 14]\n- Increased regulatory compliance costs related to new environmental directives implemented in early Q2. [pg 15]\n\nOverall, EMEA regional revenue saw a **4.2% year-over-year decline** compared to Q3 2022. [pg 16]`;
          responseCitations = [
            { label: 'pg 14', source: 'Source: Page 14, Paragraph 2 - EMEA Logistics Review' },
            { label: 'pg 15', source: 'Source: Page 15, Bullet 3 - Regulatory Impact Report' },
            { label: 'pg 16', source: 'Source: Page 16, Table 4.1 - Q3 Revenue Summary Matrix' }
          ];
        } else {
          responseText = `I searched **Global_Market_Analysis_Q3_2023.pdf** for context on your query. Under Section 3.1, the findings indicate:\n\n- Strategic investments in APAC regions rose **14.8%**, offsetting EU contractions. [pg 22]\n- Market sentiment remains conservative, though operating margins stabilized at **18.5%**. [pg 27]\n\nLet me know if you would like me to compile specific financial numbers.`;
          responseCitations = [
            { label: 'pg 22', source: 'Source: Page 22 - APAC Investment Expansion' },
            { label: 'pg 27', source: 'Source: Page 27 - Operating Margin Projections' }
          ];
        }
      } else if (selectedDoc.name === 'Project_Apollo_Specifications_v2.pdf') {
        responseText = `I scanned the technical engineering spec file **Project_Apollo_Specifications_v2.pdf**. Key specifications show:\n\n- Thrust output vector controls are cryogenic, operating down to **-180°C**. [pg 4]\n- Fuel injector configurations are optimized for **12% higher specific impulse** compared to block-1 modules. [pg 9]\n- Mechanical stress tolerance tests suggest structure fatigue limits are well within **1.4x factor of safety** limits. [pg 18]`;
        responseCitations = [
          { label: 'pg 4', source: 'Source: Page 4, Section 1.2 - Cryogenic Fluid Dynamics' },
          { label: 'pg 9', source: 'Source: Page 9, Figure 2.3 - Thrust Optimization Calculations' },
          { label: 'pg 18', source: 'Source: Page 18 - Mechanical Stress Testing Log' }
        ];
      } else if (selectedDoc.name === 'Employee_Handbook_2024.pdf') {
        responseText = `According to the **Employee_Handbook_2024.pdf**, company policies state:\n\n- Full-time personnel accrue **20 days of paid vacation** per fiscal year, starting on month 3. [pg 12]\n- Medical insurance and health stipends cover up to **90% of dental and vision** expenses. [pg 24]\n- Core work hours are defined between **10:00 AM and 4:00 PM EST** for collaboration. [pg 31]`;
        responseCitations = [
          { label: 'pg 12', source: 'Source: Page 12, Section 3.1 - PTO Accrual Policies' },
          { label: 'pg 24', source: 'Source: Page 24 - Health Benefit Packages' },
          { label: 'pg 31', source: 'Source: Page 31 - Core Work Hours & Remote Standards' }
        ];
      } else {
        responseText = `I completed vector retrieval on **${selectedDoc.name}**. The matching passage reports:\n\n- Core metrics and details have been successfully indexed. [pg 1]\n- The document structure indicates **${selectedDoc.pages} pages** of processed content. [pg 3]\n\nWhat specific detail would you like to retrieve from this cached database?`;
        responseCitations = [
          { label: 'pg 1', source: 'Source: Page 1 - Title Overview' },
          { label: 'pg 3', source: 'Source: Page 3 - Document Index Table' }
        ];
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        citations: responseCitations,
        timestamp: new Date()
      };

      setChatHistories(prev => ({
        ...prev,
        [activeDocId]: [...(prev[activeDocId] || []), aiMsg]
      }));
    }, 1200);
  };

  const handleSaveSettings = (newSettings: RagSettings) => {
    setSettings(newSettings);
  };

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'chat':
        return (
          <ChatPage
            messages={getActiveHistory()}
            onSendMessage={handleSendMessage}
            selectedDoc={selectedDoc}
            onAttachClick={() => setCurrentTab('library')}
          />
        );
      case 'library':
        return (
          <UploadPage
            documents={documents}
            onUploadDocuments={handleUploadDocuments}
            onDeleteDocument={handleDeleteDocument}
            onSelectDocument={handleSelectDocument}
            selectedDoc={selectedDoc}
            searchQuery={searchQuery}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        );
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Page not found</h3>
          </div>
        );
    }
  };

  const getPageTitle = () => {
    switch (currentTab) {
      case 'chat':
        return 'KnowledgeSynthesizer - Chat Interface';
      case 'library':
        return 'KnowledgeSynthesizer - Document Library';
      case 'settings':
        return 'KnowledgeSynthesizer - Settings';
      case 'analytics':
        return 'KnowledgeSynthesizer - Analytics';
      default:
        return 'KnowledgeSynthesizer';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden text-on-surface bg-surface-container-lowest w-full">
      {/* Side Navigation Bar */}
      <SideNavBar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface-container-lowest relative h-screen">
        {/* Top App Bar Header */}
        <TopAppBar
          onMenuClick={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          title={getPageTitle()}
          showSearch={currentTab === 'library'}
        />

        {/* Dynamic page container */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
}

export default App;
