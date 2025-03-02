import React from 'react';
import { DataStreamWriter } from 'ai';

export type ArtifactKind = 'text' | 'code' | 'image' | 'sheet';
export type ArtifactStatus = 'idle' | 'loading' | 'streaming' | 'complete' | 'error';
export type ViewMode = 'default' | 'diff';

export interface ArtifactState<K extends ArtifactKind = ArtifactKind, M = any> {
  id: string;
  title: string;
  kind: K;
  content: string;
  status: ArtifactStatus;
  isVisible: boolean;
  mode: ViewMode;
  metadata?: M;
  previousVersions: string[];
  currentVersionIndex: number;
}

export interface ArtifactAction<K extends ArtifactKind = ArtifactKind, M = any> {
  icon: React.ReactNode;
  label?: string;
  description: string;
  onClick: (props: ArtifactActionProps<K, M>) => void | Promise<void>;
  isDisabled?: (props: ArtifactActionProps<K, M>) => boolean;
}

export interface ArtifactToolbarItem<K extends ArtifactKind = ArtifactKind, M = any> {
  icon: React.ReactNode;
  description: string;
  onClick: (props: ArtifactActionProps<K, M>) => void | Promise<void>;
  isDisabled?: (props: ArtifactActionProps<K, M>) => boolean;
}

export interface ArtifactProps<K extends ArtifactKind = ArtifactKind, M = any> {
  id: string;
  kind: K;
  title: string;
  description: string;
  onStreamPart?: (args: {
    streamPart: any;
    setArtifact: React.Dispatch<React.SetStateAction<ArtifactState<K, M>>>;
    setMetadata?: React.Dispatch<React.SetStateAction<M>>;
  }) => void;
  initialize?: (args: {
    documentId: string;
    setMetadata: React.Dispatch<React.SetStateAction<M>>;
  }) => Promise<void>;
  content: React.ComponentType<ArtifactContentProps<K, M>>;
  actions: ArtifactAction<K, M>[];
  toolbar: ArtifactToolbarItem<K, M>[];
}

export interface ArtifactContentProps<K extends ArtifactKind = ArtifactKind, M = any> {
  content: string;
  mode: ViewMode;
  status: ArtifactStatus;
  isCurrentVersion: boolean;
  currentVersionIndex: number;
  onSaveContent: (content: string) => void;
  getDocumentContentById: (id: number) => string;
  isLoading: boolean;
  metadata?: M;
  setMetadata?: React.Dispatch<React.SetStateAction<M>>;
}

export interface ArtifactActionProps<K extends ArtifactKind = ArtifactKind, M = any> {
  content: string;
  setMetadata?: React.Dispatch<React.SetStateAction<M>>;
  metadata?: M;
  handleVersionChange: (type: 'next' | 'prev') => void;
  isCurrentVersion: boolean;
  currentVersionIndex: number;
  appendMessage: (message: { role: 'user'; content: string }) => void;
}

export class Artifact<K extends ArtifactKind = ArtifactKind, M = any> {
  kind: K;
  description: string;
  initialize?: (args: {
    documentId: string;
    setMetadata: React.Dispatch<React.SetStateAction<M>>;
  }) => Promise<void>;
  onStreamPart?: (args: {
    streamPart: any;
    setArtifact: React.Dispatch<React.SetStateAction<ArtifactState<K, M>>>;
    setMetadata?: React.Dispatch<React.SetStateAction<M>>;
  }) => void;
  content: React.ComponentType<ArtifactContentProps<K, M>>;
  actions: ArtifactAction<K, M>[];
  toolbar: ArtifactToolbarItem<K, M>[];

  constructor(props: ArtifactProps<K, M>) {
    this.kind = props.kind;
    this.description = props.description;
    this.initialize = props.initialize;
    this.onStreamPart = props.onStreamPart;
    this.content = props.content;
    this.actions = props.actions;
    this.toolbar = props.toolbar;
  }
} 