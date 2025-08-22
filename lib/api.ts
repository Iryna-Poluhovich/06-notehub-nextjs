import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note } from "../types/note";

export interface PaginatedNotes {
  notes: Note[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

const API_KEY = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
});


export async function fetchNotes(
  page: number,
  perPage: number,
  search?: string
): Promise<PaginatedNotes> {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  const { data }: AxiosResponse<PaginatedNotes> = await api.get("/notes", {
    params,
  });
  return data;
}


export async function createNote(note: {
  title: string;
  content: string;
  tag: Note["tag"];
}): Promise<Note> {
  const { data }: AxiosResponse<Note> = await api.post("/notes", note);
  return data;
}

export async function fetchNoteById(id: number): Promise<Note> {
  const { data } = await api.get(`/notes/${id}`);
  return data;
}


export async function deleteNote(id: number): Promise<void> {
  const res = await fetch(`/api/notes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete note");
  }
}