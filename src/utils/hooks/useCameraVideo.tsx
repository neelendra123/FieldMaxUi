import { useEffect, useState, useRef } from 'react';

import { IOption } from '../../interfaces';

import { isObject } from '../common';

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
 * @property {MediaStreamConstraints} mediaStreamConstraints
 *
 * @typedef MediaRecorderHookOptions
 * @type {object}
 * @property {Error} error
 * @property {string} status
 * @property {Blob} mediaBlob
 * @property {boolean} isAudioMuted
 * @property {function} stopRecording,
 * @property {function} getMediaStream,
 * @property {function} clearMediaStream,
 * @property {function} startRecording,
 * @property {function} pauseRecording,
 * @property {function} resumeRecording,
 * @property {function} muteAudio
 * @property {function} unMuteAudio
 * @property {MediaStream} liveStream
 * @property {MediaDeviceInfo[]} mediaDevices
 * @property {IOption[]} videoDevices
 *
 * @param {MediaRecorderProps}
 * @returns {MediaRecorderHookOptions}
 */
export default function useCameraVideo({
  blobOptions,
  //   recordScreen,
  onStop = common.noop,
  onStart = common.noop,
  onError = common.noop,
  onDataAvailable = common.noop,
  mediaRecorderOptions,
  mediaStreamConstraints = {
    audio: true,
    video: {
      facingMode: 'environment',
      // facingMode: {
      //   exact: 'environment',
      // },
    },
  },
}: {
  blobOptions?: BlobPropertyBag;
  onStop?: (data: any) => void;
  onStart?: () => void;
  onError?: (data: any) => void;
  onDataAvailable?: (data: any) => void;

  mediaRecorderOptions?: {
    mimeType: string;
  };
  mediaStreamConstraints?: MediaStreamConstraints;
}) {
  let mediaChunks = useRef<any>([]);
  let mediaStream = useRef<any>(null);
  let mediaRecorder = useRef<any>(null);

  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<IOption[]>([]);

  let [error, setError] = useState<any>(null);
  let [status, setStatus] = useState('idle');
  let [mediaBlob, setMediaBlob] = useState<any>(null);
  let [isAudioMuted, setIsAudioMuted] = useState(false);

  async function getMediaStream() {
    if (error) {
      setError(null);
    }

    setStatus('acquiring_media');

    try {
      const [stream, audioStream, devices] = await Promise.all([
        window.navigator.mediaDevices.getUserMedia(mediaStreamConstraints),
        window.navigator.mediaDevices.getUserMedia({
          audio: mediaStreamConstraints.audio,
        }),
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

      audioStream
        .getAudioTracks()
        .forEach((audioTrack) => stream.addTrack(audioTrack));

      mediaStream.current = stream;
      setStatus('ready');

      setMediaDevices(devices);
      setVideoDevices(videoMediaDevices);

      // let stream: any;

      // //   if (recordScreen) {
      // //     stream = await window.navigator.mediaDevices.getDisplayMedia(
      // //       mediaStreamConstraints
      // //     );
      // //   } else {
      // stream = await window.navigator.mediaDevices.getUserMedia(
      //   mediaStreamConstraints
      // );
      // //   }

      // //   if (recordScreen && mediaStreamConstraints.audio) {
      // let audioStream = await window.navigator.mediaDevices.getUserMedia({
      //   audio: mediaStreamConstraints.audio,
      // });

      // audioStream
      //   .getAudioTracks()
      //   .forEach((audioTrack) => stream.addTrack(audioTrack));
      // //   }

      // mediaStream.current = stream;
      // setStatus('ready');
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

  async function startRecording() {
    if (error) {
      setError(null);
    }

    if (!mediaStream.current) {
      await getMediaStream();
    }

    mediaChunks.current = [];

    if (mediaStream.current) {
      mediaRecorder.current = new MediaRecorder(
        mediaStream.current,
        mediaRecorderOptions
      );
      mediaRecorder.current.addEventListener(
        'dataavailable',
        handleDataAvailable
      );
      mediaRecorder.current.addEventListener('stop', handleStop);
      mediaRecorder.current.addEventListener('error', handleError);
      mediaRecorder.current.start();
      setStatus('recording');
      onStart();
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

  function muteAudio(mute: any) {
    setIsAudioMuted(mute);

    if (mediaStream.current) {
      mediaStream.current.getAudioTracks().forEach((audioTrack: any) => {
        audioTrack.enabled = !mute;
      });
    }
  }

  function pauseRecording() {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      setStatus('paused');
      mediaRecorder.current.pause();
    }
  }

  function resumeRecording() {
    if (mediaRecorder.current && mediaRecorder.current.state === 'paused') {
      mediaRecorder.current.resume();
      setStatus('recording');
    }
  }

  function stopRecording() {
    if (mediaRecorder.current) {
      setStatus('stopping');
      mediaRecorder.current.stop();
      // not sure whether to place clean up in useEffect?
      // If placed in useEffect the handler functions become dependencies of useEffect
      mediaRecorder.current.removeEventListener(
        'dataavailable',
        handleDataAvailable
      );
      mediaRecorder.current.removeEventListener('stop', handleStop);
      mediaRecorder.current.removeEventListener('error', handleError);
      mediaRecorder.current = null;
      clearMediaStream();
    }
  }

  useEffect(() => {
    if (!window.MediaRecorder) {
      // throw new ReferenceError(
      //   'MediaRecorder is not supported in this browser. Please ensure that you are running the latest version of chrome/firefox/edge.'
      // );
      setError(
        // new Error('MediaRecorder is not supported in this browser. Please ensure that you are running the latest version of browser')
        'MediaRecorder is not supported in this browser. Please ensure that you are running the latest version of browser'
      );
      return;
    }

    // if (recordScreen && !window.navigator.mediaDevices.getDisplayMedia) {
    //   throw new ReferenceError(
    //     'This browser does not support screen capturing'
    //   );
    // }

    if (isObject(mediaStreamConstraints.video)) {
      //@ts-ignore
      common.validateMediaTrackConstraints(mediaStreamConstraints.video);
    }

    if (isObject(mediaStreamConstraints.audio)) {
      //@ts-ignore
      common.validateMediaTrackConstraints(mediaStreamConstraints.audio);
    }

    if (mediaRecorderOptions && mediaRecorderOptions.mimeType) {
      if (!MediaRecorder.isTypeSupported(mediaRecorderOptions.mimeType)) {
        console.error(
          `The specified MIME type supplied to MediaRecorder is not supported by this browser.`
        );
      }
    }
  }, [mediaStreamConstraints, mediaRecorderOptions]);
  //   }, [mediaStreamConstraints, mediaRecorderOptions, recordScreen]);

  return {
    error,
    status,
    mediaBlob,
    isAudioMuted,
    stopRecording,
    getMediaStream,
    startRecording,
    pauseRecording,
    resumeRecording,
    clearMediaStream,
    muteAudio: () => muteAudio(true),
    unMuteAudio: () => muteAudio(false),
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
