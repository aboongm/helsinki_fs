import { useQuery } from "@tanstack/react-query";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { fetchAnecdotes } from "./service/request";

const App = () => {

  const { data: anecdotes, error, isLoading, isError } = useQuery({
    queryKey: ["anecdotes"],
    queryFn: fetchAnecdotes,
    retry: 1,
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

  const handleVote = (anecdote) => {
    console.log("vote");
  };

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
