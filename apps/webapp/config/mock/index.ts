export default {
  'GET /api/bff/auth': {
    tokenLink:
      // eslint-disable-next-line max-len
      'https://discord.com/api/oauth2/authorize?client_id=1189425291450400849&response_type=code&redirect_uri=http://localhost:8080/oauth/authorize&scope=identify%20guilds&prompt=none&state=5b9c4f5f-5f0c-4f4c-8f8c-1e7b1c7c5',
  },
  /* You can use custom functions to dynamically return data, req and res are both Node.js HTTP objects. */
  'POST /api/bff/auth': (req: any, res: any, next: any) => {
    console.log('req', req, 'res', res, 'next', next);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end('200');
  },
};
