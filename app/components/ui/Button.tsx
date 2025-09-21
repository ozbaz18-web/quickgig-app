import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

export default function Button({ className, variant="primary", size="md", ...props }: Props) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-xl font-medium transition",
        size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2",
        variant === "primary" && "bg-orange-500 text-white hover:bg-orange-600 shadow",
        variant === "secondary" && "border border-zinc-300 bg-white hover:bg-zinc-50",
        variant === "ghost" && "text-zinc-700 hover:bg-zinc-100",
        className
      )}
      {...props}
    />
  );
}
