# Tweet Clone - Smart Contracts

This is a web3 twitter clone

## Installation and running

```bash
docker build . -t hhdocker && docker run -it --name myhd hhdocker
```

## Running (only)

```bash
docker run -it --name myhd hhdocker
```

## Deploy the smart contract locally

```bash
docker exec -it myhd /bin/sh -c "cd /usr/src/app; npm run deploy:local"
```

## Test

```bash
docker exec -it myhd /bin/sh -c "cd /usr/src/app; npm run test"
```

## Test with coverage

```bash
docker exec -it myhd /bin/sh -c "cd /usr/src/app; npm run coverage"
```

## Deploy to ropsten

```bash
npm run deploy:ropsten
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
