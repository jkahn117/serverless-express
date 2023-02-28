# Example: Amazon VPC Lattice

This example demonstrates the use of `serverless-express` with Amazon VPC Lattice as an event source. VPC Lattice allows you to securely connect applications and services by definition policies for network access, traffic management, and monitoring. Here, we deploy an AWS Lambda function that makes use of the `serverless-express` library and triger that function as a VPC Lattice Service.

> As of Feb 2023, VPC Lattice is in preview and does not yet support AWS CloudFormation. This example deploys a Lambda function and VPC resources. Other setup is described below using the AWS Console.

## Steps for running the example

Use [AWS CDK](https://aws.amazon.com/cdk/) to deploy this sample. This guide assumes you have already [set up an AWS account](http://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/AboutAWSAccounts.html) and have the latest version of the [AWS CDK](https://aws.amazon.com/getting-started/guides/setup-cdk/module-two/) installed.

1. Navigate to `serverless-express/examples/vpc-lattice-cdk`.
2. Run the command `cdk deploy`. The `deploy` command will synthesize CloudFormation from the CDK template and deploy to your AWS account. It will also bootstrap CDK, if needed.

The CDK template will deploy a sample Lambda function that uses Express.js as well as a new VPC in your account (2 AZs, no NAT Gateway). We'll use the AWS Console to configure VPC Lattice and the associated Lambda trigger that will allow you to invoke the function.

1. Navigate to the [Lambda Console](https://console.aws.amazon.com/lambda/home) in the AWS Console.
2. Select the sample function. The function name should be like `VpcLatticeTestStack-ExpressFunction...`.
3. Select the **Configuration** tab.
4. Select **Triggers** on the vertical menu on the left.
5. Click the **Add Trigger** button on the right.
6. In the Trigger configuration menu, select **VPC Lattice**.
7. Select **Create new**. This guides assumes you have not created a VPC Lattice Service or Service Network yet.
8. Enter a Service name, e.g. `user-service`.
9. To create a new VPC Lattice Network, click the **create one** link. Complete the new service network workflow.
  * Skip selection of a **Service association**, your new service will not be available yet.
  * Select the VPC created above in the **VPC associations** selection. The name will be like `VpcLatticeTestStack/VPC`.
  * Set **AuthType** to None.
10. After creating the service network, return to the **Add trigger** workflow. Referesh the VPC Lattice network selection and pick the newly created network.
11. Leave the **Listener** settings as is.
12. Click **Add** button.

The service will take a few moments to initialize.

### Testing the example

To test the newly deployed VPC Lattice Service, you will need access to the VPC in which it is deployed. 

> [AWS Cloud9](https://aws.amazon.com/cloud9/) provides a simple facility to access the VPC. Be sure to configure [VPC Settings for your Cloud9 environment](https://docs.aws.amazon.com/cloud9/latest/user-guide/vpc-settings.html).

1. Navigate to the [VPC Lattice Services Console](https://console.aws.amazon.com/vpc/home?#Services).
2. Select the service created earlier (e.g., `user-service`).
3. In the **Details** panel, find the **Doman name** for your service. It will be something like `users-service-xxxxxxxx.xxxxxx.vpc-lattice-svcs.us-west-2.on.aws`. Copy the Domain Name value.
4. Use `curl` to exercise the VPC Lattice Service. A few sample commands are included below (note that you will need to update the domain name).

*List users*

```
curl https://users-service-xxxxxxxx.xxxxxx.vpc-lattice-svcs.us-west-2.on.aws/users
```

*Add user*

```
curl -X POST https://users-service-0557202a65062bb74.7d67968.vpc-lattice-svcs.us-west-2.on.aws/users -H 'Content-Type: application/json' -d '{"name":"Bob"}'
```


