
export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
}

export interface SkillCategory {
  title: string;
  level: 'Advanced' | 'Intermediate' | 'Beginner';
  skills: string[];
}

export interface Achievement {
  title: string;
  description: string;
}
