# Quote API for demo purposes

This is a simple API that returns a random quote from a list of quotes.
The quotes are stored in a JSON file and are loaded into memory when the server starts.
The quotes copied from [this repo](https://github.com/quotable-io/data).

## Endpoints

`GET /api/quotes/random` - Returns a random quote

## Running the server

```bash
npx vercel dev
```

## Deploying the server

```bash
npx vercel
```
or, for production,
```bash
npx vercel --prod
```
