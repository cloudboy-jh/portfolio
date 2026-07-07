export type Status = "active" | "building" | "shipped" | "paused";

export interface CurationProject {
  repo: string;
  mark: string;
  status: Status;
  descOverride?: string;
  tech: string;
}

export type SectionIcon = "star" | "wrench" | "terminal" | "app";

export interface CurationGroup {
  id: string;
  label: string;
  icon?: SectionIcon;
  projects: CurationProject[];
}

export interface LinkEntry {
  label: string;
  value: string;
  href: string;
}

export interface Curation {
  groups: CurationGroup[];
  links: Record<string, LinkEntry>;
}

export interface GitHubFacts {
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  pushedAt: string | null;
}

export interface Project extends GitHubFacts {
  name: string;
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

export interface ProjectsPayload {
  updatedAt: string;
  groups: Group[];
  links: Record<string, LinkEntry>;
}
