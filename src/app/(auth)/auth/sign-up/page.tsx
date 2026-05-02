import { AuthTerminal, SignUpForm } from "@/components/auth";

export default function SignUpPage() {
  return (
    <AuthTerminal
      eyebrow="Join The Guild"
      title="Create Operative"
      description="Register a student profile and initialize rank progression."
    >
      <SignUpForm />
    </AuthTerminal>
  );
}
