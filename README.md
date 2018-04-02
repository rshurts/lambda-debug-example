# Lambda Debug Example

See Blog.md for detailed instructions.


## Prerequisites

1. Node.js v8
1. npm and/or yarn
1. Serverless: https://serverless.com/framework/docs/getting-started/
1. SAM Local: https://github.com/awslabs/aws-sam-local#installation
1. AWS default profile with credentials.

## Setup

1. Clone this repo and `cd` into it.
1. `yarn install`
1. `sls deploy`

## Invoke

1. `sls invoke -f findCharactersByTag -p examples/findCharactersByTag.json`

> **Tip**
>
> An example payload is needed to execute the function. The easiest way to do this is to click on **Test** from the AWS console's Lambda's page. Select *API Gateway AWS Proxy*. Copy the contents to a local file and save as json, I'm using `examples/findCharactersByTag.json`. Edit the body element to work with the expected request.

## Teardown

1. `sls remove`
