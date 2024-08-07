# Action Inputs
export INPUT_ENVIRONMENT=dev
export INPUT_SERVICE_DIR=services/map-resources
export INPUT_SKIP_DEPLOY=false

# Passed in Environment Variables
export DOCKERHUB_USER=dockeruser
export DOCKERHUB_TOKEN=dockertoken
export AWS_ACCOUNT_NUMBER=12334567890
export AWS_ACCESS_KEY_ID=AKIA3TNTED47WUICLNJA
export AWS_SECRET_ACCESS_KEY=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
export AWS_REGION=ap-southeast-2

# Default Github Action Environment Variables
export GITHUB_WORKSPACE=../../..
export GITHUB_RUN_ID=123456789
export GITHUB_RUN_NUMBER=1
export GITHUB_SHA=ffac537e6cbbf934b08745a378932722df287a53
export RUNNER_DEBUG=1

export LOCAL_RUN=true

node ./src/index.js
