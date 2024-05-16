import React from "react";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { useDispatch, useSelector } from "react-redux";

const AnecdoteList = () => {
  const dispatch = useDispatch();
  
  const anecdotes = useSelector((state) =>
    state.anecdotes
      .sort((a, b) => b.votes - a.votes)
      .filter((anecdote) =>
        anecdote.content.toLowerCase().includes(state.filter?.toLowerCase())
      )
  );
console.log('state: ', useSelector(state=>state));
  const vote = (id) => {
    dispatch(voteAnecdote(id));
  };

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnecdoteList;
