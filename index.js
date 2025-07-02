const https = require('https');

// Helper function to make HTTPS requests
const fetchData = (url) => {
  return new Promise((resolve, reject) => {
    console.log('Making HTTPS request to:', url);
    
    const options = {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AMFI-API-Test/1.0)'
      }
    };
    
    https.get(url, options, (res) => {
      console.log('Response status:', res.statusCode);
      console.log('Response headers:', res.headers);
      
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Data received successfully, length:', data.length);
        resolve(data);
      });
    }).on('error', (err) => {
      console.error('HTTPS request error:', err);
      reject(err);
    }).on('timeout', () => {
      console.error('Request timeout');
      reject(new Error('Request timeout'));
    });
  });
};

exports.handler = async (event) => {
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

      case '/amfi/nav/latest':
      try {
        console.log('Starting AMFI NAV fetch...');
        // Use a smaller endpoint or just get basic info
        const navUrl = 'https://www.amfiindia.com/';
        console.log('Fetching from:', navUrl);
        
        const navData = await fetchData(navUrl);
        console.log('Data received, length:', navData.length);
        
        // Just get basic info about the response
        const basicInfo = {
          source: 'AMFI India',
          dataLength: navData.length,
          hasData: navData.length > 0,
          firstLine: navData.split('\n')[0]?.substring(0, 100) || 'No data',
          lastUpdated: new Date().toISOString()
        };
        
        console.log('Basic info:', basicInfo);
        
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'AMFI Connection Test',
            data: basicInfo,
            timestamp: new Date().toISOString()
          })
        };
      } catch (error) {
        console.error('AMFI API Error:', error);
        console.error('Error message:', error.message);
        
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: 'Error connecting to AMFI',
            error: error.message,
            errorType: error.constructor.name,
            timestamp: new Date().toISOString()
          })
        };
      }

    default:
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Hey Welcome to AMFI API',
          requestedPath: path,
          availableEndpoints: [
            '/', 
            '/ping', 
            '/health', 
            '/amfi/nav/latest'
          ],
          timestamp: new Date().toISOString(),
        })
      };
  }
};