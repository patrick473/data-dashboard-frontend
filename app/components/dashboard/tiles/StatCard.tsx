import { Card } from "@heroui/react/card";
interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
}

export default function StatCard({ label, value, sub }: Readonly<StatCardProps>) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>{label}</Card.Title>
        </Card.Header>
        <Card.Content>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">{sub}</p>
      )}
        </Card.Content>
    </Card>
  );
}
