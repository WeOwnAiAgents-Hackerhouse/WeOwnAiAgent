#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AmplifyStack } from '../lib/amplify-stack';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = new cdk.App();

// Deploy the Amplify stack for the web application
const amplifyStack = new AmplifyStack(app, 'WeOwnAgentBoxStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1' 
  },
});