import { Card } from "@/components/ui";

export type DashboardErrorBannerProps = {
  messages: string[];
};

export function DashboardErrorBanner({ messages }: DashboardErrorBannerProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <Card variant="danger" role="alert">
      <p className="text-label-caps text-danger">Dashboard Data Warning</p>
      <ul className="mt-3 space-y-2 text-sm leading-6">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </Card>
  );
}
