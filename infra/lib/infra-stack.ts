import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';

export class InfraStack extends cdk.Stack {
  public readonly databaseEndpoint: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC for the application
    const vpc = new ec2.Vpc(this, 'ChatbotVPC', {
      maxAzs: 2,
      natGateways: 1,
    });

    // Security group for the application
    const appSecurityGroup = new ec2.SecurityGroup(this, 'AppSecurityGroup', {
      vpc,
      description: 'Security group for the chatbot application',
      allowAllOutbound: true,
    });

    // Security group for the database
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DbSecurityGroup', {
      vpc,
      description: 'Security group for the database',
      allowAllOutbound: true,
    });

    // Allow app to connect to the database
    dbSecurityGroup.addIngressRule(
      appSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow app to connect to database'
    );

    // Database for the application
    const databaseCredentials = new secretsmanager.Secret(this, 'DBCredentials', {
      secretName: 'chatbot-db-credentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        generateStringKey: 'password',
        excludePunctuation: true,
      },
    });

    const database = new rds.DatabaseInstance(this, 'ChatbotDatabase', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.SMALL
      ),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [dbSecurityGroup],
      credentials: rds.Credentials.fromSecret(databaseCredentials),
      databaseName: 'chatbot',
      backupRetention: cdk.Duration.days(7),
      deletionProtection: true,
      removalPolicy: cdk.RemovalPolicy.SNAPSHOT,
    });

    // S3 bucket for file storage (alternative to Vercel Blob)
    const storageBucket = new s3.Bucket(this, 'ChatbotStorage', {
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
    });

    // ECS Cluster for the application
    const cluster = new ecs.Cluster(this, 'ChatbotCluster', {
      vpc,
    });

    // ECR Repository for the application
    const repository = new ecr.Repository(this, 'ChatbotRepository', {
      repositoryName: 'chatbot',
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Secrets for the application
    const appSecrets = new secretsmanager.Secret(this, 'AppSecrets', {
      secretName: 'chatbot-app-secrets',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          OPENAI_API_KEY: 'your-openai-api-key',
          AUTH_SECRET: 'your-auth-secret',
        }),
        generateStringKey: 'key',
      },
    });

    // Task definition for the application
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'ChatbotTaskDefinition', {
      memoryLimitMiB: 2048,
      cpu: 1024,
    });

    // Grant the task role access to the S3 bucket
    storageBucket.grantReadWrite(taskDefinition.taskRole);
    
    // Grant the task role access to the secrets
    appSecrets.grantRead(taskDefinition.taskRole);
    databaseCredentials.grantRead(taskDefinition.taskRole);

    // Container definition for the application
    const container = taskDefinition.addContainer('ChatbotContainer', {
      image: ecs.ContainerImage.fromEcrRepository(repository),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'chatbot' }),
      environment: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_WEB_URL: 'https://your-domain.com',
      },
      secrets: {
        OPENAI_API_KEY: ecs.Secret.fromSecretsManager(appSecrets, 'OPENAI_API_KEY'),
        AUTH_SECRET: ecs.Secret.fromSecretsManager(appSecrets, 'AUTH_SECRET'),
        DATABASE_URL: ecs.Secret.fromSecretsManager(
          databaseCredentials,
          'postgres://postgres:${password}@' + database.dbInstanceEndpointAddress + ':5432/chatbot'
        ),
      },
    });

    // Port mapping for the container
    container.addPortMappings({
      containerPort: 3000,
      hostPort: 3000,
      protocol: ecs.Protocol.TCP,
    });

    // ECS Service for the application
    const service = new ecs.FargateService(this, 'ChatbotService', {
      cluster,
      taskDefinition,
      desiredCount: 2,
      securityGroups: [appSecurityGroup],
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    // Application Load Balancer for the service
    const lb = new elbv2.ApplicationLoadBalancer(this, 'ChatbotLB', {
      vpc,
      internetFacing: true,
    });

    // Target group for the service
    const targetGroup = new elbv2.ApplicationTargetGroup(this, 'ChatbotTargetGroup', {
      vpc,
      port: 3000,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.IP,
      healthCheck: {
        path: '/',
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
      },
    });

    // Add the service as a target
    targetGroup.addTarget(service);

    // Add a listener to the load balancer
    const listener = lb.addListener('ChatbotListener', {
      port: 80,
      defaultTargetGroups: [targetGroup],
    });

   
    // Output the load balancer DNS name
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: lb.loadBalancerDnsName,
    });

    // Output the database endpoint
    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: database.dbInstanceEndpointAddress,
    });

    this.databaseEndpoint = database.dbInstanceEndpointAddress;
  }
}