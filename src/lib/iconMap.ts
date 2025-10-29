import {
  Award,
  Briefcase,
  Target,
  Users,
  TrendingUp,
  BookOpen,
  GraduationCap,
  Calendar,
  CheckCircle,
  School,
  Trophy,
  Medal,
  Star,
  Lightbulb
} from 'lucide-react';

export const iconMap: Record<string, any> = {
  Award,
  Briefcase,
  Target,
  Users,
  TrendingUp,
  BookOpen,
  GraduationCap,
  Calendar,
  CheckCircle,
  School,
  Trophy,
  Medal,
  Star,
  Lightbulb
};

export function getIcon(iconName: string) {
  return iconMap[iconName] || Briefcase;
}

