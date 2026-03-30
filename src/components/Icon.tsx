import {
  Bot,
  Building2,
  Wand2,
  GitBranch,
  Cpu,
  UserCheck,
  Rocket,
  Code,
  Monitor,
  Server,
  Database,
  FlaskConical,
  Settings,
  Plug,
  Mail,
  Phone,
  Check,
  Send,
  CalendarCheck,
  ArrowDown,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "fa-robot": Bot,
  "fa-building": Building2,
  "fa-wand-magic-sparkles": Wand2,
  "fa-code-branch": GitBranch,
  "fa-microchip": Cpu,
  "fa-user-check": UserCheck,
  "fa-rocket": Rocket,
  "fa-code": Code,
  "fa-display": Monitor,
  "fa-server": Server,
  "fa-database": Database,
  "fa-vial": FlaskConical,
  "fa-gears": Settings,
  "fa-plug": Plug,
  "fa-envelope": Mail,
  "fa-phone": Phone,
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function Icon({ name, size = 20, className }: IconProps) {
  const LucideIcon = iconMap[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} aria-hidden="true" />;
}

export {
  Check,
  Send,
  CalendarCheck,
  ArrowDown,
  Menu,
  X,
  Loader2,
  Mail,
  Phone,
};
