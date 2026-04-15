import type { Metadata } from "next";
import { SubscriptionView } from "./subscription-view";

export const metadata: Metadata = {
  title: "구독 관리 — CogFeed",
};

export default function SubscriptionPage() {
  return <SubscriptionView />;
}
