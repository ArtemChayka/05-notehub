import axios, { AxiosResponse } from "axios";
import { Note, NoteTag } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;
console.log(token);


const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  currentPage: number;
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> = await axiosInstance.get(
    "/notes",
    { params }
  );
  return response.data;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function createNote(data: CreateNoteParams): Promise<Note> {
  const response: AxiosResponse<Note> = await axiosInstance.post(
    "/notes",
    data
  );
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await axiosInstance.delete(
    `/notes/${id}`
  );
  return response.data;
}
