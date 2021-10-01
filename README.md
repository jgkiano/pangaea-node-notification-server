# Pangaea Node Notification Server

A pub/sub based server that will publish messages to webhooks subscribed to particular topic(s).

Built with ❤️ using

- [NestJS](https://nestjs.com/)
- [Redis](https://redis.io/)
- [Docker](https://www.docker.com/)

## Get started

To run this project you must have the following installed:

- [Docker](https://www.docker.com/)
- [Node](https://nodejs.org/en/)
- (Optional) [Yarn v1](https://classic.yarnpkg.com/lang/en/)

Once you've finished installation of the above, install dependancies by running the below command in the root project directory

```s
yarn install
```

```s
bash start-server.sh
```

or

```s
yarn start
```

Publisher server will be available on [`http://localhost:8000`](http://localhost:8000)

Subscriber server will be available on [`http://localhost:9000`](http://localhost:9000)

## Privacy

Redis pub/sub is used underneath, there for any messages published is not stored but [fired and forgotten](https://redis.io/topics/pubsub)

## Documentation

**(important)** Before posting any data you'll first need to generate an API Key. Full documentation can be found [here](https://documenter.getpostman.com/view/664084/UUxzC8L5).

## Testing

### Unit testing

```s
yarn test
```

### E2E testing

```s
yarn test:e2e
```
