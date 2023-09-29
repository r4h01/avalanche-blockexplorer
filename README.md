# AVALANCHE QUERY

## desription
In this project I've set up a nodejs backend with Typescript, Postgres database using Prisma as a ORM running in a Docker environment.

I have created a service for query the last 10.000 blocks on Avalanche Blockchain and store all the transactions in the Database.
Then some API for get some data from It.

## INFO

- Compiler: PNPM
- Platform: Docker and Docker Compose
- Language: Typescript
- Compiler: SWC
- Web Server: Express
- ORM: Prisma 
- Migrations : Knex
- AVALANCHE API KEY: Infura 

### <span style="color:yellow;">ps: make sure to paste your own api key in the doscker-compose.yml:</span>
### <span style="color:orange;">AVA_BASE_URL=https://avalanche-mainnet.infura.io/v3/YOURAPIKEY</span>

## Command

Run the following command before starting:

1. build the Docker Images
```cmd
docker compose bulid
```
2. create the database table specified with Prisma ORM and Knex for Migrations (I have used Knex because you can perform migration directly in typescrip language, this make it simple to modify the database)
```cmd
pnpm docker:db:migrate
```
3. to boot the Docker Compose stack
```cmd
docker compose up
```
4. for stating the database populations of the last 10.000 blocks transactions
```cmd
pnpm populate
```

#### Note:
I have set some recommended extensions, one of this, it will rebuild the Docker Image every time you will make a code change and save


## API

* Transaction Order by value:

    http://localhost:5000/transaction-by-value?page=0&size=10

* Transaction by address, order by block number and transaction index:

    http://localhost:5000/transaction-ordered/:address

* Transaction by address:

    http://localhost:5000/transaction/:address

* List of 100 address with the highest balace:

    http://localhost:5000/wales
