'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { memo } from 'react';

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'Model Selection',
      label: 'Help me choose the right AI model',
      action: 'I need help selecting the appropriate AI model for my business needs. What options do you recommend?',
    },
    {
      title: 'Vector Data Integration',
      label: 'How to integrate my data',
      action: 'Guide me through the process of integrating my vector data with the platform.',
    },
    {
      title: 'KYC Process',
      label: 'Know Your Customer verification',
      action: 'What documents do I need for the KYC process and how does it work?',
    },
    {
      title: 'Onchain Onboarding',
      label: 'Blockchain integration process',
      action: 'Explain the onchain onboarding process and how it secures my data.',
    },
    {
      title: 'SDIRA Process',
      label: 'Self-Directed IRA setup',
      action: 'I want to learn about the Self-Directed IRA process and how to get started.',
    },
    {
      title: 'Morpho',
      label: 'Learn about Morpho DeFi Protocol',
      action: 'Can you explain what the Morpho DeFi protocol is and how it works?',
    },
    {
      title: 'Uniswap',
      label: 'Uniswap DEX benefits',
      action: 'What are the key features and benefits of using the Uniswap protocol for decentralized trading?',
    },
    {
      title: 'Euler-v1',
      label: 'Euler-v1 protocol overview',
      action: 'Provide an overview of the Euler-v1 protocol and its role in DeFi lending markets.',
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 3 && index < 5 ? 'hidden sm:block' : 
                     index >= 5 ? 'hidden md:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
