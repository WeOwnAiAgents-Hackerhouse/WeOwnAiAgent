#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';
import { AmplifyStack } from '../lib/amplify-stack';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = new cdk.App();

// Deploy the minimal infrastructure stack (just database and storage)
const infraStack = new InfraStack(app, 'AgentBoxInfraStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  },
  description: 'WeOwn Agent Box minimal infrastructure stack',
  tags: {
    Project: 'WeOwnAgentBox',
    Environment: process.env.ENVIRONMENT || 'Production',
  },
});

// Deploy the Amplify stack for the web application
const amplifyStack = new AmplifyStack(app, 'AgentBoxAmplifyStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  },
  description: 'WeOwn Agent Box Amplify deployment stack',
  databaseEndpoint: infraStack.databaseEndpoint,
  databaseSecret: infraStack.databaseSecret,
  storageBucket: infraStack.storageBucket,
});

// Add dependency to ensure infrastructure is created before Amplify
amplifyStack.addDependency(infraStack);