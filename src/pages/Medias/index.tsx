import { lazy } from 'react';

import VideoAdd from './Videos/Add/VideoAdd';
import VideoEdit from './Videos/Edit/VideoEdit';

import PhotoAdd from './Photos/Add/PhotoAdd';
import PhotoEdit from './Photos/Edit/PhotoEdit';

import DocumentAdd from './Documents/Add/DocumentAdd';
import DocumentEdit from './Documents/Edit/DocumentEdit';

import MediaLinkView from './MediaLinks/MediaLinkView';

const PhotoDetails = lazy(() => import('./Details/PhotoDetails'));
const VideoDetails = lazy(() => import('./Details/VideoDetails'));
const DocDetails = lazy(() => import('./Details/DocDetails'));

const MediasVisibility = lazy(() => import('./Visibility/MediasVisibility'));
const MediasVisibilityNew = lazy(
  () => import('./Visibility/MediaVisibilityNew')
);

export {
  VideoAdd,
  VideoEdit,
  PhotoAdd,
  PhotoEdit,
  DocumentAdd,
  DocumentEdit,
  PhotoDetails,
  VideoDetails,
  DocDetails,
  MediaLinkView,
  MediasVisibility,
  MediasVisibilityNew,
};
