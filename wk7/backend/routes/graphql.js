import express from "express";
import { notes, removeNote, addNote, editNote, singleNote } from "../persistence.js"
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";  

const router = express.Router();

const typeDefs = `#graphql
    type Note {
        id: ID!
        text: String
    }

    scalar Url
    scalar Date

    type Query {
        Notes: [Note]
        Note(id: ID!): [Note]
    }

    type Mutation {
        createNote(text: String): String
        deleteNote(id: ID!): String 
        editNote(id: ID!, text: String): String
    }
`;

const resolvers = {
    Query: {
        Notes: () => {
            console.log("here at graphql notes")
            return notes();
        },
        Note: (_, { id }) => {
            console.log("here at graphql single notes");
            return singleNote(id);
        }
    },
    Mutation: {
        createNote: (_, { text }) => {
            let id = uuidv4();
            addNote(id, text);
            return `Note added successfully!`;
        },
        deleteNote: (_, { id }) => {
            removeNote(id);
            return `Note ${id} deleted successfully!`;
        },
        editNote: (_, { id, text }) =>{
            editNote(id, text);
            return text;
        } 
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

await server.start();

router.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {})
);

export default router;
