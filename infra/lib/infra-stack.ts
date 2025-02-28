import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class InfraStack extends cdk.Stack {
  public readonly databaseEndpoint: string;
  public readonly databaseSecret: secretsmanager.ISecret;
  public readonly storageBucket: s3.Bucket;
  
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Simplified VPC for the database
    const vpc = new ec2.Vpc(this, 'AgentBoxVPC', {
      maxAzs: 2,
      natGateways: 1,
    });

    // Security group for the database
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DbSecurityGroup', {
      vpc,
      description: 'Security group for the database',
      allowAllOutbound: true,
    });

    // Allow connections from Amplify (will be updated with actual Amplify security group)
    dbSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(5432),
      'Allow database connections from Amplify'
    );

    // Import existing database credentials from Secrets Manager
    const databaseCredentials = secretsmanager.Secret.fromSecretNameV2(
      this, 
      'DatabaseCredentials', 
      'chatbot-db-credentials'
    );

    // PostgreSQL database
    const database = new rds.DatabaseInstance(this, 'AgentBoxDatabase', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_14,
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
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      storageType: rds.StorageType.GP2,
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.SNAPSHOT,
    });

    // S3 bucket for file storage
    const storageBucket = new s3.Bucket(this, 'AgentBoxStorage', {
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

    // Store outputs and public properties
    this.databaseEndpoint = database.dbInstanceEndpointAddress;
    this.databaseSecret = databaseCredentials;
    this.storageBucket = storageBucket;

    // Output the database endpoint
    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: database.dbInstanceEndpointAddress,
    });

    // Output the S3 bucket name
    new cdk.CfnOutput(this, 'StorageBucketName', {
      value: storageBucket.bucketName,
    });
  }
}