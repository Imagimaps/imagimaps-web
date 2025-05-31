# Modern.js Framework Overview

Modern.js is a progressive web framework based on React, developed by ByteDance. It's designed to provide an excellent development experience while enabling applications to have better user experience.

## Key Features

- **Rust Bundler**: Supports dual bundlers (webpack and Rspack), with Rspack offering 5-10x faster build speeds
- **Progressive**: Start with minimal templates and gradually enable features as needed
- **Integration**: Unified development and production environments, isomorphic CSR/SSR development
- **Out of the Box**: Default TypeScript support, built-in build tools, ESLint, and debugging tools
- **Ecosystem**: Includes state management (Reduck), micro-frontend capabilities, and module packaging
- **Convention Routing**: File-based routing for quick application setup

## Comparison with Other Frameworks

- **Next.js**: Modern.js treats CSR and SSR as equally important, while Next.js is server-first. Modern.js defaults to client-side rendering with optional SSR capabilities.
- **Umi**: Similar features but Modern.js uses Rspack for better build performance instead of MFSU technology.

## Project Structure

A basic Modern.js project includes:
```
.
├── src
│   ├── modern-app-env.d.ts
│   └── routes
│       ├── index.css
│       ├── layout.tsx
│       └── page.tsx
├── modern.config.ts
├── package.json
├── pnpm-lock.yaml
├── README.md
└── tsconfig.json
```

## Development Workflow

1. **Setup**: Requires Node.js 18.20.8+ (Node.js 22 LTS recommended) and pnpm
2. **Create Project**: `npx @modern-js/create@latest myapp`
3. **Development**: `pnpm dev` - Starts development server
4. **Build**: `pnpm build` - Creates production build
5. **Preview**: `pnpm serve` - Preview production build locally

## Configuration

Configuration is done through `modern.config.ts`:

```typescript
import { appTools, defineConfig } from '@modern-js/app-tools';

export default defineConfig({
  runtime: {
    router: true,
  },
  server: {
    ssr: true, // Enable server-side rendering
  },
  plugins: [appTools({
    bundler: 'rspack', // Or 'webpack'
  })],
});
```

## Core Package

The `@modern-js/app-tools` package is the core of Modern.js, providing:
- CLI commands (`modern dev`, `modern build`, etc.)
- Configuration parsing and plugin loading
- Build capabilities through Rsbuild
- Development and production server capabilities

## Deployment

Modern.js applications can be deployed as static sites (for CSR) or as Node.js applications (for SSR). The framework supports various deployment environments and provides optimization options for production.

## BFF (Backend-For-Frontend)

Modern.js includes a powerful BFF (Backend-For-Frontend) capability that allows developers to create API endpoints directly within their application:

### How BFF Works

1. **File-Based API Definition**: Create API files under the `api/lambda` directory and export functions that correspond to HTTP methods (GET, POST, etc.)

2. **Unified Invocation**: Frontend code can directly import and call these API functions without writing separate client-side code

3. **Convention-Based Routing**: API routes are automatically generated based on the file structure:
   - `api/lambda/hello.ts` → `/api/hello`
   - `api/lambda/user/list.ts` → `/api/user/list`
   - `api/lambda/[username]/info.ts` → `/api/:username/info` (dynamic routes)

4. **Type Safety**: Full TypeScript support ensures type safety between frontend and backend

5. **RESTful API Support**: Functions follow RESTful conventions with support for query parameters, request body, and path parameters

### Example BFF Implementation

```typescript
// api/lambda/hello.ts
export const get = async () => 'Hello Modern.js';

// src/routes/page.tsx
import { useState, useEffect } from 'react';
import { get as hello } from '@api/hello';

export default () => {
  const [text, setText] = useState('');

  useEffect(() => {
    hello().then(setText);
  }, []);
  
  return <div>{text}</div>;
};
```

### Advanced BFF Features

- **Dynamic Routes**: Support for parameters in URL paths
- **Request Options**: Type-safe handling of query parameters and request body
- **Code Sharing**: Shared code between frontend and backend via a `shared` directory
- **Multiple HTTP Methods**: Support for all standard HTTP methods (GET, POST, PUT, DELETE, etc.)
- **Framework Integration**: Can be extended with various backend frameworks

## Important Notes

- Always use curl to read online pages unless otherwise specified
- Use caution when accessing external resources
- Do not commit changes automatically - commits must be initiated by the user

## Documentation Links

- Main documentation: https://modernjs.dev/en/
- Getting started: https://modernjs.dev/guides/get-started/introduction
- BFF documentation: https://modernjs.dev/guides/advanced-features/bff/function
- Configuration reference: https://modernjs.dev/configure/app/usage
- API reference: https://modernjs.dev/apis/app/commands
