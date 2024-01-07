export default function NoData({ message }: { message: string }) {
  return (
    <div className="w-full py-12 mx-auto max-w-xl">
      <p className="text-lg font-medium text-zinc-500 text-center">{message}</p>
    </div>
  );
}
