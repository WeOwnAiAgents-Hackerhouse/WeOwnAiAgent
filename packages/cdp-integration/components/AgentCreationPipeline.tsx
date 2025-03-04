'use client';

import { useState } from 'react';
import { DataPreparation } from './DataPreparation';
import { AgentSetup } from './AgentSetup';
import { AgentTraining } from './AgentTraining';
import { AgentTesting } from './AgentTesting';
import { AgentDeployment } from './AgentDeployment';
import { AgentMetadata, DataSourceMetadata } from '../lib/interfaces';
import { Tabs, Tab, Button } from '@weown/system-design';

type PipelineStep = 'data' | 'setup' | 'training' | 'testing' | 'deployment';

export function AgentCreationPipeline() {
  const [currentStep, setCurrentStep] = useState<PipelineStep>('data');
  const [agent, setAgent] = useState<AgentMetadata | null>(null);
  const [dataSources, setDataSources] = useState<DataSourceMetadata[]>([]);
  
  // Step navigation handlers
  const nextStep = () => {
    const steps: PipelineStep[] = ['data', 'setup', 'training', 'testing', 'deployment'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };
  
  const prevStep = () => {
    const steps: PipelineStep[] = ['data', 'setup', 'training', 'testing', 'deployment'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };
  
  // Handler for data source addition
  const handleSourceAdded = (source: DataSourceMetadata) => {
    setDataSources([...dataSources, source]);
  };
  
  // Handler for agent creation
  const handleAgentCreated = (newAgent: AgentMetadata) => {
    setAgent(newAgent);
    nextStep();
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create Your AI Agent</h1>
      
      <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as PipelineStep)}>
        <Tab value="data" title="1. Data Preparation">
          <DataPreparation onSourceAdded={handleSourceAdded} />
          
          <div className="mt-4 flex justify-end">
            <Button onClick={nextStep} disabled={dataSources.length === 0}>
              Next: Agent Setup
            </Button>
          </div>
        </Tab>
        
        <Tab value="setup" title="2. Agent Setup">
          <AgentSetup 
            dataSources={dataSources} 
            onAgentCreated={handleAgentCreated} 
          />
          
          <div className="mt-4 flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep} disabled={!agent}>
              Next: Training
            </Button>
          </div>
        </Tab>
        
        <Tab value="training" title="3. Training">
          {agent && (
            <AgentTraining 
              agent={agent} 
            />
          )}
          
          <div className="mt-4 flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>
              Next: Testing
            </Button>
          </div>
        </Tab>
        
        <Tab value="testing" title="4. Testing">
          {agent && (
            <AgentTesting 
              agent={agent} 
            />
          )}
          
          <div className="mt-4 flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>
              Next: Deployment
            </Button>
          </div>
        </Tab>
        
        <Tab value="deployment" title="5. Deployment">
          {agent && (
            <AgentDeployment 
              agent={agent} 
            />
          )}
          
          <div className="mt-4 flex justify-start">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
} 