import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { RegisterForm } from "@/features/auth";

export const metadata: Metadata = { title: "CogFeed" };

export default async function RegisterPage() {
  const t = await getTranslations("auth");
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl" id="register-heading">{t("registerTitle")}</CardTitle>
        <CardDescription>{t("registerDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
