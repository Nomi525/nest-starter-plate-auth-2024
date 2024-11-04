# Project Setup and Running Guide

## Prerequisites

### Yarn

- **Linux**:

```bash
sudo apt update
sudo apt install yarn
```

- **MacOS**:

```bash
brew install yarn
```

- **Windows**:

```powershell
choco install yarn
```

### PostgreSQL and Redis

## Environment Setup
.env.development 
.env.production file for example for .env

  ## Running the Backend
   **Start Required Services**:

```bash
cd backend
docker compose -f docker-compose.yaml build # one time only to build the hardhat container, takes about 10 minutes to build
docker compose -f docker-compose.yaml up -d # about 1 minute to start
```


**Generate Seed Data using Prisma seed on the Postgres DB**:

```bash
yarn seed
```

 **Start the Backend Locally**:

```bash
yarn start
```
"# nest-starter-plate-auth-2024" 
