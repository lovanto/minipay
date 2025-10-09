# Backend Miniature Pay API

A production-ready Node.js + TypeScript RESTful API designed to handle QRIS-based payments via Midtrans. Built with modular design, and industry-standard best practices — including structured logging, environment-based configuration, secure authentication, and CI/CD readiness.

## Features

- TypeScript support
- Express.js framework
- Environment configuration
- Error handling and validation
- Logging with Winston
- CORS enabled
- Security headers with Helmet
- API request logging with Morgan
- ESLint for code quality
- Jest for testing
- Hot reloading for development
- Basic authentication
- Request validation middleware

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

3. Development mode:

```bash
npm run dev
```

4. Production build:

```bash
npm run build
npm start
```

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto fix
- `npm run format` - Run Prettier
- `npm run format:check` - Run Prettier with check
- `npm run test` - Run tests
- `npm run typecheck` - Check TypeScript types
- `npm run prepare` - Prepare the project
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run Prisma migrations

## Docker Support

### Using Docker Compose (Recommended for Development)

1. Start the application and database:

```bash
docker-compose up
```

2. Stop the application:

```bash
docker-compose down
```

### Using Docker

1. Build the Docker image:

```bash
docker build -t mono-service .
```

2. Run the container:

```bash
docker run -p 3000:3000 -e DATABASE_URL=your_database_url mono-service
```

Note: Make sure to provide the correct DATABASE_URL when running with Docker.
