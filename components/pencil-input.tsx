import { PencilIcon } from "lucide-react";

export default function PencilIconInput() {
  return (
    <PencilIcon
      className="absolute left-4 top-1/2 opacity-20 -translate-y-1/2 -ml-8 h-4 w-4 text-current  transition-opacity duration-200 pointer-events-none group-focus-within:opacity-100 group-hover:opacity-100 peer-not-placeholder-shown:opacity-100"
      aria-hidden="true"
    />
  );
}
