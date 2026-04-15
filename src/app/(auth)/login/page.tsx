import type { Metadata } from "next";

import { LoginForm } from "@/features/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export const metadata: Metadata = {
  title: "로그인 — CogFeed",
};

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl" id="login-heading">
          로그인
        </CardTitle>
        <CardDescription>
          이메일과 비밀번호를 입력해 계속 진행하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
