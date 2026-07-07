import { fetchRepo } from "./github";
import type {
  Curation,
  GitHubFacts,
  Group,
  Project,
  ProjectsPayload,
} from "./types";

const OWNER = "cloudboy-jh";

/**
 * Build the full payload: fetch live GitHub facts for every curated repo,
 * then merge editorial config on top. Preserves group + array order from
 * curation. Uses descOverride only when the GitHub description is empty.
 */
export async function buildPayload(
  curation: Curation,
  token?: string,
): Promise<ProjectsPayload> {
  const groups: Group[] = await Promise.all(
    curation.groups.map(async (group) => {
      const projects: Project[] = await Promise.all(
        group.projects.map(async (cp) => {
          const facts: GitHubFacts =
            (await fetchRepo(cp.repo, token)) ?? {
              description: "",
              url: `https://github.com/${OWNER}/${cp.repo}`,
              homepage: null,
              language: null,
              stars: 0,
              pushedAt: null,
            };

          const description =
            facts.description.trim() || cp.descOverride || "";

          return {
            name: cp.repo,
            description,
            url: facts.url,
            homepage: facts.homepage,
            language: facts.language,
            stars: facts.stars,
            pushedAt: facts.pushedAt,
            mark: cp.mark,
            status: cp.status,
            tech: cp.tech,
          };
        }),
      );

      return { id: group.id, label: group.label, projects };
    }),
  );

  return {
    updatedAt: new Date().toISOString(),
    groups,
    links: curation.links,
  };
}
