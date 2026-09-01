SELECT SUM(f.size)
    FROM "GalleryItem" g
JOIN "File" f
    ON f.id = g."imageFileId"
    OR f.id = g."thumbnailFileId";