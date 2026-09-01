SELECT SUM(f.size)
    FROM "VersionFile" vf
JOIN "File" f
    ON f.id = vf."fileId";