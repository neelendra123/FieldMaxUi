import { useEffect, useState, useRef } from 'react';

import { IOption } from '../../interfaces';

import * as common from './common';

/**
 *
 * @callback Callback
 * @param {Blob} blob
 *
 * @callback ErrorCallback
 * @param {Error} error
 *
 * @typedef MediaRecorderProps
 * @type {object}
 * @property {BlobPropertyBag} blobOptions
 * @property {boolean} recordScreen
 * @property {function} onStart
 * @property {Callback} onStop
 * @property {Callback} onDataAvailable
 * @property {ErrorCallback} onError
 * @property {object} mediaRecorderOptions
 * @property {MediaStreamConstraints} mediaConstraints
 *
 * @typedef MediaRecorderHookOptions
 * @type {object}
 * @property {Error} error
 * @property {string} status
 * @property {Blob} mediaBlob
 * @property {function} getMediaStream,
 * @property {function} clearMediaStream,
 * @property {MediaStream} liveStream
 * @property {MediaDeviceInfo[]} mediaDevices
 * @property {IOption[]} videoDevices
 *
 * @param {MediaRecorderProps}
 * @returns {MediaRecorderHookOptions}
 */
export default function useCameraPhoto({
  blobOptions,

  mediaConstraints = {
    audio: false,
    video: {
      facingMode: 'environment',
      // facingMode: {
      //   exact: 'environment',
      // },
    },
  },

  onStop = common.noop,
  onStart = common.noop,
  onError = common.noop,
  onDataAvailable = common.noop,
}: {
  blobOptions?: BlobPropertyBag;

  mediaConstraints: MediaStreamConstraints;

  onStop?: (data: any) => void;
  onStart?: () => void;
  onError?: (data: any) => void;
  onDataAvailable?: (data: any) => void;
}) {
  let mediaChunks = useRef<any>([]);
  let mediaStream = useRef<any>(null);
  let mediaRecorder = useRef<any>(null);

  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<IOption[]>([]);

  let [error, setError] = useState<any>(null);
  let [status, setStatus] = useState('idle');
  let [mediaBlob, setMediaBlob] = useState<any>(null);

  async function getMediaStream() {
    clearMediaStream();
    if (error) {
      setError(null);
    }

    setStatus('acquiring_media');

    try {
      const [stream, devices] = await Promise.all([
        window.navigator.mediaDevices.getUserMedia(mediaConstraints),
        navigator.mediaDevices.enumerateDevices(),
      ]);

      //  Getting Video Devices for Switching Camera
      const videoMediaDevices: IOption[] = [];
      devices.forEach((device, index) => {
        if (device.kind !== 'videoinput') {
          return;
        }

        videoMediaDevices.push({
          label: device.label || `Camera ${index + 1}`,
          value: device.deviceId,
        });
      });

      mediaStream.current = stream;
      setStatus('ready');

      setMediaDevices(devices);
      setVideoDevices(videoMediaDevices);
    } catch (err) {
      setError(err);
      setStatus('failed');
    }
  }

  function clearMediaStream() {
    if (mediaRecorder.current) {
      mediaRecorder.current.removeEventListener(
        'dataavailable',
        handleDataAvailable
      );
      mediaRecorder.current.removeEventListener('stop', handleStop);
      mediaRecorder.current.removeEventListener('error', handleError);
      mediaRecorder.current = null;
    }

    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track: any) => track.stop());
      mediaStream.current = null;
      mediaChunks.current = [];
    }
  }

  function handleDataAvailable(e: any) {
    if (e.data.size) {
      mediaChunks.current.push(e.data);
    }
    onDataAvailable(e.data);
  }

  function handleStop() {
    let [sampleChunk] = mediaChunks.current;
    let blobPropertyBag = Object.assign(
      { type: sampleChunk.type },
      blobOptions
    );
    let blob = new Blob(mediaChunks.current, blobPropertyBag);

    setStatus('stopped');
    setMediaBlob(blob);
    onStop(blob);
  }

  function handleError(e: any) {
    setError(e.error);
    setStatus('idle');
    onError(e.error);
  }

  useEffect(() => {
    if (!window.MediaRecorder) {
      setError(
        'MediaRecorder is not supported in this browser. Please ensure that you are running the latest version of browser'
      );
      return;
    }

    //@ts-ignore
    common.validateMediaTrackConstraints(mediaConstraints.video);
  }, []);

  // useEffect(() => {
  //   getMediaStream();
  // }, [mediaConstraints]);

  return {
    error,
    status,
    mediaBlob,
    getMediaStream,
    clearMediaStream,
    get liveStream() {
      if (mediaStream.current) {
        return new MediaStream(mediaStream.current.getVideoTracks());
      }
      return null;
    },

    mediaDevices,
    videoDevices,
  };
}
