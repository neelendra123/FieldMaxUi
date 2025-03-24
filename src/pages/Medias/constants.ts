export const MediaApiRoutes = {
  mediaDetails: 'medias/:mediaId',

  jobMediaPreSignedURLs: `jobs/:jobId/preSignedURLs`,
  jobMedias: `jobs/:jobId/medias`,
  jobMediasAll: `jobs/:jobId/medias/listAll`,

  mediaInfoEdit: 'medias/:mediaKind/:subMediaId/info',
  mediaPermEdit: 'medias/:mediaKind/:subMediaId/perms',

  jobMediaDetails: 'jobs/:jobId/medias/:mediaId',
};

export const Messages = {
  videoCreated: 'Video created successfully',
  videosCreated: 'Videos created successfully',
  videoEdited: 'Video edited successfully',

  docCreated: 'Document created successfully',
  docsCreated: 'Documents created successfully',
  docEdited: 'Document edited successfully',

  photoCreated: 'Photo created successfully',
  photosCreated: 'Photos created successfully',
  photoEdited: 'Photo edited successfully',
};
