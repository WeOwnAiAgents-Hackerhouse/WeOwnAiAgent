'use client';

import { useState, useCallback } from 'react';

export type VisibilityType = 'private' | 'public' | 'team';

export interface ChatVisibilityProps {
  chatId: string;
  initialVisibility: VisibilityType;
  onVisibilityChange?: (chatId: string, visibility: VisibilityType) => void;
}

export function useChatVisibility({
  chatId,
  initialVisibility,
  onVisibilityChange,
}: ChatVisibilityProps) {
  const [visibilityType, setVisibilityTypeState] = useState<VisibilityType>(initialVisibility);

  const setVisibilityType = useCallback((updatedVisibilityType: VisibilityType) => {
    setVisibilityTypeState(updatedVisibilityType);
    
    if (onVisibilityChange) {
      onVisibilityChange(chatId, updatedVisibilityType);
    }
  }, [chatId, onVisibilityChange]);

  return { visibilityType, setVisibilityType };
} 