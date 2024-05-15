export const VOTE_ANECDOTE = 'VOTE_ANECDOTE';

export const voteAnecdote = (id) => {
  return {
    type: VOTE_ANECDOTE,
    payload: id,
  };
};