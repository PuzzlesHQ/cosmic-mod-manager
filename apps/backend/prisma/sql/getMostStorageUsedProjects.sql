WITH ProjectFileSizes AS (
    SELECT
        v."projectId",
        SUM(f.size) AS size
    FROM "VersionFile" vf
    JOIN "Version" v ON v.id = vf."versionId"
    JOIN "File" f ON f.id = vf."fileId"
    GROUP BY v."projectId"

    UNION ALL

    SELECT
        g."projectId",
        SUM(f.size) AS size
    FROM "GalleryItem" g
    JOIN "File" f ON f.id = g."imageFileId"
    GROUP BY g."projectId"

    UNION ALL

    SELECT
        g."projectId",
        SUM(f.size) AS size
    FROM "GalleryItem" g
    JOIN "File" f ON f.id = g."thumbnailFileId"
    GROUP BY g."projectId"
)
SELECT
    p.id,
    p.name,
    p.slug,
    SUM(pfs.size) AS total_size
FROM ProjectFileSizes pfs
JOIN "Project" p ON p.id = pfs."projectId"
GROUP BY p.id, p.name, p.slug
ORDER BY total_size DESC
LIMIT 5;