import React from 'react';

interface TopAppBarProps {
  onMenuClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  title?: string;
  showSearch?: boolean;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onMenuClick,
  searchQuery,
  setSearchQuery,
  title = "KnowledgeSynthesizer",
  showSearch = true,
}) => {
  return (
    <header className="flex justify-between items-center w-full px-gutter h-16 sticky top-0 z-40 bg-surface-bright dark:bg-surface border-b border-outline-variant dark:border-outline shrink-0">
      <div className="flex items-center gap-stack-md">
        {/* Mobile menu button */}
        <button 
          onClick={onMenuClick}
          className="md:hidden text-on-surface-variant p-2 rounded-md hover:bg-surface-container-low transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="font-headline-md text-headline-md font-bold text-on-surface dark:text-on-primary-container hidden md:block">
          {title}
        </span>
        <span className="font-headline-md text-headline-md font-bold text-on-surface dark:text-on-primary-container md:hidden">
          DeepKnowledge
        </span>
      </div>

      {/* Search Bar */}
      {showSearch ? (
        <div className="flex-1 max-w-md mx-gutter hidden md:flex items-center bg-surface-container-low rounded-full px-stack-md py-2 border border-outline-variant/50 focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all">
          <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-body-md font-body-md w-full text-on-surface placeholder-on-surface-variant/70 p-0" 
            placeholder="Search documents..." 
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-on-surface-variant hover:text-secondary text-xs"
            >
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex-1"></div>
      )}

      {/* Right Side Action Items */}
      <div className="flex items-center gap-stack-md text-primary dark:text-primary-fixed">
        <button 
          title="Notifications"
          className="p-2 rounded-full hover:text-secondary dark:hover:text-secondary-fixed transition-colors flex items-center justify-center text-on-surface-variant cursor-pointer"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button 
          title="Share"
          className="p-2 rounded-full hover:text-secondary dark:hover:text-secondary-fixed transition-colors flex items-center justify-center text-on-surface-variant hidden sm:flex cursor-pointer"
        >
          <span className="material-symbols-outlined">share</span>
        </button>
        <button 
          title="Account Details"
          className="ml-stack-sm flex items-center gap-stack-sm pl-stack-sm border-l border-outline-variant/30 hover:text-secondary dark:hover:text-secondary-fixed transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/50 flex items-center justify-center">
            {/* User Avatar Placeholder */}
            <div className="w-full h-full bg-primary-fixed-dim flex items-center justify-center text-primary font-bold text-xs">U</div>
          </div>
          <span className="font-body-md text-body-md hidden lg:block font-medium">Account</span>
        </button>
      </div>
    </header>
  );
};
