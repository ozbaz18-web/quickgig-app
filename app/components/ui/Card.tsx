import clsx from "clsx";
export default function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("bg-white border rounded-2xl shadow-sm", className)} {...props} />;
}
