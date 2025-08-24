import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

// interface NoteDetailsPageProps {
//   params: { id: string };
// }

export default async function NoteDetailsPage({ params,
}: {
  params: { id: string };
}) {
  const queryClient = new QueryClient();
  const noteId = Number(params.id);

    await queryClient.prefetchQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={noteId} />
    </HydrationBoundary>
  );
}