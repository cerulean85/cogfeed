import Link from "next/link";
import { redirect } from "next/navigation";
import { Brain } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { Footer } from "@/shared/ui/footer";
import { LocaleSwitcher } from "@/shared/ui/locale-switcher";

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  const t = await getTranslations("landing");
  const ta = await getTranslations("auth");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="fixed top-4 right-4">
        <LocaleSwitcher />
      </div>
      <div className="w-full max-w-md space-y-8 text-center">
        {/* 서비스 브랜드 */}
        <div className="space-y-3">
          <h1 className="flex items-center justify-center gap-3 text-4xl font-bold tracking-tight">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-500">
              <Brain size={22} aria-hidden="true" />
            </span>
            CogFeed
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
            {t("tagline")}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/register/terms"
            className={cn(buttonVariants({ size: "lg" }), "w-full justify-center")}
          >
            {t("signUp")}
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full justify-center")}
          >
            {ta("loginButton")}
          </Link>
        </div>

        {/* 쿠팡 파트너스 배너 */}
        <div className="mt-8 flex flex-col items-center">
          <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <iframe
              src="https://coupa.ng/cmrXfF"
              width="200"
              height="240"
              referrerPolicy="unsafe-url"
              style={{ display: "block", border: 0, overflow: "hidden" }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
