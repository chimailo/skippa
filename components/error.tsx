export default function FetchError({ message }: { message?: string }) {
  return (
    <div className="w-full py-12 flex items-center justify-center">
      <p className="text-lg font-medium text-zinc-500">
        {message || "Failed to fetch resource"}
      </p>
    </div>
  );
}
