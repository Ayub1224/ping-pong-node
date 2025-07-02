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

    case '/amfi/nav':
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'AMFI NAV Data',
          data: {
            source: 'https://www.amfiindia.com/',
            description: 'Latest NAV data for mutual funds',
            endpoints: {
              latest_nav: '/amfi/nav/latest',
              fund_performance: '/amfi/performance',
              fund_categories: '/amfi/categories'
            },
            timestamp: new Date().toISOString()
          }
        })
      };

    case '/amfi/nav/latest':
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Latest NAV from AMFI',
          data: {
            source: 'AMFI India',
            note: 'This would fetch actual NAV data from AMFI API',
            sample_data: {
              fund_name: 'Sample Fund',
              nav: '15.25',
              date: new Date().toISOString().split('T')[0]
            },
            api_endpoint: 'https://www.amfiindia.com/spages/NAVAll.txt'
          },
          timestamp: new Date().toISOString()
        })
      };

    case '/amfi/performance':
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'AMFI Fund Performance Data',
          data: {
            source: 'AMFI India',
            description: 'Fund performance metrics and returns',
            available_metrics: [
              '1 Year Return',
              '3 Year Return', 
              '5 Year Return',
              'Since Inception Return'
            ],
            timestamp: new Date().toISOString()
          }
        })
      };

    case '/amfi/categories':
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'AMFI Fund Categories',
          data: {
            source: 'AMFI India',
            categories: [
              'Equity Funds',
              'Debt Funds', 
              'Hybrid Funds',
              'Solution Oriented Schemes',
              'Other Schemes'
            ],
            timestamp: new Date().toISOString()
          }
        })
      };

    case '/amfi/industry-stats':
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'AMFI Industry Statistics',
          data: {
            source: 'AMFI India',
            stats: {
              total_aum: '₹50+ Lakh Crore',
              total_schemes: '1500+',
              total_folios: '15+ Crore',
              sip_accounts: '1+ Crore'
            },
            reference: 'https://www.amfiindia.com/',
            timestamp: new Date().toISOString()
          }
        })
      };

    case '/':
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'hello from Ayub',
          status: 'success',
          amfi_integration: 'Available',
          endpoints: {
            health: '/health',
            ping: '/ping',
            amfi_nav: '/amfi/nav',
            amfi_latest_nav: '/amfi/nav/latest',
            amfi_performance: '/amfi/performance',
            amfi_categories: '/amfi/categories',
            amfi_industry_stats: '/amfi/industry-stats'
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
            '/amfi/nav',
            '/amfi/nav/latest',
            '/amfi/performance',
            '/amfi/categories',
            '/amfi/industry-stats'
          ],
          timestamp: new Date().toISOString(),
        })
      };
  }
};