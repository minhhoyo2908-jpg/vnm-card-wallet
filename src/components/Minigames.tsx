import { useState } from "react";
import { formatVnd } from "@/lib/wallet";

const SYMBOLS = ["◆", "★", "♠", "♥"];

export function Minigames({ apply, balance }: { apply: (l: string, a: number) => void; balance: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Slots apply={apply} balance={balance} />
      <CoinFlip apply={apply} balance={balance} />
      <GuessNumber apply={apply} />
    </div>
  );
}

function GameShell({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-5 surface-panel">
      <h4 className="font-display text-lg">{title}</h4>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ActionButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full rounded-xl border border-gold/30 bg-surface-2 px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:border-gold/70 hover:bg-accent disabled:opacity-40"
    >
      {children}
    </button>
  );
}

const BET = 20_000;

function Slots({ apply, balance }: { apply: (l: string, a: number) => void; balance: number }) {
  const [reels, setReels] = useState(["◆", "★", "♠"]);
  const [spinning, setSpinning] = useState(false);
  const [msg, setMsg] = useState("");

  const spin = () => {
    if (spinning || balance < BET) return;
    setSpinning(true);
    setMsg("");
    const iv = window.setInterval(() => {
      setReels(Array.from({ length: 3 }, () => SYMBOLS[Math.floor(Math.random() * 4)]));
    }, 80);
    window.setTimeout(() => {
      window.clearInterval(iv);
      const final = Array.from({ length: 3 }, () => SYMBOLS[Math.floor(Math.random() * 4)]);
      setReels(final);
      setSpinning(false);
      const all = final[0] === final[1] && final[1] === final[2];
      const two = new Set(final).size === 2;
      const win = all ? BET * 8 : two ? BET * 1.5 : 0;
      apply(all ? "Slots — Jackpot" : two ? "Slots — Đôi" : "Slots — Thua", win - BET);
      setMsg(win ? `Thắng ${formatVnd(win - BET)}` : `Mất ${formatVnd(BET)}`);
    }, 900);
  };

  return (
    <GameShell title="Lucky Reels" desc={`Cược ${formatVnd(BET)} mỗi lượt`}>
      <div className="flex justify-center gap-3">
        {reels.map((r, i) => (
          <div
            key={i}
            className="flex size-14 items-center justify-center rounded-xl border border-border bg-background/60 text-2xl text-gold"
          >
            {r}
          </div>
        ))}
      </div>
      <p className="mt-3 h-4 text-center text-xs text-muted-foreground">{msg}</p>
      <div className="mt-3">
        <ActionButton onClick={spin} disabled={spinning || balance < BET}>
          {spinning ? "Đang quay…" : "Quay"}
        </ActionButton>
      </div>
    </GameShell>
  );
}

function CoinFlip({ apply, balance }: { apply: (l: string, a: number) => void; balance: number }) {
  const [msg, setMsg] = useState("");
  const [flip, setFlip] = useState(false);

  const play = (side: "S" | "N") => {
    if (flip || balance < BET) return;
    setFlip(true);
    window.setTimeout(() => {
      const res = Math.random() < 0.5 ? "S" : "N";
      const win = res === side;
      apply(win ? "Sấp Ngửa — Thắng" : "Sấp Ngửa — Thua", win ? BET : -BET);
      setMsg(`${res === "S" ? "Sấp" : "Ngửa"} — ${win ? "Thắng" : "Thua"} ${formatVnd(BET)}`);
      setFlip(false);
    }, 700);
  };

  return (
    <GameShell title="Sấp Ngửa" desc={`Đoán đúng nhân đôi ${formatVnd(BET)}`}>
      <div
        className={
          "mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--gradient-gold)] font-display text-xl text-primary-foreground transition-transform duration-700 " +
          (flip ? "[transform:rotateY(720deg)]" : "")
        }
      >
        ₫
      </div>
      <p className="mt-3 h-4 text-center text-xs text-muted-foreground">{msg}</p>
      <div className="mt-3 flex gap-2">
        <ActionButton onClick={() => play("S")} disabled={flip || balance < BET}>
          Sấp
        </ActionButton>
        <ActionButton onClick={() => play("N")} disabled={flip || balance < BET}>
          Ngửa
        </ActionButton>
      </div>
    </GameShell>
  );
}

function GuessNumber({ apply }: { apply: (l: string, a: number) => void }) {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [guess, setGuess] = useState("");
  const [msg, setMsg] = useState("Đoán số từ 1 đến 10");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const g = Number(guess);
    if (!g) return;
    if (g === target) {
      apply("Đoán số — Thắng", 100_000);
      setMsg(`Chính xác! +${formatVnd(100_000)}`);
      setTarget(Math.floor(Math.random() * 10) + 1);
    } else {
      setMsg(g < target ? "Cao hơn nữa…" : "Thấp hơn nữa…");
    }
    setGuess("");
  };

  return (
    <GameShell title="Đoán Số" desc="Miễn phí — thưởng 100.000 ₫">
      <form onSubmit={submit} className="space-y-3">
        <input
          value={guess}
          onChange={(e) => setGuess(e.target.value.replace(/\D/g, ""))}
          placeholder="1 – 10"
          className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-center text-sm outline-none focus:border-gold/60"
        />
        <p className="h-4 text-center text-xs text-muted-foreground">{msg}</p>
        <ActionButton type="submit">Đoán</ActionButton>
      </form>
    </GameShell>
  );
}
