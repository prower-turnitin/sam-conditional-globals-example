# SAM Conditional Globals Environment Variables Example

This project demonstrates a potential issue with AWS SAM where conditional statements in the Globals section may not properly merge environment variables into individual AWS::Serverless::Function resources.

## Issue Description

When using conditional statements (`!If`) in the `Globals.Function.Environment.Variables` section, the environment variables defined within the conditional may not be merged into the individual function's environment variables as expected.

## Project Structure

- `template.yaml` - SAM template with conditional globals
- `function1/` - Lambda function that only uses global environment variables
- `function2/` - Lambda function with additional environment variables that should merge with globals

## Expected Behavior

According to AWS SAM documentation, global environment variables should merge with function-specific environment variables, with function-specific variables taking precedence.

## Test Scenarios

### Scenario 1: UseOtelTracing=true, IsProdStack=true
Expected global variables:
- `LOG_LEVEL`: From parameter
- `log_level`: From parameter  
- `AWS_LAMBDA_EXEC_WRAPPER`: `/opt/otel-handler`
- `OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED`: `true`
- `OTEL_SERVICE_NAME`: `sam-conditional-example`
- `OTEL_RESOURCE_ATTRIBUTES`: `service.name=sam-conditional-example,service.version=1.0.0`

### Scenario 2: UseOtelTracing=true, IsProdStack=false
Expected global variables:
- `LOG_LEVEL`: From parameter
- `log_level`: From parameter
- `AWS_LAMBDA_EXEC_WRAPPER`: `/opt/otel-handler`
- `OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED`: `false`
- `OTEL_SERVICE_NAME`: `sam-conditional-example-dev`

### Scenario 3: UseOtelTracing=false
Expected global variables:
- `LOG_LEVEL`: From parameter
- `log_level`: From parameter

## Function2 Additional Variables

Function2 should have all global variables PLUS:
- `FUNCTION_SPECIFIC_VAR`: `function2-value`
- `CUSTOM_CONFIG`: `enabled`
- `LOG_LEVEL`: `DEBUG` (should override global)

## Commands

### Build
```bash
sam build
```

### Deploy
```bash
sam deploy --guided
```

### Test Locally
```bash
sam local start-api
curl http://localhost:3000/function1
curl http://localhost:3000/function2
```

### Test Deployed
```bash
# Get the API URL from stack outputs
aws cloudformation describe-stacks --stack-name <your-stack-name> --query 'Stacks[0].Outputs'

# Test endpoints
curl https://<api-id>.execute-api.<region>.amazonaws.com/Prod/function1
curl https://<api-id>.execute-api.<region>.amazonaws.com/Prod/function2
```

## Expected Issue

If the bug exists, you may see:
1. Function1 missing the conditional global environment variables
2. Function2 missing the conditional global environment variables
3. Only the non-conditional global variables (like `LOG_LEVEL` when UseOtelTracing=false) being present

## Verification

Both functions return their complete environment variables in the response, making it easy to verify which variables are present and whether the merging worked correctly.
