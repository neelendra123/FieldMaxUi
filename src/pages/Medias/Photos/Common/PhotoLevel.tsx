import { createRef, useEffect } from 'react';

import { useDeviceOrientation } from '../../../../utils/hooks';

export default function PhotoLevel() {
  const levelCanvasRef = createRef<any>();

  const { orientation, requestAccess, revokeAccess, error } =
    useDeviceOrientation();

  useEffect(() => {
    photoCameraLevelEffect();
  }, [orientation]);

  useEffect(() => {
    if (!error) {
      return;
    }

    console.error(error);
  }, [error]);

  useEffect(() => {
    requestAccess();

    return () => {
      revokeAccess();
    };
  }, []);

  //https://trekhleb.dev/blog/2021/gyro-web/
  //https://github.com/trekhleb/trekhleb.github.io/blob/master/src/posts/2021/gyro-web/components/OrientationInfo.tsx
  const photoCameraLevelEffect = function () {
    let bettaAngle = orientation?.beta || 90;
    let gammaAngle = orientation?.gamma || 0;

    const canvas = levelCanvasRef.current;

    //@ts-ignore
    const gctx = canvas.getContext('2d');

    if (bettaAngle > 179) {
      bettaAngle = 179;
    } else if (bettaAngle < 0) {
      bettaAngle = 0;
    }

    if (bettaAngle < 90) {
      bettaAngle = 179 - bettaAngle;
    } else if (bettaAngle > 90) {
      bettaAngle = 90 - (bettaAngle - 90);
    }

    const { width, height } = canvas.getBoundingClientRect();

    gctx.clearRect(0, 0, width, height);

    gctx.setTransform(1, 0, 0, 1, 0, 0);

    //  Rectangle Mover Down and Top
    gctx.beginPath();
    gctx.transform(1, 0, 0, 1, 0, 0);
    gctx.lineWidth = 2;
    gctx.strokeStyle = 'white'; //'#00ff00';
    gctx.rect(37, bettaAngle / 2, 25, 10);
    gctx.stroke();

    //  Static Line at center
    gctx.beginPath();
    gctx.strokeStyle = 'white';
    gctx.moveTo(0, height / 2);
    gctx.lineTo(width, height / 2);
    gctx.stroke();

    //  Gamma Angle (Left Right Tilting and showing Angle)
    //  Starting from center of square, then calculate ping for two sides
    if (gammaAngle > 90) {
      gammaAngle = 90;
    }
    if (gammaAngle < -90) {
      gammaAngle = -90;
    }

    const length = width / 2;

    const x1 = height / 2 + Math.cos((Math.PI * gammaAngle) / 180) * length;
    const y1 = width / 2 + Math.sin((Math.PI * gammaAngle) / 180) * length;

    const x2 = height / 2 - Math.cos((Math.PI * gammaAngle) / 180) * length;
    const y2 = width / 2 - Math.sin((Math.PI * gammaAngle) / 180) * length;

    gctx.beginPath();
    gctx.strokeStyle = 'green';
    gctx.moveTo(x1, y1);
    gctx.lineTo(x2, y2);
    gctx.stroke();
  };

  return (
    <canvas
      id="levelCanvasRef"
      ref={levelCanvasRef}
      width="100"
      height="100"
      className="center levelCanvas"
    />
  );
}
