import { useState } from "react";
import {
  ArrowUpRight,
  Plus,
  Eye,
  EyeOff,
  ShoppingBag,
  LogOut,
  Sparkles,
} from "lucide-react";
import { formatVnd, type WalletState } from "@/lib/wallet";
import { Minigames } from "@/components/Minigames";

const QUICK_TOPUP = [200_000, 500_000, 1_000_000];

const SERVICES = [
  { name: "Gói Data 5G", price: 120_000, note: "30 ngày không giới hạn" },
  { name: "Xem phim Premium", price: 89_000, note: "4K HDR — 1 tháng" },
  { name: "Bảo hiểm Ví", price: 250_000, note: "Bảo vệ giao dịch 12 tháng" },
];

export function Dashboard({
  state,
  apply,
  onLogout,
}: {
  state: WalletState;
  apply: (label: string, amount: number) => void;
  onLogout: () => void;
}) {
  const [hidden, setHidden] = useState(false);
  const [panel, setPanel] = useState<"transfer" | "topup" | "services" | "games">("transfer");

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold-soft">
            Ví VNM
          </p>
          <h1 className="mt-1 font-display text-2xl">Xin chào, {state.name}</h1>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground"
        >
          <LogOut className="size-3.5" /> Rút thẻ
        </button>
      </header>

      <section className="animate-rise mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden rounded-3xl p-7 bank-card">
          <div className="pointer-events-none absolute inset-0">
            <div className="animate-shimmer absolute inset-y-0 -left-1/3 w-1/3 bg-foreground/[0.06] blur-lg" />
          </div>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              Số dư khả dụng
            </p>
            <button
              onClick={() => setHidden((h) => !h)}
              className="text-muted-foreground transition-colors hover:text-gold"
              aria-label="Ẩn hiện số dư"
            >
              {hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <p className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
            {hidden ? "••••••••" : formatVnd(state.balance)}
          </p>
          <p className="mt-6 font-mono text-sm tracking-[0.28em] text-foreground/70">
            4826 •••• •••• 1195
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {state.name}
          </p>
        </div>

        <div className="rounded-3xl p-6 surface-panel">
          <h3 className="font-display text-lg">Giao dịch gần đây</h3>
          <div className="mt-4 space-y-3">
            {state.txs.length === 0 && (
              <p className="text-xs text-muted-foreground">Chưa có giao dịch nào.</p>
            )}
            {state.txs.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.label}</span>
                <span className={t.amount >= 0 ? "text-gold" : "text-foreground/80"}>
                  {t.amount >= 0 ? "+" : "−"}
                  {formatVnd(Math.abs(t.amount))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <nav className="mt-10 flex flex-wrap gap-2">
        {(
          [
            ["transfer", "Chuyển tiền", ArrowUpRight],
            ["topup", "Nạp tiền", Plus],
            ["services", "Mua dịch vụ", ShoppingBag],
            ["games", "Minigame", Sparkles],
          ] as const
        ).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setPanel(key)}
            className={
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-all duration-300 " +
              (panel === key
                ? "bg-[var(--gradient-gold)] font-semibold text-primary-foreground shadow-[var(--shadow-gold)]"
                : "border border-border text-muted-foreground hover:border-gold/50 hover:text-foreground")
            }
          >
            <Icon className="size-4" /> {label}
          </button>
        ))}
      </nav>

      <section className="mt-6">
        {panel === "transfer" && <Transfer apply={apply} balance={state.balance} />}
        {panel === "topup" && <TopUp apply={apply} />}
        {panel === "services" && <Services apply={apply} balance={state.balance} />}
        {panel === "games" && <Minigames apply={apply} balance={state.balance} />}
      </section>

      <KhongBa />
    </main>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-ring"
    />
  );
}

function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-xl bg-[var(--gradient-gold)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100"
    />
  );
}

function Transfer({ apply, balance }: { apply: (l: string, a: number) => void; balance: number }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const value = Number(amount);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!to.trim() || !value) return;
        if (value > balance) return setMsg("Số dư không đủ.");
        apply(`Chuyển tới ${to.trim()}`, -value);
        setMsg(`Đã chuyển ${formatVnd(value)} tới ${to.trim()}.`);
        setTo("");
        setAmount("");
      }}
      className="animate-rise grid gap-4 rounded-2xl p-6 surface-panel sm:grid-cols-2"
    >
      <Field placeholder="Người nhận" value={to} onChange={(e) => setTo(e.target.value)} />
      <Field
        placeholder="Số tiền (₫)"
        value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
      />
      <div className="sm:col-span-2 flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">{msg}</p>
        <PrimaryButton type="submit" disabled={!to.trim() || !value}>
          Chuyển tiền
        </PrimaryButton>
      </div>
    </form>
  );
}

function TopUp({ apply }: { apply: (l: string, a: number) => void }) {
  const [custom, setCustom] = useState("");
  return (
    <div className="animate-rise rounded-2xl p-6 surface-panel">
      <div className="flex flex-wrap gap-3">
        {QUICK_TOPUP.map((v) => (
          <button
            key={v}
            onClick={() => apply("Nạp tiền", v)}
            className="rounded-xl border border-gold/30 bg-surface-2 px-5 py-3 text-sm transition-all duration-300 hover:border-gold/70 hover:bg-accent"
          >
            + {formatVnd(v)}
          </button>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Field
          placeholder="Số tiền tuỳ chọn"
          value={custom}
          onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))}
        />
        <PrimaryButton
          disabled={!Number(custom)}
          onClick={() => {
            apply("Nạp tiền", Number(custom));
            setCustom("");
          }}
        >
          Nạp vào ví
        </PrimaryButton>
      </div>
    </div>
  );
}

function Services({ apply, balance }: { apply: (l: string, a: number) => void; balance: number }) {
  return (
    <div className="animate-rise grid gap-4 md:grid-cols-3">
      {SERVICES.map((s) => (
        <div key={s.name} className="flex flex-col rounded-2xl p-6 surface-panel">
          <h4 className="font-display text-lg">{s.name}</h4>
          <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
          <p className="mt-4 font-mono text-base text-gold">{formatVnd(s.price)}</p>
          <button
            disabled={balance < s.price}
            onClick={() => apply(`Mua ${s.name}`, -s.price)}
            className="mt-5 rounded-xl border border-gold/30 bg-surface-2 px-4 py-2.5 text-sm transition-all duration-300 hover:border-gold/70 hover:bg-accent disabled:opacity-40"
          >
            {balance < s.price ? "Không đủ số dư" : "Mua bằng số dư"}
          </button>
        </div>
      ))}
    </div>
  );
}

function KhongBa() {
  return (
    <section className="mt-16 overflow-hidden rounded-3xl p-8 surface-panel sm:p-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold-soft">
        Nguyên tắc cốt lõi
      </p>
      <h2 className="mt-3 font-display text-3xl">
        Quy tắc <span className="text-gold-gradient">"Không Ba"</span>
      </h2>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Ba điều Ví VNM cam kết không bao giờ vi phạm.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="group rounded-2xl border border-border bg-surface-2/60 p-6 transition-all duration-500 hover:border-gold/50"
          >
            <span className="font-display text-4xl text-gold-gradient">0{n}</span>
            <h3 className="mt-4 font-display text-lg text-muted-foreground">
              Không —— (nội dung cập nhật sau)
            </h3>
            <p className="mt-2 text-sm text-muted-foreground/70">
              Mô tả chi tiết cho quy tắc thứ {n} sẽ được bổ sung tại đây.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
