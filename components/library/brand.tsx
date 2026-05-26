import { Library } from "lucide-react";

export function Brand({ large = false }: { large?: boolean }) {
  return (
    <span className={large ? "brand-mark large" : "brand-mark"}>
      <Library size={large ? 34 : 24} />
    </span>
  );
}

