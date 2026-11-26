import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface PlaqueOptions {
  text: string;
  subtext?: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  subColor?: string;
  width?: number;
  height?: number;
  fontSize?: number;
}

export function usePlaqueTexture({
  text,
  subtext,
  bgColor = '#1a1e29',
  borderColor = '#8b7cf6',
  textColor = '#e8ecf5',
  subColor = '#9aa5c4',
  width = 512,
  height = 256,
  fontSize = 110,
}: PlaqueOptions): THREE.CanvasTexture {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Subtle inner gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, 'rgba(255,255,255,0.05)');
      grad.addColorStop(1, 'rgba(0,0,0,0.2)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Border frame
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 10;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      // Corner spy ticks
      ctx.fillStyle = borderColor;
      const tick = 22;
      ctx.fillRect(10, 10, tick, 6);
      ctx.fillRect(10, 10, 6, tick);
      ctx.fillRect(width - 10 - tick, height - 16, tick, 6);
      ctx.fillRect(width - 16, height - 10 - tick, 6, tick);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (subtext) {
        ctx.fillStyle = textColor;
        ctx.font = `800 ${fontSize}px "Segoe UI", system-ui, sans-serif`;
        ctx.fillText(text, width / 2, height * 0.44);

        ctx.fillStyle = subColor;
        ctx.font = `600 ${Math.round(fontSize * 0.34)}px "Segoe UI", system-ui, sans-serif`;
        ctx.fillText(subtext, width / 2, height * 0.77);
      } else {
        ctx.fillStyle = textColor;
        ctx.font = `800 ${fontSize}px "Segoe UI", system-ui, sans-serif`;
        ctx.fillText(text, width / 2, height / 2);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [text, subtext, bgColor, borderColor, textColor, subColor, width, height, fontSize]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return texture;
}
