exports.handler = async (event) => {
  console.log('Full event:', JSON.stringify(event, null, 2));
  
  const httpMethod = event.httpMethod;
  const path = event.path || '/';
  const resource = event.resource || '/';
  const pathParameters = event.pathParameters || {};
  
  console.log(`Method: ${httpMethod}, Path: ${path}, Resource: ${resource}`);
  console.log(`Path Parameters:`, pathParameters);

  // Handle different API Gateway configurations
  let normalizedPath = path;
  
  // Remove trailing slash (except for root)
  if (normalizedPath.endsWith('/') && normalizedPath !== '/') {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  
  // Handle API Gateway proxy integration
  if (event.requestContext && event.requestContext.path) {
    normalizedPath = event.requestContext.path;
  }
  
  // Handle path parameters in resource
  if (resource.includes('{') && pathParameters) {
    // This is a parameterized route, use the resource pattern
    normalizedPath = resource;
  }
  
  console.log(`Normalized path: ${normalizedPath}`);

  // Try multiple path matching strategies
  const pathsToTry = [
    normalizedPath,
    path,
    resource,
    event.requestContext?.path || '',
    event.requestContext?.resourcePath || ''
  ].filter(p => p); // Remove empty strings

  console.log(`Paths to try:`, pathsToTry);

  for (const tryPath of pathsToTry) {
    console.log(`Trying path: ${tryPath}`);
    
    switch (tryPath) {
    case '/health':
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: 'healthy',
          message: 'Service is running',
          timestamp: new Date().toISOString(),
        })
      };

    case '/ping': 
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Pong',
          status: 'success',
          timestamp: new Date().toISOString(),
        })
      };
   
    case '/': 
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'hello from Ayub',
          status: 'success',
          timestamp: new Date().toISOString(),
        })
      };
  }
  }
  
  // If no path matched, return 404
  console.log(`No matching path found. Tried: ${pathsToTry.join(', ')}`);
  return {
    statusCode: 404,
    body: JSON.stringify({
      message: 'Not found',
      requestedPath: normalizedPath,
      availableEndpoints: ['/', '/ping', '/health'],
      triedPaths: pathsToTry,
      timestamp: new Date().toISOString(),
    })
  };
};