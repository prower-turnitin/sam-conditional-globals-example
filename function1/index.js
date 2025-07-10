exports.handler = async (event) => {
    console.log('Function1 received event:', JSON.stringify(event, null, 2));
    
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
        },
        body: JSON.stringify({
            function: 'function1',
            message: 'Function1 - Only uses globals environment variables',
            environmentVariables: process.env,
            globalVariablesFromConditional: {
                LOG_LEVEL: process.env.LOG_LEVEL,
                log_level: process.env.log_level,
                AWS_LAMBDA_EXEC_WRAPPER: process.env.AWS_LAMBDA_EXEC_WRAPPER,
                OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED: process.env.OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED,
                OTEL_SERVICE_NAME: process.env.OTEL_SERVICE_NAME,
                OTEL_RESOURCE_ATTRIBUTES: process.env.OTEL_RESOURCE_ATTRIBUTES
            },
            timestamp: new Date().toISOString()
        }, null, 2)
    };
    
    console.log('Function1 response:', JSON.stringify(response, null, 2));
    return response;
};
