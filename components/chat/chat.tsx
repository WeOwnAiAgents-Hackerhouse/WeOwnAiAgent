'use client';

import type {Attachment, Message, UIMessage} from 'ai'
import {useChat} from '@ai-sdk/react'
import {State} from "@elizaos/core"
import  useSWR, {useSWRConfig} from "swr"
import { generateUUID, fetcher } from 'lib/utils';
import type {Agent} from 'db/schema'
import {toast} from "sonner";

export function ChatMsg({
    id,
    initialMessages,
    selectedChatModel,
    isReadonly,
}: {
    id: string;
    initialMessages: Array<Message>;
    selectedChatModel: string;
    isReadonly: boolean;  
}) 
{
    const { mutate } = useSWRConfig();

    const {
        messages,
        setMessages,
        handleSubmit,
        input,
        setInput,
        append,
        isLoading,
        stop,
        reload,
      } = useChat({
        id,
        body: { id, selectedChatModel: selectedChatModel },
        initialMessages,
        experimental_throttle: 100,
        sendExtraMessageFields: true,
        generateId: generateUUID,
        onFinish: () => {
          mutate('/api/history');
        },
        onError: (error) => {
          toast.error('An error occured, please try again!');
        },
      });


      const { data: agent } = useSWR<Array<Agent>>(
        `/api/agent?chatId=${id}`,
        fetcher,
      );

      const [attachments, setAttachments] = useState<Array<Attachment>>([]);
      const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

      
      

    
    




}