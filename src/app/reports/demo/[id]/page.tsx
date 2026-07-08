import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function ReportDemoRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/reports/checkout/${id}`);
}
