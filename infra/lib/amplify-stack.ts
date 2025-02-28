import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dotenv from 'dotenv';

dotenv.config();

export interface AmplifyStackProps extends cdk.StackProps {
  databaseEndpoint: string;
  databaseSecret: secretsmanager.ISecret;
  storageBucket: s3.Bucket;
}

export class AmplifyStack extends cdk.Stack {
  public readonly appUrl: cdk.CfnOutput;
  
  constructor(scope: Construct, id: string, props: AmplifyStackProps) {
    super(scope, id, props);

    // Create a secret for application environment variables
    const appSecrets = new secretsmanager.Secret(this, 'AgentBoxAppSecrets', {
      secretName: 'agent-box-app-secrets',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
          FIREWORKS_API_KEY: process.env.FIREWORKS_API_KEY || '',
          AUTH_SECRET: cdk.Names.uniqueId(this) + Math.random().toString(36).substring(2),
        }),
        generateStringKey: 'key',
      },
    });

    // Create an Amplify app
    const amplifyApp = new amplify.App(this, 'AgentBoxApp', {
      appName: 'WeOwnAgentBox',
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: process.env.GITHUB_OWNER || 'your-github-username', // Replace with your GitHub username or use env var
        repository: process.env.GITHUB_REPO || 'your-repo-name',    // Replace with your repository name or use env var
        oauthToken: cdk.SecretValue.secretsManager('github-token'), // Create this secret manually in AWS Secrets Manager
      }),
      environmentVariables: {
        NODE_ENV: 'production',
        S3_BUCKET_NAME: props.storageBucket.bucketName,
      },
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: '1.0',
        frontend: {
          phases: {
            preBuild: {
              commands: [
                'npm ci',
                // Get secrets during build time
                'export OPENAI_API_KEY=$(aws secretsmanager get-secret-value --secret-id agent-box-app-secrets --query SecretString --output text | jq -r \'.OPENAI_API_KEY\')',
                'export FIREWORKS_API_KEY=$(aws secretsmanager get-secret-value --secret-id agent-box-app-secrets --query SecretString --output text | jq -r \'.FIREWORKS_API_KEY\')',
                'export AUTH_SECRET=$(aws secretsmanager get-secret-value --secret-id agent-box-app-secrets --query SecretString --output text | jq -r \'.AUTH_SECRET\')',
                'export DB_PASSWORD=$(aws secretsmanager get-secret-value --secret-id chatbot-db-credentials --query SecretString --output text | jq -r \'.password\')',
                'export POSTGRES_URL="postgres://postgres:${DB_PASSWORD}@${DATABASE_ENDPOINT}:5432/chatbot"',
                'echo "OPENAI_API_KEY=${OPENAI_API_KEY}" >> .env',
                'echo "FIREWORKS_API_KEY=${FIREWORKS_API_KEY}" >> .env',
                'echo "AUTH_SECRET=${AUTH_SECRET}" >> .env',
                'echo "DATABASE_URL=${POSTGRES_URL}" >> .env',
                'echo "S3_BUCKET_NAME=${S3_BUCKET_NAME}" >> .env',
                'npm run db:migrate', // Run database migrations
              ],
            },
            build: {
              commands: [
                'npm run build',
              ],
            },
          },
          artifacts: {
            baseDirectory: '.next',
            files: ['**/*'],
          },
          cache: {
            paths: ['node_modules/**/*', '.next/cache/**/*'],
          },
        },
      }),
    });

    // Create appropriate IAM permissions for Amplify
    const amplifyRole = new iam.Role(this, 'AmplifyRole', {
      assumedBy: new iam.ServicePrincipal('amplify.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAmplifyFullAccess'),
      ],
    });
    
    // Grant read access to secrets
    appSecrets.grantRead(amplifyRole);
    props.databaseSecret.grantRead(amplifyRole);
    
    // Grant S3 bucket permissions
    props.storageBucket.grantReadWrite(amplifyRole);

    // Add environment variables that aren't secrets
    amplifyApp.addEnvironment('DATABASE_ENDPOINT', props.databaseEndpoint);

    // Add a branch for the main branch
    const mainBranch = amplifyApp.addBranch('main', {
      autoBuild: true,
      stage: 'PRODUCTION',
    });

    // Output the Amplify app URL
    this.appUrl = new cdk.CfnOutput(this, 'AmplifyAppURL', {
      value: `https://${mainBranch.branchName}.${amplifyApp.defaultDomain}`,
      description: 'URL of the Amplify application',
    });
  }
} 