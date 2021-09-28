# Pangaea Node Notification Server

A pub/sub based server that will publish messages to webhooks subscribed to a particular topic.

Built with ❤️ using

- [NestJS](https://nestjs.com/)
- [Redis](https://redis.io/)
- [Docker](https://www.docker.com/)

## Get started

To run this project you must have the following installed:

- [Docker](https://www.docker.com/)
- [Node](https://nodejs.org/en/)
- (Optional) [Yarn v1](https://classic.yarnpkg.com/lang/en/)

Once you've finished installation of the above, run the below command on your terminal

`$ bash start-server.sh`

or

`$ yarn start`

Publisher server will be available on [`http://localhost:8000`](http://localhost:8000)

Subscriber server will be available on [`http://localhost:9000`](http://localhost:9000)

## Documentation

**(important)** Before posting any data you'll first need to generate an API Key. Full documentation can be found [here]().

## Privacy

Redis pub/sub is used underneath, there for any messages published is not stored but [fired and forgotten](https://redis.io/topics/pubsub)
