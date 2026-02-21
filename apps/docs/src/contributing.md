# Setting up dev environment

:::info Looking to translate the site?
You don't need a dev environment for that, check out the [translation guide](/translating.html) instead.
:::

NOTE: See [`Running the app frontend`](#running-the-app-frontend) section below if you wish to work only on the frontend.

## Installation
- [**Bun**](https://bun.sh) (JavaScript Runtime)
- [**Node.js**](https://nodejs.org/en/download/package-manager) (Required for other internal tools)
- [**Redis**](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-linux)
- [**Meilisearch**](https://github.com/meilisearch/meilisearch/releases/latest)
    NOTE: If you download the file from github and just place in `bin` folder, don't forget to give it executable permission.
- [**Postgresql**](https://www.postgresql.org/download)
    Use your package manager to install it if the `postgresql` package is available in your distro's packages repo.


## Setup

You don't need any setup for `Redis` and `Meilisearch`.

### Postgres
After you've installed `postgresql` you'll need to initialize the database. Run the following command to initialize the postgres db cluster:
```bash
# postgres --version
# postgres (PostgreSQL) 17.2

sudo mkdir -p /var/lib/postgres/data
sudo chown -R postgres:postgres /var/lib/postgres/data
sudo -u postgres initdb -D /var/lib/postgres/data
```

Change the `/var/lib/postgres/data/pg_hba.conf` file to allow direct local connections: \
_In later versions this is by default set to `trust`, but you should check is just in case._
```diff

  # TYPE  DATABASE        USER            ADDRESS                 METHOD
  
  # "local" is for Unix domain socket connections only
  local   all             all                                     peer
  # IPv4 local connections:
- host    all             all             127.0.0.1/32            ident
+ host    all             all             127.0.0.1/32            trust
  # IPv6 local connections:
  host    all             all             ::1/128                 ident
```

Now start the postgres server:
```
sudo systemctl start postgresql
```
To restart already running server use `restart` instead of `start`.

### Creating a database ROLE and USER
Log into psql console using:
```
sudo -u postgres psql
```

Add a user:
```
CREATE USER prisma WITH CREATEDB LOGIN PASSWORD 'YourPassword';
```
You can see all the users using `\du`.

Now create a database:
```
CREATE DATABASE crmm_dev WITH OWNER prisma;
```

Add the database extensions:
```
CREATE EXTENSION tsm_system_rows;
```
You might need to install the `postgresql-contrib` package if it's not available.
Restart the postgresql server after adding the extension.

Your database setup is complete now.
Keep in mind that you'll need to start the database again after a reboot.


## Project Backend Setup
- Clone the repo in your folder of choice.
- `cd` into the project root and run `bun install` to install all deps.
- Now go into `/apps/backend` and run `bunx prisma generate` and `bunx prisma db push` to synchronise the database with the schema.
- Copy this [`.env`](/apps/backend/example.env) file to `/apps/backend/.env`.
- Your database url will look something like this `postgresql://DB_USER:PASSWORD@localhost:5432/DB_NAME?schema=public`


## Running the app backend
- Start the postgres server if not running
- `cd` into `/apps/backend`
- Start the redis server: `redis-server --port 5501`
- Start the meilisearch server: `meilisearch --master-key MEILISEARCH_MASTER_KEY` \
    Must be same as specified in the env
- Start the main app backend: `bun run dev`
- The backend server will start on [localhost:5500](http://localhost:5500)

<br>

<details>
<summary>If you'd like to start all these with one command, you can make use of the pm2 config.</summary>

- Install [pm2](https://pm2.keymetrics.io/docs/usage/quick-start).
- Adjust the executable paths and and project path in [pm2 config](/apps/backend/pm2.config.cjs). (Use absolute paths)
- `cd` into `/apps/backend`
- Create `redis` and `meilisearch` folders.
- Run `pm2 start pm2.config.cjs`. It will start all three processes. You can manage them using pm2 cli. \

*You'll still have to start the database server manually.

</details>


## Running the app frontend
- `cd` into `/apps/frontend`
- Run `bun run dev`
- The frontend server will start on [localhost:3000](http://localhost:3000)

If you wish to only work on the frontend, you can totally skip the backend setup and just proxy the requests to the hosted backend. \
Set `Config.BACKEND_URL_PUBLIC` and `Config.BACKEND_URL_LOCAL` to `https://api.crmm.tech` and `Config.proxy = true` in [`app/utils/config.ts`](/apps/frontend/app/utils/config.ts#L25); and now all the api requests will be made to the prod backend.

If you're working on something that needs auth, you can login on the live website and copy the `auth-token` cookie from there.
