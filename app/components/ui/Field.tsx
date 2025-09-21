type Props = {
  label: string;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Field({ label, hint, ...props }: Props) {
  return (
    <label className="block">
      <div className="mb-1 text-sm text-zinc-700">{label}</div>
      <input
        className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
        {...props}
      />
      {hint && <div className="mt-1 text-xs text-zinc-500">{hint}</div>}
    </label>
  );
}
