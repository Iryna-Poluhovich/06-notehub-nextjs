"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteNote } from "@/lib/api";
import styles from "./NoteList.module.css";
import type { Note } from "../../types/note";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

   const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(Number(id)),
    onMutate: (id: string) => {
      setIsDeleting(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onSettled: () => {
      setIsDeleting(null);
    },
  });

  if (!notes.length) return null;

  return (
    <ul className={styles.list}>
      {notes.map((note) => (
        <li key={note.id} className={styles.listItem}>
          <h2 className={styles.title}>{note.title}</h2>
          <p className={styles.content}>{note.content}</p>
          <div className={styles.footer}>
            <span className={styles.tag}>{note.tag}</span>

            <Link href={`/notes/${note.id}`} className={styles.link}>
              View details
            </Link>

            <button
              type="button"
              className={styles.button}
              onClick={() => mutation.mutate(String(note.id))}
              disabled={isDeleting === String(note.id)}
            >
              {isDeleting === String(note.id) ? "Deleting…" : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}