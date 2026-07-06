export default function ReportsLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
        <p className="mt-4 text-sm text-stone-500">Loading reports…</p>
      </div>
    </div>
  );
}
