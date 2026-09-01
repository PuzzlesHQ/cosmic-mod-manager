WITH ProjectFiles AS (
    SELECT
        v."projectId",
        f.size
    FROM "VersionFile" vf
    JOIN "Version" v ON v.id = vf."versionId"
    JOIN "File" f ON f.id = vf."fileId"

    UNION ALL

    SELECT
        g."projectId",
        f.size
    FROM "GalleryItem" g
    JOIN "File" f ON f.id = g."imageFileId"

    UNION ALL

    SELECT
        g."projectId",
        f.size
    FROM "GalleryItem" g
    JOIN "File" f ON f.id = g."thumbnailFileId"
)
SELECT
    p.id,
    p.name,
    p.slug,
    SUM(pf.size) AS total_size
FROM ProjectFiles pf
JOIN "Project" p ON p.id = pf."projectId"
GROUP BY
    p.id,
    p.name,
    p.slug
ORDER BY
    total_size DESC
LIMIT 5;