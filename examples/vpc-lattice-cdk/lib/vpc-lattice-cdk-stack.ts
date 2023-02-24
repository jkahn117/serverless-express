import { join } from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { LogRetention, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

export class VpcLatticeCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, "Vpc", {
      maxAzs: 2,
      natGateways: 0
    })
    
    // VPC Lattice is not support in CloudFormation / CDK yet. Need to configure manually.

    const expressFunction = new NodejsFunction(this, "ExpressFunction", {
      architecture: Architecture.ARM_64,
      awsSdkConnectionReuse: true,
      entry: join(__dirname, "functions/api/app.js"),
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      vpc: vpc
      //depsLockFilePath: join(__dirname, "functions/api/package-lock.json")
    })

    new LogRetention(this, "UploadFunctionLogsRetention", {
      logGroupName: expressFunction.logGroup.logGroupName,
      retention: RetentionDays.ONE_WEEK
    });

  }
}
