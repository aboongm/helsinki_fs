import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { fetchAnecdotes, updatedAnecdote } from "./service/request";

const App = () => {
  const queryClient = useQueryClient();

  const updateAnecdoteMutation = useMutation({
    mutationFn: updatedAnecdote,
    onSuccess: () => {
        queryClient.invalidateQueries('anecdotes')
    },
  });

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
  };

  const {
    data: anecdotes,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["anecdotes"],
    queryFn: fetchAnecdotes,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>loading data...</div>;
  }

  if (isError) {
    return (
      <div>
        <h3>Anecdote service not available due to problems in server</h3>
      </div>
    );
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
