"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteNote } from "@/lib/api";
import styles from "./NoteList.module.css";
import type { Note } from "../../types/note";

interface NoteListProps {
  query: string;
  page: number;
  notes: Note[];
}

export default function NoteList({ query, page, notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteNote(id);
      return id;
    },
    onMutate: (id: string) => {
      setIsDeleting(id); // ✅ виставляємо id нотатки перед видаленням
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", query, page] });
    },
    onSettled: () => {
      setIsDeleting(null);
    },
  });

  if (!notes.length) return null;

  return (
    <ul className={styles.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={styles.listItem}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.content}>{content}</p>
          <div className={styles.footer}>
            <span className={styles.tag}>{tag}</span>

            <Link href={`/notes/${id}`} className={styles.link}>
              View details
            </Link>

            <button
              type="button"
              className={styles.button}
              onClick={() => mutation.mutate(String(id))}
              disabled={isDeleting === String(id)}
            >
              {isDeleting === String(id) ? "Deleting…" : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}