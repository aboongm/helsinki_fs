import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdoteService";

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
    // voteAnecdote: (state, action)=>{
    //   return state.map((anecdote) =>
    //             anecdote.id === action.payload
    //               ? { ...anecdote, votes: anecdote.votes + 1 }
    //               : anecdote
    //           );
    // },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    updateAnecdote(state, action) {
      return state.map(anecdote =>
        anecdote.id === action.payload.id ? action.payload : anecdote
      );
    }
  }
})

export const { 
  // voteAnecdote, 
  // createAnecdote, 
  appendAnecdote, 
  setAnecdotes,
  updateAnecdote 
} = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    };
    const returnedAnecdote = await anecdoteService.updateVotes(anecdote.id, updatedAnecdote);
    dispatch(updateAnecdote(returnedAnecdote));
  };
};

export default anecdoteSlice.reducer