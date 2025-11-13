export default {
  async fetch(request, env, ctx) {
    // Enable CORS
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
        message: 'API connected successfully!' 
      }), { headers });
    }

    return new Response(JSON.stringify({ 
      status: 'ready' 
    }), { headers });
  }
};
