import { useState } from "react";
import { CreditCard, ChevronRight, ShieldCheck } from "lucide-react";

export function CardOnboarding({ onDone }: { onDone: (name: string) => void }) {
  const [stage, setStage] = useState<"idle" | "inserting" | "name">("idle");
  const [name, setName] = useState("");

  const insert = () => {
    setStage("inserting");
    window.setTimeout(() => setStage("name"), 1500);
  };

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.42em] text-gold-soft">
        Private Banking
      </p>
      <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">
        Ví <span className="text-gold-gradient">VNM</span>
      </h1>
      <p className="mt-3 max-w-md text-center text-sm text-muted-foreground">
        Nhét thẻ của bạn vào khe bên dưới để bắt đầu phiên giao dịch an toàn.
      </p>

      <div className="mt-14 w-full [perspective:1400px]">
        {stage !== "name" && (
          <div
            className={
              "relative mx-auto h-52 w-full max-w-sm overflow-hidden rounded-2xl p-6 bank-card " +
              (stage === "inserting" ? "animate-card-swallow" : "animate-card-insert")
            }
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="animate-shimmer absolute inset-y-0 -left-1/3 w-1/3 bg-foreground/10 blur-md" />
            </div>
            <div className="flex items-start justify-between">
              <span className="font-display text-lg">VNM</span>
              <CreditCard className="size-5 text-gold" />
            </div>
            <div className="mt-6 h-8 w-12 rounded-md bg-[var(--gradient-gold)]" />
            <p className="mt-6 font-mono text-base tracking-[0.28em] text-foreground/80">
              4826 •••• •••• 1195
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Signature Member
            </p>
          </div>
        )}

        <div
          className={
            "mx-auto mt-8 flex h-4 w-full max-w-sm items-center rounded-full bg-surface-2 " +
            (stage === "inserting" ? "animate-pulse-slot" : "")
          }
        >
          <div className="mx-auto h-[3px] w-[85%] rounded-full bg-background/80" />
        </div>
      </div>

      {stage === "idle" && (
        <button
          onClick={insert}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--gradient-gold)] px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
        >
          Nhét thẻ vào <ChevronRight className="size-4" />
        </button>
      )}

      {stage === "inserting" && (
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.32em] text-gold-soft">
          Đang đọc thẻ…
        </p>
      )}

      {stage === "name" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) onDone(name.trim());
          }}
          className="animate-rise mt-10 w-full max-w-sm rounded-2xl p-6 surface-panel"
        >
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-gold" /> Thẻ hợp lệ — xác thực chủ thẻ
          </p>
          <label className="mt-5 block font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            Tên chủ thẻ
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nguyễn Văn A"
            className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-base outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="mt-5 w-full rounded-xl bg-[var(--gradient-gold)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform duration-300 hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
          >
            Mở ví
          </button>
        </form>
      )}
    </main>
  );
}
