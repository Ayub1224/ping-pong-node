const https = require('https');

// Helper function to make HTTPS requests
const fetchData = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
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
        const navUrl = 'https://www.amfiindia.com/spages/NAVAll.txt';
        const navData = await fetchData(navUrl);
        
        // Simple parsing - just get first few lines
        const lines = navData.split('\n').slice(0, 5);
        const sampleData = lines.map(line => {
          const parts = line.split(';');
          return {
            raw: line,
            parts: parts.length,
            schemeName: parts[3] || 'N/A',
            nav: parts[4] || 'N/A'
          };
        });
        
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Latest NAV from AMFI',
            data: {
              source: 'AMFI India',
              totalLines: navData.split('\n').length,
              sampleData: sampleData,
              api_endpoint: navUrl,
              lastUpdated: new Date().toISOString()
            },
            timestamp: new Date().toISOString()
          })
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: 'Error fetching NAV data',
            error: error.message,
            timestamp: new Date().toISOString()
          })
        };
      }

    case '/':
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'hello from Ayub',
          status: 'success',
          amfi_integration: 'Available with Real Data',
          endpoints: {
            health: '/health',
            ping: '/ping',
            amfi_latest_nav: '/amfi/nav/latest'
          },
          timestamp: new Date().toISOString(),
        })
      };

    default:
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Not found',
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