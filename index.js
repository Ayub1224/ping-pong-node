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

    case '/test-amfi':
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'AMFI Test Endpoint',
          data: {
            testUrl: 'https://www.amfiindia.com/spages/NAVAll.txt',
            note: 'This endpoint tests AMFI connectivity without parsing',
            timestamp: new Date().toISOString()
          }
        })
      };

    case '/amfi/nav/latest':
      try {
        console.log('Starting AMFI NAV fetch...');
        const navUrl = 'https://www.amfiindia.com/spages/NAVAll.txt';
        console.log('Fetching from:', navUrl);
        
        const navData = await fetchData(navUrl);
        console.log('Data received, length:', navData.length);
        console.log('First 200 characters:', navData.substring(0, 200));
        
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
        
        console.log('Parsed sample data:', sampleData);
        
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
        console.error('AMFI API Error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: 'Error fetching NAV data',
            error: error.message,
            errorType: error.constructor.name,
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