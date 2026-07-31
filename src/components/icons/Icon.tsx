import {
  Brain,
  Globe,
  Cloud,
  ShieldCheck,
  UserCheck,
  Workflow,
  Users,
  Briefcase,
  Server,
  Database,
  LayoutTemplate,
  GitBranch,
  Gauge,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  "ai-llm": Brain,
  web: Globe,
  cloud: Cloud,
  qa: ShieldCheck,
  "user-check": UserCheck,
  workflow: Workflow,
  users: Users,
  "shield-check": ShieldCheck,
  brain: Brain,
  briefcase: Briefcase,
  server: Server,
  database: Database,
  layout: LayoutTemplate,
  shield: ShieldCheck,
  git: GitBranch,
  gauge: Gauge,
};

export function Icon({
  name,
  size = 22,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Cmp = map[name] ?? Brain;
  // Decorative by default — the adjacent text carries the meaning.
  return <Cmp size={size} className={className} aria-hidden="true" />;
}
