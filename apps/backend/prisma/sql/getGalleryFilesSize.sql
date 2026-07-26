SELECT SUM(f.size)
    FROM "GalleryItem" g
LEFT JOIN "File" f
    ON f.id = g."imageFileId";