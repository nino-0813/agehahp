export interface NavItem {
  id: string;
  label: string;
  num: string;
  link: string;
}

export interface CalendarDay {
  date: number;
  dayOfWeek: number; // 0 = Sunday
  isCurrentMonth: boolean;
  events?: string[];
  isHoliday?: boolean;
  isClosed?: boolean;
}

export interface ImageAsset {
  src: string;
  alt: string;
}

export enum SectionType {
  CONCEPT = 'concept',
  VISUAL = 'visual',
  MENU = 'menu',
  ACCESS = 'access'
}