import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import DataLoader from "dataloader";

// example derived from https://marmelab.com/blog/2017/09/06/dive-into-graphql-part-iii-building-a-graphql-server-with-nodejs.html

const tweets = [
    { id: 1, body: "Lorem Ipsum", date: new Date(), author_id: 10 },
    { id: 2, body: "Sic dolor amet", date: new Date(), author_id: 11 },
];
const authors = [
    {
        id: 10,
        username: "johndoe",
        first_name: "John",
        last_name: "Doe",
        avatar_url: "acme.com/avatars/10",
    },
    {
        id: 11,
        username: "janedoe",
        first_name: "Jane",
        last_name: "Doe",
        avatar_url: "acme.com/avatars/11",
    },
];

// Schema definition
const typeDefs = `#graphql
  type Tweet {
    id: ID!
    body: String
    date: Date
    Author: User
  }

  type User {
    id: ID!
    username: String
    first_name: String
    last_name: String
    full_name: String
    name: String @deprecated
    avatar_url: Url
  }

  scalar Url
  scalar Date

  type Query {
    Tweet(id: ID!): Tweet
    Tweets(limit: Int, sortField: String, sortOrder: String): [Tweet]
    User: User
  }

  type Mutation {
    createTweet(body: String, author_id: ID!): Tweet
    deleteTweet(id: ID!): Tweet
    markTweetRead(id: ID!): Boolean
  }
`;

async function batchFunction(ids) {
    console.log(`got ids ${ids}`);
    const authorsFetched = await Promise.resolve(ids.map(id => authors.find(author => author.id === id)));
    return authorsFetched;
}

const userLoader = new DataLoader(batchFunction);

const resolvers = {
    Query: {
        Tweets: () => tweets,
        Tweet: (_, { id }) => tweets.find((tweet) => tweet.id == id),
    },
    Tweet: {
        Author: (tweet, _, context) => {
            return context.userLoader.load(tweet.author_id);
        },
    },
    User: {
        full_name: (author) => `${author.first_name} ${author.last_name}`,
    },
    Mutation: {
        createTweet: (_, { body, author_id }) => {
            userLoader.load(author_id);
            const nextTweetId = tweets.reduce((id, tweet) => {
                return Math.max(id, tweet.id);
            }, -1) + 1;
            const newTweet = {
                id: nextTweetId,
                date: new Date(),
                author_id,
                body,
            };
            tweets.push(newTweet);
            //   console.log(tweets);
            userLoader.clear(author_id);
            return newTweet;
        },
    },
};

const app = express();

// Pass schema definition and resolvers to the
// ApolloServer constructor
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

await server.start();

// Launch the server
app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
        context: () => {
            return { userLoader };
        }
    }),
);


const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
