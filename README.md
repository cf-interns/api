# Global notification service repository Documentation

This guide introduce you on how to setup your environment to be able to run this project. For project task assignment see the TODO.md file.

## prerequisites

- You need a pc with a linux distro install on it
- You need node and npm (or pnpm which is more performant) installed
- You need docker installed
- You need an IDE (VsCode Recommended)

## Installation

```bash
npm install 
```

or

```bash
pnpm install
```

## Setup Env variables

```bash
cp .env.example .env

cp .env.example .env.dev

cp .env.example .env.prod

cp .env.example .env.staging

cp .env.example .env.debug
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```
