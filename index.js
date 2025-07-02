exports.handler = async (event) => {
  console.log('Full event:', JSON.stringify(event, null, 2));

  const httpMethod = event.httpMethod;
  const path = event.path || '/';

  console.log(`Method: ${httpMethod}, Path: ${path}`);

  // Simple routing based on HTTP method and path
  if (httpMethod === 'GET') {
    switch (path) {
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

      case '/ping-pong':
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Ping-Pong!',
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

      default:
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: 'Not found',
            requestedPath: path,
            availableEndpoints: ['/', '/ping', '/health', '/ping-pong'],
            timestamp: new Date().toISOString(),
          })
        };
    }
  }

  // Handle unsupported HTTP methods
  return {
    statusCode: 405,
    body: JSON.stringify({
      message: 'Method not allowed',
      allowedMethods: ['GET'],
      receivedMethod: httpMethod,
      timestamp: new Date().toISOString(),
    })
  };
};