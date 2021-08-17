# Important Read

Search for

1. `TODO:`
2. `REVIEW:`
3. `USEFUL:`
4. `--RMV--`

1-3: Non-critical features to refactor/fix/implement. Please do them when possible.
4: Remove stuff

#### Features/TODO ()

1. Check if can even purchase 1 stock. e.g. cant buy BTC with funds < BTC price.
2. Buy, sell and sell all btns on portfolio pg.
3. AC search use YF api.
4. Withdraw money.
5. When state is updated should publish updates in real time.
6. Portfolio stats. Affected by tfr out money. Figure how to determine gain in % despite withdraw money.
7. (MAJOR) Websocket to YF for portfolio, stocks, etc for realtime data.
8. (MAJOR) Social - Friends, DMs, view portfolio, etc.
9. Top performing investors/users.
10. Contact us, about, hiring, site map, etc.

### Bugs?

1. If multiple tabs opened, how does that affect values? User should not be able to double buy, etc.

### Code

Comment well and ensure your code is readable/understandable over compactness.

### MongoDB

Ensure KISS and readability - Simple, well organised schema. IDK best practice, but to reduce complexity, keep it simple for now.

# Installation

There are 2 components to Antler.

1. Frontend (React)
2. Backend (Nodejs) + Database (mysql/postgresSQL)

# Frontend

Client package manager NPM

How to start:
Ensure you have downloaded NPM (v7.5.3) and Node.js (v15.8.0)

Note: Other versions and Node/NPM may have issues with the current package versions or cause other conflicts.

From the command line, input:

```
> cd .\client\
> npm install
> npm start
```

# Backend

This project backend was created with Node js

```
> cd .\auth\
> npm install
> npm start
```

# Resources

1. understanding hooks https://medium.com/@sdolidze/the-iceberg-of-react-hooks-af0b588f43fb
