export const VOTE_ANECDOTE = 'VOTE_ANECDOTE';

export const voteAnecdote = (id) => {
  return {
    type: VOTE_ANECDOTE,
    payload: id,
  };
};


export const ADD_ANECDOTE = 'ADD_ANECDOTE';

export const addAnecdote = (anecdote) => {
  return {
    type: ADD_ANECDOTE,
    payload: anecdote,
  };
};