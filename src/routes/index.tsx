import { createFileRoute } from "@tanstack/react-router";
import { useWallet } from "@/lib/wallet";
import { CardOnboarding } from "@/components/CardOnboarding";
import { Dashboard } from "@/components/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ví VNM — Ví điện tử sang trọng, tối giản" },
      {
        name: "description",
        content:
          "Ví VNM: nhét thẻ, xem số dư, chuyển tiền, nạp tiền, mua dịch vụ và chơi minigame trong một giao diện ngân hàng tối giản.",
      },
      { property: "og:title", content: "Ví VNM — Ví điện tử sang trọng, tối giản" },
      {
        property: "og:description",
        content: "Trải nghiệm ví điện tử với hiệu ứng nhét thẻ và quy tắc Không Ba.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { state, ready, setName, apply, reset } = useWallet();

  if (!ready) return <div className="min-h-screen" />;

  if (!state.name) return <CardOnboarding onDone={setName} />;

  return <Dashboard state={state} apply={apply} onLogout={reset} />;
}
