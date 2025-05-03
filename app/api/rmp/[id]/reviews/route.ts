import { getTeacherRatings } from "@/lib/rmp";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const ratings = await getTeacherRatings(id);
    return Response.json(ratings);
}