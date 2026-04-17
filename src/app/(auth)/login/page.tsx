import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/features/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export const metadata: Metadata = { title: "CogFeed" };

export default async function LoginPage() {
  const t = await getTranslations("auth");
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl" id="login-heading">{t("loginTitle")}</CardTitle>
        <CardDescription>{t("loginDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
