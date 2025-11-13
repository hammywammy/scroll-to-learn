export default {
  async fetch(request, env, ctx) {
    // Enable CORS for mobile app
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    // Test endpoint
    if (request.url.includes('/api/test')) {
      return new Response(JSON.stringify({ 
        status: 'success',
        message: 'API connected successfully!',
        timestamp: new Date().toISOString()
      }), { headers });
    }

    return new Response(JSON.stringify({ 
      status: 'ready',
      endpoints: ['/api/test']
    }), { headers });
  }
};
