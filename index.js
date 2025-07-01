exports.handler = async (event) => {
  console.log(event);
  const httpMethod = event.httpMethod;
  const path = event.path || '/';

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
   
    case '/': 
    default:
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'hello from Ayub',
          status: 'success',
          timestamp: new Date().toISOString(),
        })
      };
  }
};