import { MapPinIcon } from "@heroicons/react/24/solid";

export default function UnidadeToggle({
  unidade,
  onChange,
}: {
  unidade: "telegrafo" | "sacramenta";
  onChange: (u: "telegrafo" | "sacramenta") => void;
}) {
  return (
    <div className="mb-10">
      <p className="mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-white/60">
        Escolha sua unidade
      </p>
      <div className="flex flex-wrap gap-3">
        {(["telegrafo", "sacramenta"] as const).map((u) => (
          <button
            key={u}
            onClick={() => onChange(u)}
            className={`flex items-center gap-2 rounded-lg border-2 px-8 py-3.5 text-[0.95rem] font-semibold uppercase tracking-[0.06em] transition-all active:scale-95 ${
              unidade === u
                ? "border-white bg-white text-[var(--blue)]"
                : "border-white/25 bg-transparent text-white/60 hover:border-white hover:text-white"
            }`}
          >
            <MapPinIcon className="h-5 w-5" />
            {u === "telegrafo" ? "Telégrafo" : "Sacramenta"}
          </button>
        ))}
      </div>
    </div>
  );
}
