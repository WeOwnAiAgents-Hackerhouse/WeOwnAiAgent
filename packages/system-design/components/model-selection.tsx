'use client';

import { useState, useEffect } from 'react';
import cx from 'classnames';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Model data structure
const PROVIDERS = {
  openai: {
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo']
  },
  anthropic: {
    name: 'Anthropic',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'claude-2']
  },
  huggingface: {
    name: 'Hugging Face',
    models: ['mistral-7b', 'llama-2-70b', 'falcon-40b', 'gemma-7b']
  },
  'prime-intellect': {
    name: 'Prime Intellect',
    models: ['pi-core', 'pi-reasoning', 'pi-vision', 'pi-expert']
  }
};

export function ModelSelection({ onModelSelect }: { onModelSelect?: (provider: string, model: string) => void }) {
  const [provider, setProvider] = useState<string>('openai');
  const [model, setModel] = useState<string>(PROVIDERS.openai.models[0]);
  const [isMobile, setIsMobile] = useState(false);
  
  // Update model when provider changes
  useEffect(() => {
    setModel(PROVIDERS[provider as keyof typeof PROVIDERS].models[0]);
  }, [provider]);
  
  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleApply = () => {
    if (onModelSelect) {
      onModelSelect(provider, model);
    }
  };
  
  return (
    <div className="flex flex-col gap-4 rounded-2xl p-4 bg-zinc-800/50 max-w-[500px] border border-zinc-700">
      <div className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-blue-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
              <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.01 8.01 0 0 1-8 8z"/>
              <path d="M12 10.586L7.707 6.293 6.293 7.707 10.586 12l-4.293 4.293 1.414 1.414L12 13.414l4.293 4.293 1.414-1.414L13.414 12l4.293-4.293-1.414-1.414L12 10.586z"/>
            </svg>
          </div>
          <span className="text-lg font-medium text-white">Model Selection</span>
        </div>
      </div>
      
      <div className={cx("grid gap-3", isMobile ? "grid-cols-1" : "grid-cols-2")}>
        <div>
          <label className="text-sm font-medium text-gray-300 mb-1 block">Provider</label>
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              {Object.entries(PROVIDERS).map(([key, value]) => (
                <SelectItem key={key} value={key} className="text-white hover:bg-zinc-800">
                  {value.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-300 mb-1 block">Model</label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              {PROVIDERS[provider as keyof typeof PROVIDERS].models.map((modelName) => (
                <SelectItem key={modelName} value={modelName} className="text-white hover:bg-zinc-800">
                  {modelName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button onClick={handleApply} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2">
        Apply Selection
      </Button>
    </div>
  );
} 