import { redirect } from "next/navigation";

export default async function EventIdRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/events/detail?id=${encodeURIComponent(id)}`);
}
