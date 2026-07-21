import Image from "next/image";

export default function Loading() {
  return (
    <div className="theme-home flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--blue)]">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span className="animate-spin-slow absolute inset-0 rounded-full border-[3px] border-white/15 border-t-[var(--red)]" />
        <Image
          src="/images/icone-acad.png"
          alt="Academia Belfort"
          width={500}
          height={500}
          className="animate-breathe h-14 w-14"
          priority
        />
      </div>
    </div>
  );
}
