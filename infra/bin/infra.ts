#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';
import { AmplifyStack } from '../lib/amplify-stack';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = new cdk.App();

// Deploy the infrastructure stack
const infraStack = new InfraStack(app, 'AgentBoxStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  },
  description: 'WeOwn Agent Box infrastructure stack',
  tags: {
    Project: 'WeOwnAgentBox',
    Environment: 'Production',
  },
});

// Deploy the Amplify stack
const amplifyStack = new AmplifyStack(app, 'AgentBoxAmplifyStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  },
  description: 'WeOwn Agent Box Amplify deployment stack',
  databaseEndpoint: infraStack.databaseEndpoint,
});

// Add dependency
amplifyStack.addDependency(infraStack);