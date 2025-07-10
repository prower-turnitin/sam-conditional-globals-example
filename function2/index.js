exports.handler = async (event) => {
    console.log('Function2 received event:', JSON.stringify(event, null, 2));
    
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
        },
        body: JSON.stringify({
            function: 'function2',
            message: 'Function2 - Has additional environment variables that should merge with globals',
            environmentVariables: process.env,
            globalVariablesFromConditional: {
                LOG_LEVEL: process.env.LOG_LEVEL,
                log_level: process.env.log_level,
                AWS_LAMBDA_EXEC_WRAPPER: process.env.AWS_LAMBDA_EXEC_WRAPPER,
                OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED: process.env.OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED,
                OTEL_SERVICE_NAME: process.env.OTEL_SERVICE_NAME,
                OTEL_RESOURCE_ATTRIBUTES: process.env.OTEL_RESOURCE_ATTRIBUTES
            },
            functionSpecificVariables: {
                FUNCTION_SPECIFIC_VAR: process.env.FUNCTION_SPECIFIC_VAR,
                CUSTOM_CONFIG: process.env.CUSTOM_CONFIG
            },
            logLevelComparison: {
                expectedFromFunction: 'DEBUG',
                actualValue: process.env.LOG_LEVEL,
                shouldOverrideGlobal: 'Function-specific LOG_LEVEL should override global'
            },
            timestamp: new Date().toISOString()
        }, null, 2)
    };
    
    console.log('Function2 response:', JSON.stringify(response, null, 2));
    return response;
};
