# SAM Conditional Globals Environment Variables Defect Analysis

## Summary

This example demonstrates a defect in AWS SAM where conditional environment variables defined in the `Globals.Function.Environment.Variables` section using `!If` statements do not properly merge into individual `AWS::Serverless::Function` resources that have their own `Environment.Variables` section.

## Expected Behavior

According to AWS SAM documentation, global environment variables should merge with function-specific environment variables, with function-specific variables taking precedence when there are conflicts.

## Actual Behavior (Defect)

When conditional statements (`!If`) are used in the Globals section, the conditional environment variables are **NOT** merged into functions that have their own Environment.Variables section.

## Test Results

### Current Parameters
- `UseOtelTracing`: `true`
- `IsProdStack`: `false` 
- `LogLevel`: `INFO`

### Function1 (No function-specific environment variables)
✅ **WORKS CORRECTLY** - Receives all conditional global variables:
```json
{
  "LOG_LEVEL": "INFO",
  "log_level": "INFO", 
  "OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED": "false",
  "OTEL_SERVICE_NAME": "sam-conditional-example-dev"
}
```

### Function2 (Has function-specific environment variables)
❌ **DEFECT DEMONSTRATED** - Missing conditional global variables:
```json
{
  "LOG_LEVEL": "DEBUG",  // Function-specific override (correct)
  "FUNCTION_SPECIFIC_VAR": "function2-value",  // Function-specific (correct)
  "CUSTOM_CONFIG": "enabled"  // Function-specific (correct)
  // MISSING: OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED
  // MISSING: OTEL_SERVICE_NAME
  // MISSING: log_level
}
```

## Expected vs Actual for Function2

### Expected (if working correctly):
```json
{
  "LOG_LEVEL": "DEBUG",  // Function override
  "log_level": "INFO",   // From conditional globals
  "OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED": "false",  // From conditional globals
  "OTEL_SERVICE_NAME": "sam-conditional-example-dev",  // From conditional globals
  "FUNCTION_SPECIFIC_VAR": "function2-value",  // Function-specific
  "CUSTOM_CONFIG": "enabled"  // Function-specific
}
```

### Actual (defect):
```json
{
  "LOG_LEVEL": "DEBUG",  // Function override only
  "FUNCTION_SPECIFIC_VAR": "function2-value",  // Function-specific only
  "CUSTOM_CONFIG": "enabled"  // Function-specific only
  // All conditional globals missing!
}
```

## Root Cause

The defect appears to be that when SAM processes the template:
1. Functions without Environment.Variables get the conditional globals correctly
2. Functions with Environment.Variables only get their own variables
3. The conditional globals merging is skipped entirely for functions with Environment.Variables

## Workaround

Until this is fixed, you would need to duplicate the conditional logic in each function's Environment.Variables section instead of relying on globals merging.

## Test Environment

- **SAM CLI Version**: 1.127.0
- **AWS Region**: us-east-1
- **Runtime**: nodejs18.x
- **Template**: Uses nested `!If` conditions in Globals section

## Reproduction Steps

1. Clone this repository
2. `sam build`
3. `sam deploy --guided`
4. Test both endpoints:
   - `curl https://<api-id>.execute-api.us-east-1.amazonaws.com/Prod/function1`
   - `curl https://<api-id>.execute-api.us-east-1.amazonaws.com/Prod/function2`
5. Compare the `globalVariablesFromConditional` sections in the responses

## Files

- `template.yaml` - SAM template with conditional globals
- `function1/index.js` - Function with no environment variables (works)
- `function2/index.js` - Function with environment variables (broken)
- `README.md` - Setup and usage instructions
- `DEFECT_ANALYSIS.md` - This analysis document
