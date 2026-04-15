import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { RegisterForm } from "@/features/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입 — CogFeed",
};

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl" id="register-heading">
          기본 정보 입력
        </CardTitle>
        <CardDescription>
          이메일과 비밀번호를 입력해 계정을 만드세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
