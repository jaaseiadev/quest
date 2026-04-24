import { AuthTerminal, ForgotPasswordForm } from "@/components/auth";

export default function ForgotPasswordPage() {
  return (
    <AuthTerminal
      eyebrow="Recovery Protocol"
      title="Reset Access"
      description="Request a recovery link for your registered email."
    >
      <ForgotPasswordForm />
    </AuthTerminal>
  );
}
