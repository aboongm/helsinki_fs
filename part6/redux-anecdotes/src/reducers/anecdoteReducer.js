import { createSlice } from "@reduxjs/toolkit";

export const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const initialState = []

export const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    voteAnecdote: (state, action)=>{
      return state.map((anecdote) =>
                anecdote.id === action.payload
                  ? { ...anecdote, votes: anecdote.votes + 1 }
                  : anecdote
              );
    },
    addAnecdote: (state, action)=>{
      return [...state, action.payload];
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { voteAnecdote, addAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export default anecdoteSlice.reducer