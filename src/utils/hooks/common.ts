export const noop = () => {};

/**
 * Checks whether constraints are valid
 * @param {MediaStreamConstraints} mediaType
 */
export function validateMediaTrackConstraints(
  mediaType: MediaStreamConstraints
) {
  let supportedMediaConstraints: any = null;

  if (navigator.mediaDevices) {
    supportedMediaConstraints =
      navigator.mediaDevices.getSupportedConstraints();
  }

  if (supportedMediaConstraints === null) {
    return;
  }

  let unSupportedMediaConstraints = Object.keys(mediaType).filter(
    (constraint) => !supportedMediaConstraints[constraint]
  );

  if (unSupportedMediaConstraints.length !== 0) {
    let toText = unSupportedMediaConstraints.join(',');
    console.error(
      `The following constraints ${toText} are not supported on this browser.`
    );
  }
}
