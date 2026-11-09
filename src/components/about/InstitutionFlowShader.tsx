"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const VS_SOURCE = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`;

/**
 * Restrained AshviTech flowing lines — teal on transparent.
 * Tuned for ~10 fine lines, low amplitude, muted brightness.
 */
const FS_SOURCE = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;

  const float overallSpeed = 0.085;
  const float gridSmoothWidth = 0.012;
  const float scale = 4.2;
  const vec3 lineRgb = vec3(0.0, 0.804, 0.722);      // #00CDB8
  const vec3 accentRgb = vec3(0.16, 0.52, 0.74);      // muted cyan-blue (Ashvi Blue family, lifted for navy)
  const float minLineWidth = 0.006;
  const float maxLineWidth = 0.038;
  const float lineSpeed = 0.45 * overallSpeed;
  const float lineAmplitude = 0.32;
  const float lineFrequency = 0.18;
  const float warpSpeed = 0.1 * overallSpeed;
  const float warpFrequency = 0.42;
  const float warpAmplitude = 0.28;
  const float offsetFrequency = 0.42;
  const float offsetSpeed = 0.55 * overallSpeed;
  const float minOffsetSpread = 0.35;
  const float maxOffsetSpread = 1.1;
  const int linesPerGroup = 7;
  const int primaryLines = 3;
  const float lineAlpha = 0.32;
  // Vertical centre of the line field (uv.y, 0 = bottom): between the connector and the panels' lower half.
  const float bandCentre = 0.5;

  #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
  #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
  #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))

  float random(float t) {
    return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
  }

  float getPlasmaY(float x, float horizontalFade, float offset) {
    return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
  }

  void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 space = (fragCoord - vec2(0.5, bandCentre) * iResolution.xy) / iResolution.x * 2.0 * scale;

    // Soft horizontal focus — stronger between panels (centre)
    float centreFocus = 1.0 - smoothstep(0.18, 0.72, abs(uv.x - 0.5) * 2.0);
    // Flatter than a pure centre focus: the opaque panels cover the middle,
    // so the side margins and the gap carry most of the visible flow.
    float horizontalFade = mix(0.6, 1.0, centreFocus);

    // uv.y = 0 is the bottom. Clear above the panels (headline/subtitle) and
    // fade out smoothly before the explanation paragraphs.
    float topMask = 1.0 - smoothstep(0.6, 0.7, uv.y);
    float bottomMask = smoothstep(0.33, 0.46, uv.y);
    float verticalFade = topMask * bottomMask;

    space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.35 + horizontalFade * 0.5);
    space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * 0.45 * horizontalFade;

    vec3 lines = vec3(0.0);
    float alpha = 0.0;

    for (int l = 0; l < linesPerGroup; l++) {
      float normalizedLineIndex = float(l) / float(linesPerGroup);
      float offsetTime = iTime * offsetSpeed;
      float offsetPosition = float(l) + space.x * offsetFrequency;
      float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
      bool isPrimary = l < primaryLines;
      float weight = isPrimary ? 1.0 : 0.45;
      float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0
        * (isPrimary ? 1.0 : 0.6);
      float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex))
        * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
      float linePosition = getPlasmaY(space.x, horizontalFade, offset);
      float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0
        + drawCrispLine(linePosition, halfWidth * 0.18, space.y);

      // Tiny travelling node — kept very soft
      float circleX = mod(float(l) + iTime * lineSpeed * 0.8, 22.0) - 11.0;
      vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
      float circle = drawCircle(circlePosition, 0.006, space) * 0.9;

      float intensity = (line + circle) * rand * weight * lineAlpha * verticalFade * (0.8 + centreFocus * 0.2);
      float hueMix = fract(float(l) * 0.618);
      vec3 tint = mix(accentRgb, lineRgb, 0.35 + hueMix * 0.65);
      lines += tint * intensity;
      alpha += intensity;
    }

    // Premultiplied output (blending is off): rgb must not exceed alpha.
    float outAlpha = min(alpha, 0.5);
    float scaleDown = alpha > 0.0 ? outAlpha / alpha : 0.0;
    gl_FragColor = vec4(lines * scaleDown, outAlpha);
  }
`;

const MAX_DPR = 1.5;
const MAX_DIMENSION = 1600;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("[InstitutionFlowShader] compile:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("[InstitutionFlowShader] link:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

type InstitutionFlowShaderProps = {
  className?: string;
};

/**
 * Experimental WebGL flowing-line field for the Institution section.
 * Transparent canvas; pauses offscreen; falls back to null when reduced-motion
 * or when WebGL is unavailable (static SVG connectors remain).
 */
export function InstitutionFlowShader({ className }: InstitutionFlowShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setEnabled(false);
      return;
    }
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    if (narrow) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
  }, [reduceMotion]);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const program = createProgram(gl);
    if (!program) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const aPosition = gl.getAttribLocation(program, "aVertexPosition");
    const uResolution = gl.getUniformLocation(program, "iResolution");
    const uTime = gl.getUniformLocation(program, "iTime");

    gl.disable(gl.BLEND);
    gl.clearColor(0, 0, 0, 0);

    let raf = 0;
    let running = false;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const cssW = Math.max(1, Math.floor(rect.width));
      const cssH = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      let w = Math.floor(cssW * dpr);
      let h = Math.floor(cssH * dpr);
      const longest = Math.max(w, h);
      if (longest > MAX_DIMENSION) {
        const scale = MAX_DIMENSION / longest;
        w = Math.floor(w * scale);
        h = Math.floor(h * scale);
      }
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const draw = (now: number) => {
      if (!running || !visible) return;
      const t = (now - start) / 1000;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };

    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (visible) startLoop();
        else stopLoop();
      },
      { rootMargin: "80px 0px", threshold: 0.01 },
    );
    io.observe(container);

    startLoop();

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={
        className ??
        "pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      }
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
