/**
 * @typedef PlayerProps
 * @type {object}
 * @property {Blob} srcBlob
 *
 * @param {PlayerProps}
 */
export function VideoPlayer({
  title = '',
  className,
  srcBlob,
  width = 520,
  height = 480,
  style = {},
}: {
  title?: string;
  className: string;
  srcBlob: Blob | null;
  width?: number;
  height?: number;
  style?: any;
}) {
  if (!srcBlob) {
    return null;
  }

  return (
    <video
      className={className}
      //@ts-ignore
      src={srcBlob}
      // width={width}
      // height={height}
      controls
      title={title}
    />
  );
}
