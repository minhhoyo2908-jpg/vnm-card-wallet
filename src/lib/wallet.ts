import { useCallback, useEffect, useState } from "react";

export type Tx = {
  id: string;
  label: string;
  amount: number;
  at: number;
};

export type WalletState = {
  name: string;
  balance: number;
  txs: Tx[];
};

const KEY = "vi-vnm-state-v1";

const initial: WalletState = { name: "", balance: 2_500_000, txs: [] };

export function loadState(): WalletState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as WalletState) : null;
  } catch {
    return null;
  }
}

export function formatVnd(n: number) {
  return new Intl.NumberFormat("vi-VN").format(Math.round(n)) + " ₫";
}

export function useWallet() {
  const [state, setState] = useState<WalletState>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = loadState();
    if (saved) setState({ ...initial, ...saved });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  const setName = useCallback((name: string) => {
    setState((s) => ({ ...s, name }));
  }, []);

  const apply = useCallback((label: string, amount: number) => {
    setState((s) => ({
      ...s,
      balance: s.balance + amount,
      txs: [
        { id: crypto.randomUUID(), label, amount, at: Date.now() },
        ...s.txs,
      ].slice(0, 30),
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initial);
    if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
  }, []);

  return { state, ready, setName, apply, reset };
}
