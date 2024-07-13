import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";


let linkedList = {
  head: {
    value: 100,
    next: {
      value: 200,
      next: {
        value: 300,
        next: {
          value: 400,
          next: null,
        }
      }
    },
  },
  length: 4,
}


// Schema definition
const typeDefs = `#graphql
  type Node {
    value: Int
    next: Node
  }

  type Query {
    head: Node
    length: Int
  }

  type Mutation {
    addNode(value: Int!): Node
  }
`;

const resolvers = {
  Query: {
    head: () => linkedList.head,
    length: () => linkedList.length,
  },
  Mutation: {
    addNode: (_, {value}) => {
      let curr = linkedList.head;
      while(curr.next!=null){
        curr = curr.next;
      }
      curr.next = {value, next: null};
      linkedList.length++;
      return linkedList.head;
    }
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
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {})
);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});