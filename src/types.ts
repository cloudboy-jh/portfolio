export type Status = "active" | "building" | "shipped" | "paused";
export type SectionIcon = "star" | "wrench" | "terminal" | "app";

export interface Project {
  name: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  pushedAt: string | null;
  mark: string;
  status: Status;
  tech: string;
}

export interface Group {
  id: string;
  label: string;
  icon?: SectionIcon;
  projects: Project[];
}

export interface LinkEntry {
  label: string;
  value: string;
  href: string;
}

export interface ProjectsPayload {
  updatedAt: string;
  groups: Group[];
  links: Record<string, LinkEntry>;
}
