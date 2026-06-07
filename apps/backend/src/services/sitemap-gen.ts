import { projectTypes } from "@app/utils/config/project";
import { GetMany_ProjectsVersions } from "~/db/version_item";
import { MEILISEARCH_PROJECT_INDEX, type ProjectSearchDocument } from "~/routes/search/sync-utils";
import meilisearch from "~/services/meilisearch";
import { getFileFromLocalStorage, saveFileToLocalStorage } from "~/services/storage/local";
import env from "~/utils/env";

const BATCH_SIZE = 1000;
const SITEMAP_REFRESH_INTERVAL_s = 86400; // 24 hours
let queued = false;
let isGenerating = false;

export async function startSitemapGenerator() {
    if (queued) return;
    if (env.NODE_ENV === "development") return;

    queued = true;

    try {
        await generateSitemap();
    } catch (error) {
        console.error("Failed to generate sitemap", error);
    }
    setInterval(generateSitemap, SITEMAP_REFRESH_INTERVAL_s * 1000);
}

let startupTries = 20;
export async function generateSitemap() {
    if (isGenerating) return;
    isGenerating = true;
    try {
        const index = meilisearch.index(MEILISEARCH_PROJECT_INDEX);
        const res = await index.search(null);
        if (res.estimatedTotalHits === 0) {
            startupTries -= 1;
            if (startupTries > 0) {
                console.log("Waiting for projects to be indexed...");
            } else {
                console.error("Failed to generate sitemap, no projects found");
                return;
            }

            return setTimeout(() => {
                generateSitemap();
            }, 2_000);
        }
        startupTries = 10;
        console.log("Starting sitemap generation...");

        // Generate xml for all the project links
        let offset = 0;

        const projectsSitemapEntries: string[] = [];
        while (true) {
            const projects = await getProjects(offset);
            if (projects.length <= 0) break;
            projectsSitemapEntries.push(...(await generateXml(projects)));
            offset += BATCH_SIZE;
        }

        const ITEMS_PER_FILE = 25000;
        const projectSitemapFiles: string[] = [];
        for (let i = 0; i < Math.max(1, projectsSitemapEntries.length / ITEMS_PER_FILE); i++) {
            const items = projectsSitemapEntries.slice(ITEMS_PER_FILE * i, ITEMS_PER_FILE * (i + 1));
            projectSitemapFiles.push(items.join(""));
        }

        // Create the index file
        let indexFile = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${env.FRONTEND_URL}/sitemap-nav.xml</loc>
    </sitemap>`;

        for (let i = 0; i < projectSitemapFiles.length; i++) {
            const fileName = `projects-${i}`;
            await saveSitemap(fileName, xmlUrlSet(projectSitemapFiles[i]));

            indexFile += `
    <sitemap>
        <loc>${env.FRONTEND_URL}/sitemap-${fileName}.xml</loc>
    </sitemap>`;
        }

        indexFile += `
</sitemapindex>`;

        await saveSitemap("index", indexFile);
        await saveSitemap("nav", navigationLinksXml());

        console.log("Sitemap generation complete");
    } finally {
        isGenerating = false;
    }
}

async function generateXml(projects: ProjectSearchDocument[]) {
    const projectsVersions = await GetMany_ProjectsVersions(projects.map((p) => p.id));

    const links: string[] = [];
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const type = project.type[0];

        links.push(`
    <url>
        <loc>${env.FRONTEND_URL}/${type}/${project.slug}</loc>
        <lastmod>${formatDate(project.dateUpdated)}</lastmod>
    </url>`);

        const versionData = projectsVersions.find((p) => p.id === project.id);
        if (!versionData?.id || !versionData.versions.length) continue;

        links.push(`
    <url>
        <loc>${env.FRONTEND_URL}/${type}/${project.slug}/changelog</loc>
        <lastmod>${formatDate(project.dateUpdated)}</lastmod>
    </url>`);

        links.push(`
    <url>
        <loc>${env.FRONTEND_URL}/${type}/${project.slug}/versions</loc>
        <lastmod>${formatDate(project.dateUpdated)}</lastmod>
    </url>`);

        for (let j = 0; j < versionData.versions.length; j++) {
            const version = versionData.versions[j];

            links.push(`
    <url>
        <loc>${env.FRONTEND_URL}/${type}/${project.slug}/version/${version.slug}</loc>
        <lastmod>${formatDate(version.datePublished)}</lastmod>
    </url>`);
        }
    }

    return links;
}

async function getProjects(offset: number): Promise<ProjectSearchDocument[]> {
    const index = meilisearch.index(MEILISEARCH_PROJECT_INDEX);

    const result = await index.search(null, {
        sort: ["downloads:desc"],
        limit: BATCH_SIZE,
        offset: offset,
    });
    return result.hits as ProjectSearchDocument[];
}

function formatDate(_date: Date | string): string {
    const date = new Date(_date);
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}

function xmlUrlSet(links: string) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${links}
</urlset>`;
}

function navigationLinksXml() {
    let links = "";

    links += xmlURL("");
    links += xmlURL("md-editor");

    for (const type of ["project", ...projectTypes]) {
        links += xmlURL(`${type}s`);
    }

    return xmlUrlSet(links);
}

function xmlURL(path: string) {
    return `
    <url>
        <loc>${env.FRONTEND_URL}/${path}</loc>
    </url>
    `;
}

async function saveSitemap(name: string, content: string) {
    try {
        await saveFileToLocalStorage(`sitemap/sitemap-${name}.xml`, content);
    } catch (error) {
        console.error("Failed to save sitemap", error);
    }
}

export async function getSitemap(name: string) {
    try {
        if (name === "sitemap.xml") return await getFileFromLocalStorage("sitemap/sitemap-index.xml");

        return await getFileFromLocalStorage(`sitemap/${name}`);
    } catch (error) {
        console.error("Failed to get sitemap", error);
    }
}
