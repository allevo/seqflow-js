import quotes from './quotes.json'

const ALLOW_CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export function GET(request: Request): Response {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    return new Response(JSON.stringify(quote), {
        headers: {
            'content-type': 'application/json',
            ...ALLOW_CORS,
        }
    });
}