import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500">
      <div className="mb-4 text-blue-500">
        {icon}
      </div>

      <h3 className="mb-2 text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="text-zinc-400">
        {description}
      </p>
    </div>
  );
}