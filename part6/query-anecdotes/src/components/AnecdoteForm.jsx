import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../service/request";
import { useNotification } from "../NotificationContext";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onError: (error) => {
      showNotification(error.message || "Failed to add anecdote.", 5);
    },
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
      showNotification("New anecdote created!", 5);
    },
  });

  const onCreate = async (event) => {
    event.preventDefault();
    try {
      const content = event.target.anecdote.value.trim();
      if (content.length < 5) {
        throw new Error("too short anecdote, must have length 5 or more");
      }
      event.target.anecdote.value = "";
      newAnecdoteMutation.mutate({ content, votes: 0 });
    } catch (error) {
      showNotification(error.message || "Failed to add anecdote.", 5);
    }
  };
  

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
