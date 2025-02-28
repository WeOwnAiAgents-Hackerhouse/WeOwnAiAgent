import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

// importing the dotenv
import * as dotenv from 'dotenv';

dotenv.config();

// Add this interface to your amplify-stack.ts file
export interface AmplifyStackProps extends cdk.StackProps {
  databaseEndpoint: string;
}

export class AmplifyStack extends cdk.Stack {
  public readonly appUrl: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props: AmplifyStackProps) {
    super(scope, id, props);

    // Create a secret for environment variables
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
        owner: 'your-github-username', // Replace with your GitHub username
        repository: 'your-repo-name',   // Replace with your repository name
        oauthToken: cdk.SecretValue.secretsManager('github-token'), // Create this secret manually in AWS Secrets Manager
      }),
      environmentVariables: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_WEB_URL: 'https://main.your-app-id.amplifyapp.com', // This will be updated after deployment
        // Don't put secrets here
      },
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: '1.0',
        frontend: {
          phases: {
            preBuild: {
              commands: [
                'npm ci',
                // Use AWS CLI to get secrets at build time instead of synthesis time
                'export OPENAI_API_KEY=$(aws secretsmanager get-secret-value --secret-id agent-box-app-secrets --query SecretString --output text | jq -r \'.OPENAI_API_KEY\')',
                'export FIREWORKS_API_KEY=$(aws secretsmanager get-secret-value --secret-id agent-box-app-secrets --query SecretString --output text | jq -r \'.FIREWORKS_API_KEY\')',
                'export AUTH_SECRET=$(aws secretsmanager get-secret-value --secret-id agent-box-app-secrets --query SecretString --output text | jq -r \'.AUTH_SECRET\')',
                'export POSTGRES_URL="postgres://postgres:$(aws secretsmanager get-secret-value --secret-id chatbot-db-credentials --query SecretString --output text | jq -r \'.password\')@${DATABASE_ENDPOINT}:5432/chatbot"',
                'echo "OPENAI_API_KEY=${OPENAI_API_KEY}" >> .env',
                'echo "FIREWORKS_API_KEY=${FIREWORKS_API_KEY}" >> .env',
                'echo "AUTH_SECRET=${AUTH_SECRET}" >> .env',
                'echo "DATABASE_URL=${POSTGRES_URL}" >> .env',
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
            paths: ['node_modules/**/*'],
          },
        },
      }),
    });

    // Give Amplify build permissions to access secrets
    const amplifyRole = iam.Role.fromRoleArn(this, 'AmplifyRole', amplifyApp.appId);
    appSecrets.grantRead(amplifyRole);

    // Add environment variables that aren't secrets
    amplifyApp.addEnvironment('DATABASE_ENDPOINT', props.databaseEndpoint);

    // Add a branch for the main branch
    const mainBranch = amplifyApp.addBranch('main', {
      autoBuild: true,
      stage: 'PRODUCTION',
    });

    // Create a custom domain if needed
    // const domain = amplifyApp.addDomain('yourdomain.com', {
    //   enableAutoSubdomain: true,
    //   autoSubdomainCreationPatterns: ['*', 'pr*'],
    // });
    // domain.mapRoot(mainBranch);
    // domain.mapSubDomain(mainBranch, 'www');

    // Output the Amplify app URL
    this.appUrl = new cdk.CfnOutput(this, 'AmplifyAppURL', {
      value: `https://${mainBranch.branchName}.${amplifyApp.defaultDomain}`,
      description: 'URL of the Amplify application',
    });
  }
} 