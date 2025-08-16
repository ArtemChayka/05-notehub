import { useEffect, useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import {
  fetchNotes,
  deleteNote,
  createNote,
  CreateNotePayload,
  FetchNotesResponse, 
} from "../../services/noteService";

export default function App() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClientInstance = useQueryClient();



  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const { data, isLoading, isError, error } = useQuery<
    FetchNotesResponse,
    Error
  >({
    queryKey: ["notes", page, debouncedSearchTerm],
    queryFn: () => fetchNotes({ page, search: debouncedSearchTerm }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote, 
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ["notes"] }); 
    },
  });
// console.log(deleteMutation);

  const createMutation = useMutation({
    mutationFn: createNote, 
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ["notes"] }); 
      setIsModalOpen(false);
    },
  });

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  };

  const handleNoteDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleCreateNote = (values: CreateNotePayload) => {
    createMutation.mutate(values);
  };

  if (isLoading) {
    return <div className={css.loading}>Loading notes...</div>;
  }

  if (isError) {
    return <div className={css.error}>Error: {error.message}</div>;
  }

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchTerm} onSearchChange={setSearchTerm} />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            onPageChange={handlePageChange}
            currentPage={page}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {notes.length > 0 ? (
        <NoteList notes={notes} onDelete={handleNoteDelete} />
      ) : (
        <p className={css.noNotes}>No notes found. Create a new one!</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
