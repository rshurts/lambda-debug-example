# Debug Your Lambda's Locally

Serverless architecture opens an exciting new space for building cloud native and event-driven applications. By going serverless development teams focus on business logic and delivering value while the cloud takes care of the rest. But this new approach raises new questions. When all the infrastructure is run on the cloud and tied to cloud managed services, how does one have a productive local development environment? Can you even run serverless functions locally, let alone debug them?

Fortunately, a number of new techniques exist to make working with serverless functions painless and productive. We'll use Node.js and AWS Lambda to demonstrate a couple ways of invoking and debugging functions locally. After following this guide, you'll have the confidence to start writing Lambda's of your own.

I'll be using an example application to show how to run and debug an AWS Lambda function locally. The application is a single function backed by a dataset of Lord of the Rings characters in DynamoDB. The function searchs the database for characters with a given trait, like "fellowship," and returns the matching characters as a JSON response. This creates a dependency on DynamoDB, so even when running locally, we will be connecting to DynamoDB to do the table scan.

To demonstrate debugging, I'll be providing the setup for two popular IDEs/editors: [Microsoft Visual Studio Code](https://code.visualstudio.com/) and [JetBrain's Webstorm](https://www.jetbrains.com/webstorm/).

> **Tip** If you'd like to follow along, clone this git repo http://github.com/rshurts/lambda-debug-example and follow the instructions in the README.md.

## Serverless Framework

My go to framework for creating Lambda functions is the [Serverless Framework](https://serverless.com/). The framework allows for easy management of the entire lifecycle of the Lambda and can even standup required services using Cloud Formation. I strongly recommend it if you are looking to build your own serverless application.

But here, we're going to take advantage of the fact that the Serverless Framework can invoke the function locally and use that invocation to setup local debugging. To invoke the Lambda locally, use the following command, where `-f` identifies the function name and `-p` is the path to the request payload:

```
sls invoke local -f findCharactersByTag -p examples/findCharactersByTag.json
```

Normally when a Lambda runs it assumes the IAM roles provided to it. However, when Serverless invokes the function locally it uses your default AWS profile. Just be aware of this if your default profile points to a different account or doesn't have the permissions needed.

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

> **Tip** You will need one launch configuration per function, so add a new node launch object for each function and change the name, args, and environment variables as necessary.

### Webstorm and Serverless

1. Create a **Node.js** configuration and name it _findCharactersByTag_.
1. In **Node parameters:** enter `node_modules/.bin/sls invoke local -f findCharactersByTag -p examples/findCharactersByTag.json`.
1. Select _findCharactersByTag_ from the configurations select box.
1. Click the **Debug** button.
1. Use the debugger buttons to step through the breakpoints.

![WebStorm Serverless Debug Configuration](/screenshots/WebStorm_Serverless_Debug_Configuration.png?raw=true)

## AWS SAM Local

Another option for running Lamdba's locally is [AWS SAM Local](https://github.com/awslabs/aws-sam-local). Introduced just prior to the 2017 re:Invent, SAM Local is built upon the AWS Serverless Application Model (SAM) and is currently in beta.

SAM Local is a CLI tool installed via NPM and requires docker installed and running. SAM requires `template.yml` to understand how to run your function.

To run SAM Local with debugging execute the following command, where `-e` is the path to the example request and `-d` is the debug port.

```
sam local invoke -e examples/findCharactersByTag.json -d 9229
```

Just make sure to detach your debugger to send the result back to SAM Local.

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
1. Make sure the port in the configurations matches what was used in the command line `-d` paramter.
1. Select _Attach to SAM Local_ from the configurations select box.
1. Click the **Debug** button.
1. Use the debugger buttons to step through the breakpoints.
1. Detach the debugger to see the results returned to SAM Local.



![WebStorm SAM Local Debug Configuration](/screenshots/WebStorm_SAM_Local_Debug_Configuration.png?raw=true)

## Conculsion

You now are equipped with two methods of debugging Lambdas while still making use of AWS managed services like DynamoDB. Go confidently tackle your next serverless application!
