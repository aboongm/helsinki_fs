import React, { useEffect } from "react";
import Notification from "./components/Notification";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Filter from "./components/Filter";
import anecdoteService from "./services/anecdoteService";
import store from "./store";
import { setAnecdotes } from "./reducers/anecdoteReducer";

const App = () => {
  useEffect(() => {
    anecdoteService
      .getAll()
      .then((anecdotes) => store.dispatch(setAnecdotes(anecdotes)));
  }, []);

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
