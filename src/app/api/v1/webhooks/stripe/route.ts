import { apiSuccess } from "@/shared/lib/api";

export async function POST() {
  return apiSuccess({ received: true });
}
