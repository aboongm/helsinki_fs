import React from "react";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { useDispatch, useSelector } from "react-redux";
import { clearNotification, setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const dispatch = useDispatch();

  const anecdotes = useSelector((state) => {
    const filteredAnecdotes = state.anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
    );
    const sortedAnecdotes = [...filteredAnecdotes].sort(
      (a, b) => b.votes - a.votes
    );
    return sortedAnecdotes;
  });

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote.id));
    dispatch(setNotification(`you voted '${anecdote.content}'`))

    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnecdoteList;
