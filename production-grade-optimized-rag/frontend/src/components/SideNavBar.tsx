import React from 'react';

interface SideNavBarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  currentTab,
  setCurrentTab,
  mobileOpen,
  setMobileOpen,
}) => {
  const navItems = [
    { id: 'chat', label: 'RAG Chat', icon: 'add_comment' },
    { id: 'library', label: 'Document Library', icon: 'description', fillIcon: true },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full py-stack-lg bg-surface-container-low dark:bg-tertiary-container border-r border-outline-variant dark:border-outline w-80 shrink-0">
      {/* Header */}
      <div className="px-gutter mb-stack-lg">
        <div className="flex items-center gap-stack-md mb-stack-md">
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant">
            <span className="material-symbols-outlined text-secondary fill" style={{ fontVariationSettings: '"FILL" 1' }}>dataset</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-semibold text-on-surface dark:text-on-secondary-container">DeepKnowledge</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Professional Plan</p>
          </div>
        </div>
        <button 
          onClick={() => handleTabChange('library')}
          className="w-full bg-secondary text-on-secondary py-stack-sm px-gutter rounded-lg font-body-md text-body-md font-semibold flex items-center justify-center gap-stack-sm hover:bg-secondary-container transition-colors duration-200 cursor-pointer active:scale-95 transition-transform shadow-sm"
        >
          <span className="material-symbols-outlined">upload_file</span>
          Upload Documents
        </button>
      </div>

      {/* Main Nav Tabs */}
      <div className="flex-1 overflow-y-auto px-stack-sm flex flex-col gap-unit custom-scrollbar">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-stack-md px-stack-md py-stack-sm rounded-lg transition-all duration-200 font-body-md text-body-md text-left cursor-pointer active:scale-95 ${
                isActive
                  ? 'text-secondary dark:text-secondary-fixed font-semibold bg-surface-container-high dark:bg-tertiary shadow-sm'
                  : 'text-on-surface-variant dark:text-on-tertiary-container hover:bg-surface-container-high dark:hover:bg-tertiary'
              }`}
            >
              <span className={`material-symbols-outlined ${item.fillIcon && isActive ? 'fill' : ''}`} style={item.fillIcon && isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                {item.icon}
              </span>
              <span className="font-body-md text-body-md">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Nav Tabs */}
      <div className="mt-auto px-stack-sm pt-stack-md flex flex-col gap-unit border-t border-outline-variant/30">
        <button
          onClick={() => handleTabChange('settings')}
          className={`w-full flex items-center gap-stack-md px-stack-md py-stack-sm rounded-lg transition-colors duration-200 font-body-md text-body-md text-left cursor-pointer active:scale-95 ${
            currentTab === 'settings'
              ? 'text-secondary dark:text-secondary-fixed font-semibold bg-surface-container-high dark:bg-tertiary'
              : 'text-on-surface-variant dark:text-on-tertiary-container hover:bg-surface-container-high dark:hover:bg-tertiary'
          }`}
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-body-md text-body-md">Settings</span>
        </button>
        <a 
          href="#" 
          className="flex items-center gap-stack-md px-stack-md py-stack-sm rounded-lg text-on-surface-variant dark:text-on-tertiary-container hover:bg-surface-container-high dark:hover:bg-tertiary transition-colors duration-200 font-body-md text-body-md cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined">help</span>
          <span className="font-body-md text-body-md">Support</span>
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block h-screen w-80 shrink-0 sticky top-0">
        {navContent}
      </aside>

      {/* Mobile drawer drawer backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        >
          {/* Drawer container */}
          <div 
            className="w-80 h-full bg-surface-container-low dark:bg-tertiary-container shadow-2xl transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
