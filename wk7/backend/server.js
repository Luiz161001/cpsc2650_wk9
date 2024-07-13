import "dotenv/config.js";
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import notesRouter from "./routes/notes.js";
import graphQL from "./routes/graphql.js"

// import { notes, removeNote, addNote, editNote, singleNote } from "./persistence.js"
// import { v4 as uuidv4 } from "uuid";  
// import { ApolloServer } from "@apollo/server";
// import { expressMiddleware } from "@apollo/server/express4";

// Constants
const port = process.env.PORT || 3000;

// Create http server
const app = express();

// view engine setup

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use(express.static(path.join("../client/")));

// app.use("/", indexRouter);
app.use("/notes", notesRouter);
app.use("/graphql", graphQL);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});


//---------------------------------------graphql--------------

// const typeDefs = `#graphql
//     type Note {
//         id: ID!
//         text: String
//     }

//     scalar Url
//     scalar Date

//     type Query {
//         Notes: [Note]
//         Note(id: ID!): Note
//     }

//     type Mutation {
//         createNote(id: ID!, text: String): Note
//         deleteNote(id: ID!): Note
//         editNote(id: ID!, text: String): Note
//     }
// `;

// const resolvers = {
//     Query:{
//         Notes: () => notes(),
//         Note: (_, { id }) => singleNote(id)
//     },
//     Mutation: {
//       createNote: (_, { id, text }) => addNote({ id, text }),
//       deleteNote: (_, { id }) => removeNote(id),
//       editNote: (_, { id, text }) => editNote({ id, text }),
//   }
// }

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// await server.start();

// app.use(
//   '/',
//   cors(),
//   express.json(),
//   expressMiddleware(server, {})
// );

//---------------------------------------graphql--------------



// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
