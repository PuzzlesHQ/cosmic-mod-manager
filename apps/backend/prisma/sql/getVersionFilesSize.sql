SELECT SUM(f.size)
    FROM "VersionFile" vf
LEFT JOIN "File" f
    ON f.id = vf."fileId";