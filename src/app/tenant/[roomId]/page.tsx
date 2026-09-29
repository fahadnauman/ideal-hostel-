import { redirect } from "next/navigation";

export default async function TenantRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  redirect(`/tenant-portal?room=${encodeURIComponent(roomId)}`);
}
