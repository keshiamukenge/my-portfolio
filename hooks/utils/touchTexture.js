import * as THREE from 'three'

const easeOutSine = (t, b, c, d) => {
  return c * Math.sin((t / d) * (Math.PI / 2)) + b
}

const easeOutQuad = (t, b, c, d) => {
  t /= d
  return -c * t * (t - 2) + b
}

const wavesOptions = {
  points: [],
  width: window.innerWidth,
  height: window.innerHeight,
  last: null,
}

let canvas = null
let ctx = null
let waterTexture = null

export function initTexture() {
  canvas = document.createElement('canvas')
  // canvas.id = "WaterTexture";
  // document.body.append(canvas);
  canvas.width = wavesOptions.width
  canvas.height = wavesOptions.height
  ctx = canvas.getContext('2d')
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  waterTexture = new THREE.Texture(canvas)
  canvas.id = 'touchTexture'

  return waterTexture
}

function clear() {
  ctx.fillStyle = 'black'
  ctx?.fillRect(0, 0, canvas.width, canvas.height)
}

export function addPoint({ point }) {
  let force = 0
  let vx = 0
  let vy = 0

  const last = wavesOptions.last

  if (last) {
    const relativeX = point.x - last.x
    const relativeY = point.y - last.y
    // Distance formula
    const distanceSquared = relativeX * relativeX + relativeY * relativeY
    const distance = Math.sqrt(distanceSquared)
    // Calculate Unit Vector
    vx = relativeX / distance
    vy = relativeY / distance

    force = Math.min(distanceSquared * 10000, 1)
  }

  wavesOptions.last = {
    x: point.x,
    y: point.y,
  }

  wavesOptions.points = [
    ...wavesOptions.points,
    {
      x: point.x,
      y: point.y,
      age: 0,
      force,
      vx,
      vy,
    },
  ]
}

export function updatePoints({ maxAge, radius }) {
  clear()
  const speed = (1 / maxAge) * 0.3
  wavesOptions.points.forEach((point, i) => {
    const slowAsOlder = 1 - point.age / maxAge
    const force = point.force * speed * slowAsOlder
    point.x += point.vx * force
    point.y += point.vy * force
    point.age += 1

    if (point.age > maxAge) {
      wavesOptions.points.splice(i, 1)
    }
  })

  wavesOptions.points.forEach((point) => {
    drawPoint({ point, radius, maxAge })
  })

  waterTexture.needsUpdate = true
}

function drawPoint({ point, radius, maxAge }) {
  // Convert normalized position into canvas coordinates
  const position = {
    x: point.x * wavesOptions.width,
    y: point.y * wavesOptions.height,
  }

  let intensity = 1

  if (point.age < maxAge * 0.3) {
    intensity = easeOutSine(point.age / maxAge, 0, 1, 1)
  } else {
    intensity = easeOutQuad(
      1 - (point.age - maxAge * 0.3) / (maxAge * 0.7),
      0,
      1,
      1
    )
  }
  intensity *= point.force

  const red = ((point.vx + 1) / 2) * 255
  const green = ((point.vy + 1) / 2) * 255
  // B = Unit vector
  const blue = intensity * 255
  const color = `${red}, ${green}, ${blue}`

  const offset = wavesOptions.width * 1
  // 1. Give the shadow a high offset.
  ctx.shadowOffsetX = offset
  ctx.shadowOffsetY = offset
  ctx.shadowBlur = radius * 1
  ctx.shadowColor = `rgba(${color},${0.2 * intensity})`

  ctx.beginPath()
  ctx.fillStyle = 'rgba(255,0,0,1)'
  // 2. Move the circle to the other direction of the offset
  ctx.arc(position.x - offset, position.y - offset, radius, 0, Math.PI * 2)
  ctx.fill()
}

export default { initTexture, addPoint, updatePoints }
