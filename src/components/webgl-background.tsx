"use client"

import { useEffect, useRef, useState } from "react"

const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`

const fragmentShaderSource = `
  precision mediump float;
  
  uniform float u_time;
  uniform vec2 u_resolution;
  
  // Color palette
  vec3 color1 = vec3(0.2, 0.4, 0.8); // Blue
  vec3 color2 = vec3(0.0, 0.8, 0.8); // Turquoise
  vec3 color3 = vec3(0.8, 0.2, 0.6); // Pink
  vec3 color4 = vec3(1.0, 0.6, 0.4); // Peach
  
  // Noise function
  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // Smooth noise
  float smoothNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  // Fractal noise
  float fractalNoise(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    
    for (int i = 0; i < 4; i++) {
      value += amplitude * smoothNoise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    
    return value;
  }
  
  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // Create flowing distortions
    float time = u_time * 0.5;
    
    vec2 distortion1 = vec2(
      sin(st.y * 3.0 + time) * 0.1,
      cos(st.x * 2.0 + time * 0.8) * 0.1
    );
    
    vec2 distortion2 = vec2(
      cos(st.y * 4.0 + time * 1.2) * 0.08,
      sin(st.x * 3.0 + time * 0.6) * 0.08
    );
    
    vec2 pos1 = st + distortion1;
    vec2 pos2 = st + distortion2;
    
    // Generate noise patterns
    float noise1 = fractalNoise(pos1 * 3.0 + time * 0.2);
    float noise2 = fractalNoise(pos2 * 2.0 + time * 0.3);
    float noise3 = fractalNoise(st * 4.0 + time * 0.1);
    
    // Create color mixing weights
    float weight1 = sin(noise1 * 6.28 + time) * 0.5 + 0.5;
    float weight2 = cos(noise2 * 6.28 + time * 1.3) * 0.5 + 0.5;
    float weight3 = sin(noise3 * 6.28 + time * 0.7) * 0.5 + 0.5;
    float weight4 = cos((noise1 + noise2) * 3.14 + time * 1.1) * 0.5 + 0.5;
    
    // Normalize weights
    float totalWeight = weight1 + weight2 + weight3 + weight4;
    weight1 /= totalWeight;
    weight2 /= totalWeight;
    weight3 /= totalWeight;
    weight4 /= totalWeight;
    
    // Mix colors
    vec3 finalColor = color1 * weight1 + color2 * weight2 + color3 * weight3 + color4 * weight4;
    
    // Add subtle noise for organic feel
    float pixelNoise = (noise(gl_FragCoord.xy * 0.1) - 0.5) * 0.02;
    finalColor += pixelNoise;
    
    // Apply overlay blending effect
    vec3 overlayColor = vec3(0.1, 0.2, 0.4);
    finalColor = mix(finalColor, overlayColor, 0.1);
    
    // Apply burn effect for depth
    finalColor = pow(finalColor, vec3(1.2));
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compilation error:", gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program linking error:", gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }

  return program
}

export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const animationRef = useRef<number>(0)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const positionBufferRef = useRef<WebGLBuffer | null>(null)
  const positionLocationRef = useRef<number>(0)
  const timeLocationRef = useRef<WebGLUniformLocation | null>(null)
  const resolutionLocationRef = useRef<WebGLUniformLocation | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Lazy load WebGL context
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (!gl) {
      console.warn("WebGL not supported, falling back to CSS background")
      return
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) return

    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) return

    // Set up geometry (full screen quad)
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, "a_position")
    const timeLocation = gl.getUniformLocation(program, "u_time")
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution")

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    function render(time: number) {
      const canvas = canvasRef.current
      const gl = glRef.current
      const program = programRef.current
      const positionBuffer = positionBufferRef.current
      const positionLocation = positionLocationRef.current
      const timeLocation = timeLocationRef.current
      const resolutionLocation = resolutionLocationRef.current

      if (!canvas || !gl || !program || !positionBuffer || !timeLocation || !resolutionLocation) return

      gl.useProgram(program)

      // Set uniforms
      gl.uniform1f(timeLocation, time * 0.001)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)

      // Set up attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, 6)

      animationRef.current = requestAnimationFrame(render)
    }

    resize()
    window.addEventListener("resize", resize)

    glRef.current = gl
    programRef.current = program
    positionBufferRef.current = positionBuffer
    positionLocationRef.current = positionLocation
    timeLocationRef.current = timeLocation
    resolutionLocationRef.current = resolutionLocation

    setIsLoaded(true)
    animationRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener("resize", resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0"
        style={{ display: isLoaded ? "block" : "none" }}
      />
      {/* Fallback background */}
      {!isLoaded && (
        <div className="fixed inset-0 w-full h-full z-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900" />
      )}
    </>
  )
}
