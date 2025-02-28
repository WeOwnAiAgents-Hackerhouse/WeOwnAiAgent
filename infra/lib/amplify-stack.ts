import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dotenv from 'dotenv';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cr from 'aws-cdk-lib/custom-resources';

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

    // Create an Amplify app with updated GitHub integration
    const amplifyApp = new amplify.App(this, 'AgentBoxApp', {
      appName: 'WeOwnAgentBox',
      
      // Use the newer GitHub integration method
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: process.env.GITHUB_OWNER || 'WeOwnAiAgents-Hackerhouse',
        repository: process.env.GITHUB_REPO || 'WeOwnAiAgent',
        oauthToken: cdk.SecretValue.secretsManager('github-token'),
      }),
      
      // Enable access logs for better visibility
      accessLogs: {
        enabled: true,
      },
      
      // Enable auto branch creation for feature branches
      autoBranchCreation: {
        patterns: ['feature/*', 'release/*'],
        basicAuth: amplify.BasicAuth.fromGeneratedPassword('admin'),
      },
      
      platform: amplify.Platform.WEB_COMPUTE,
      
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
                // Set up SSH for GitHub access using the private key
                'mkdir -p ~/.ssh',
                'aws secretsmanager get-secret-value --secret-id github-private-key --query SecretString --output text > ~/.ssh/id_rsa',
                'chmod 600 ~/.ssh/id_rsa',
                'ssh-keyscan github.com >> ~/.ssh/known_hosts',
                'git config --global url."git@github.com:".insteadOf "https://github.com/"',
                
                // Install pnpm and use it instead of npm ci
                'npm install -g pnpm',
                'pnpm install',
                
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
                'pnpm run db:migrate', // Run database migrations with pnpm
              ],
            },
            build: {
              commands: [
                'pnpm run build',
              ],
            },
          },
          artifacts: {
            baseDirectory: '.next',
            files: ['**/*'],
          },
          cache: {
            paths: ['node_modules/**/*', '.next/cache/**/*', '.pnpm-store/**/*'],
          },
        },
      }),
    });

    // Create CloudWatch log group for Amplify logs
    const amplifyLogGroup = new logs.LogGroup(this, 'AmplifyLogGroup', {
      logGroupName: `/aws/amplify/${amplifyApp.appId}`,
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Add explicit permissions for CloudWatch Logs
    const amplifyRole = amplifyApp.node.findChild('Role') as iam.Role;
    amplifyRole.addToPrincipalPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
        'logs:DescribeLogStreams'
      ],
      resources: [
        `arn:aws:logs:${this.region}:${this.account}:log-group:/aws/amplify/*`,
      ],
    }));

    // Grant read access to secrets
    appSecrets.grantRead(amplifyRole);
    props.databaseSecret.grantRead(amplifyRole);
    
    // Grant S3 bucket permissions
    props.storageBucket.grantReadWrite(amplifyRole);
    
    // Add specific permissions for Secrets Manager and database operations
    amplifyRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'secretsmanager:GetSecretValue',
      ],
      resources: [
        appSecrets.secretArn,
        props.databaseSecret.secretArn,
        // Add the github-private-key secret ARN
        `arn:aws:secretsmanager:${this.region}:${this.account}:secret:github-private-key*`,
      ],
    }));

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

    // Output the Amplify Console URL for easy access
    new cdk.CfnOutput(this, 'AmplifyConsoleUrl', {
      value: `https://${this.region}.console.aws.amazon.com/amplify/home?region=${this.region}#/${amplifyApp.appId}`,
      description: 'URL to the Amplify Console',
    });

    // Create a custom resource to enable backend access
    const enableBackendAccess = new cr.AwsCustomResource(this, 'EnableAmplifyBackendAccess', {
      onUpdate: {
        service: 'Amplify',
        action: 'updateApp',
        parameters: {
          appId: amplifyApp.appId,
          enableBackendAccessControl: true,
          backendEnvironmentName: 'main',
        },
        physicalResourceId: cr.PhysicalResourceId.of(`${amplifyApp.appId}-backend-access`),
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // Ensure this runs after the Amplify app is created
    enableBackendAccess.node.addDependency(amplifyApp);
  }
} 