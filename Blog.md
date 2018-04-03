
# Locally Debug Your Serverless Lambda Function

Serverless architecture opens an exciting new space for building cloud native and event-driven applications. By going serverless development teams focus on business logic while leveraging managed services. But this new approach raises new questions. When all the infrastructure is on the cloud, how do you have a productive local development environment? Can you even run serverless functions locally, let alone debug them?

Fortunately, a number of techniques exist to make working with serverless functions painless and productive. We'll use Node.js and AWS Lambda to demonstrate a couple ways of invoking and debugging functions locally. After following this guide, you'll have the confidence to start debugging Lambda's of your own.

I'll use an example application to show how to run and debug an AWS Lambda function locally. The application is a single function backed by a dataset of Lord of the Rings characters in DynamoDB. The function searches the database for characters with a given trait, like "fellowship," and returns the matching characters as JSON. This creates a dependency on DynamoDB, so even when running locally, we will be connecting to DynamoDB to do the table scan.

To demonstrate debugging, I'll be providing the setup for two popular IDEs/editors: [Microsoft Visual Studio Code](https://code.visualstudio.com/) and [JetBrain's Webstorm](https://www.jetbrains.com/webstorm/).

> **Tip** If you'd like to follow along, clone this git repo http://github.com/rshurts/lambda-debug-example, follow the instructions in the README.md, and return to the blog.

## Serverless Framework

My go to framework for creating Lambda functions is the [Serverless Framework](https://serverless.com/). Serverless manages the entire lifecycle of the Lambda and can even deploy required services using Cloud Formation. Check it out if you are looking to build your own serverless application.

Here we're going to take advantage of the fact that the Serverless Framework can invoke functions locally. And use that invocation to setup local debugging. Use the following command, where `-f` identifies the function name and `-p` is the path to the request payload:

```
sls invoke local -f findCharactersByTag -p examples/findCharactersByTag.json
```

Normally when a Lambda runs it assumes an IAM role. However, when Serverless invokes the function locally it uses your default AWS profile. Meaning it isn't an exact simulation of AWS. Read more about the difference in the [Serverless docs](https://serverless.com/framework/docs/providers/aws/cli-reference/invoke-local#resource-permissions).

### Visual Studio Code and Serverless

Visual Studio Code manages debugging through launch configurations. Open the Debug panel and create a new Node.js launch configuration. Add the following to the `launch.json`:

```json
{
 "version": "0.2.0",
 "configurations": [
    {
 "type": "node",
 "request": "launch",
 "name": "findCharactersByTag",
 "program": "${workspaceFolder}/node_modules/.bin/sls",
 "args": [
 "invoke",
 "local",
 "-f",
 "findCharactersByTag",
 "-p",
 "examples/findCharactersByTag.json"
      ],
 "env": {
 "LOTR_TABLE": "lotr"
      }
    }
  ]
}
```

To begin debugging, set some breakpoints and perform the following steps:

1. Select _findCharacterByTag_ from the configurations select box.
1. Click the **Start Debugging** button.
1. Use the debugger buttons to step through the breakpoints.

> **Tip** You need one launch configuration per function. Add a new node launch object for each function and update the name, args, and environment variables.

### Webstorm and Serverless

1. Create a **Node.js** configuration and name it _findCharactersByTag_.
1. In **Node parameters:** enter `node_modules/.bin/sls invoke local -f findCharactersByTag -p examples/findCharactersByTag.json`.
1. Select _findCharactersByTag_ from the configurations select box.
1. Click the **Debug** button.
1. Use the debugger buttons to step through the breakpoints.

![WebStorm Serverless Debug Configuration](/screenshots/WebStorm_Serverless_Debug_Configuration.png?raw=true)

## AWS SAM Local

Another option for executing Lamdba's locally is [AWS SAM Local](https://github.com/awslabs/aws-sam-local). Introduced prior to the 2017 re:Invent, SAM Local built upon the AWS Serverless Application Model (SAM) and is currently in beta.

SAM Local is a CLI tool installed via NPM and requires docker installed and running. SAM requires a `template.yml` to understand how to run your function. I used [Serverless SAM](https://github.com/SAPessi/serverless-sam) to convert my serverless.yml into a template.yml, but you can also follow the samples in the [AWS SAM Local repo](https://github.com/awslabs/aws-sam-local/tree/develop/samples) to create a template from scratch.

To run SAM Local with debugging execute the following command, where `-e` is the path to the example request and `-d` is the debug port.

```
sam local invoke -e examples/findCharactersByTag.json -d 9229
```

Make sure to detach your debugger to send the result back to SAM Local.

### Visual Studio Code and SAM Local

Open the Debug panel and create a new Node.js launch configuration and add the following to the `launch.json`:

```json
{
 "version": "0.2.0",
 "configurations": [
    {
 "type": "node",
 "request": "attach",
 "name": "Attach to SAM Local",
 "address": "localhost",
 "port": 9229,
 "localRoot": "${workspaceRoot}",
 "remoteRoot": "/var/task",
 "protocol": "inspector"
    }
  ]
}
```

To begin debugging, set some breakpoints and perform the following steps:

1. In a terminal run `sam local invoke -e examples/findCharactersByTag.json -d 9229`
1. Select _Attach to SAM Local_ from the configurations select box.
1. Click the **Start Debugging** button.
1. Use the debugger buttons to step through the breakpoints.
1. Detach the debugger to see the results returned to SAM Local.

### Webstorm and SAM Local

1. In a terminal run `sam local invoke -e examples/findCharactersByTag.json -d 9229`
1. Create an **Attach to Node.js/Chrome** configuration and name it _Attach to SAM Local_. 
1. Make sure the port in the configurations matches used in the command line `-d` paramter.
1. Select _Attach to SAM Local_ from the configurations select box.
1. Click the **Debug** button.
1. Use the debugger buttons to step through the breakpoints.
1. Detach the debugger to see the results returned to SAM Local.


![WebStorm SAM Local Debug Configuration](/screenshots/WebStorm_SAM_Local_Debug_Configuration.png?raw=true)

## Conculsion

You are now equipped with two methods of debugging Lambdas while still using managed services like DynamoDB. Go confidently write your next serverless application!
