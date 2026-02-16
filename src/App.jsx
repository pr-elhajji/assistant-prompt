import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMarkdownData } from './hooks/useMarkdownData';
import Header from './components/Header';
import Footer from './components/Footer';
import Tabs from './components/Tabs';
import DynamicForm from './components/DynamicForm';
import ResultModal from './components/ResultModal';
import SavedPromptsModal from './components/SavedPromptsModal';
import { formConfig } from './config/methods';
import { Loader2 } from 'lucide-react';

import SettingsModal from './components/SettingsModal';

function App() {
  const { t } = useTranslation();
  const { params, data, loading, error } = useMarkdownData();
  const [activeTab, setActiveTab] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  // Consolidating state names
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (data && Object.keys(formConfig).length > 0) {
        if (formConfig['RCT']) setActiveTab('RCT');
        else setActiveTab(Object.keys(formConfig)[0]);
    }
  }, [data]);

  const handleGenerate = (prompt) => {
    setGeneratedPrompt(prompt);
    setIsResultOpen(true);
  };
  
  // handleSave is now handled inside ResultModal or manually if needed, 
  // but for receiving the prompt from SavedPromptsModal we use setGeneratedPrompt.

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen" style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Loader2 className="animate-spin" size={48} style={{animation: 'spin 1s linear infinite'}} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
  }

  if (error) {
    return <div style={{color: 'var(--danger-color)', textAlign: 'center', padding: '2rem'}}>Error loading data: {error.message}</div>;
  }

  const availableTabs = Object.keys(formConfig);

  return (
    <div className="app-container">
      <Header 
        onOpenSaved={() => setIsSavedOpen(true)} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      
      <main>
        <Tabs 
            templates={availableTabs} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
        />
        
        {activeTab && (
            <DynamicForm 
                method={activeTab} 
                markdownData={data} 
                onGenerate={handleGenerate} 
            />
        )}
      </main>

      <Footer />

      <ResultModal 
        isOpen={isResultOpen} 
        onClose={() => setIsResultOpen(false)} 
        prompt={generatedPrompt} 
      />
      
      <SavedPromptsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        onLoadRequest={(p) => {
            setGeneratedPrompt(p);
            setIsResultOpen(true);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      
    </div>
  )
}

export default App
