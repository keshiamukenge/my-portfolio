import * as THREE from 'three'

const easeOutSine = (t, b, c, d) => {
  return c * Math.sin((t / d) * (Math.PI / 2)) + b;
};

const easeOutQuad = (t, b, c, d) => {
  t /= d;
  return -c * t * (t - 2) + b;
};

const size = window.innerWidth

const wavesOptions = {
	size,
	radius: size * 0.03,
	points: [],
	maxAge: 50,
	width: size,
	height: size,
	last: null,
	texture: null,
}

export function initTexture({ width, height }) {
	const canvas = document.createElement("canvas");
	canvas.id = "WaterTexture";
	document.body.append(canvas);
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	clear({ ctx, canvas });

	wavesOptions.texture = new THREE.Texture(canvas);
}

export function clear({ ctx, canvas }) {
	ctx.fillStyle = "black";
	ctx?.fillRect(0, 0, canvas.width, canvas.height);
}

export function addPoint({ point }) {
	let force = 0;
	let vx = 0;
  let vy = 0;

  const last = wavesOptions.last;

  if (last) {
    const relativeX = point.x - last.x;
    const relativeY = point.y - last.y;
    // Distance formula
    const distanceSquared = relativeX * relativeX + relativeY * relativeY;
    const distance = Math.sqrt(distanceSquared);
    // Calculate Unit Vector
    vx = relativeX / distance;
    vy = relativeY / distance;

    force = Math.min(distanceSquared * 10000, 1);
  }

  wavesOptions.last = {
    x: point.x,
    y: point.y
  };

  wavesOptions.points = [
		...wavesOptions.points,
		{
			x: point.x,
			y: point.y,
			age: 0,
			force,
			vx,
			vy,
		}
	];
}

export function updatePoints() {
	clear({ ctx: document.querySelector('canvas#WaterTexture').getContext("2d"), canvas: document.querySelector('canvas#WaterTexture') });
  const agePart = 1 / wavesOptions.maxAge;
  wavesOptions.points.forEach((point, i) => {
    const slowAsOlder = 1 - point.age / wavesOptions.maxAge;
    const force = point.force * agePart * slowAsOlder;
    point.x += point.vx * force;
    point.y += point.vy * force;
    point.age += 1;

    if (point.age > wavesOptions.maxAge) {
      wavesOptions.points.splice(i, 1);
    }
  });
  
	wavesOptions.points.forEach(point => {
    drawPoint(point);
  });

	wavesOptions.texture.needsUpdate = true;
}

export function drawPoint(point) {
	// Convert normalized position into canvas coordinates
	const position = {
		x: point.x * wavesOptions.width,
		y: point.y * wavesOptions.height
	};
	const radius = wavesOptions.radius;
	const ctx = document.querySelector('canvas#WaterTexture').getContext("2d")

	let intensity = 1;
	if (point.age < wavesOptions.maxAge * 0.3) {
		intensity = easeOutSine(point.age / (wavesOptions.maxAge * 0.3), 0, 1, 1);
	} else {
		intensity = easeOutQuad(
			1 - (point.age - wavesOptions.maxAge * 0.3) / (wavesOptions.maxAge * 0.7),
			0,
			1,
			1
		);
	}
	intensity *= point.force;

	const red = ((point.vx + 1) / 2) * 255;
	const green = ((point.vy + 1) / 2) * 255;
	// B = Unit vector
	const blue = intensity * 255;
	const color = `${red}, ${green}, ${blue}`;

	const offset = wavesOptions.width * 5;
	// 1. Give the shadow a high offset.
	ctx.shadowOffsetX = offset;
	ctx.shadowOffsetY = offset;
	ctx.shadowBlur = radius * 1;
	ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;

	ctx.beginPath();
	ctx.fillStyle = "rgba(255,0,0,1)";
	// 2. Move the circle to the other direction of the offset
	ctx.arc(position.x - offset, position.y - offset, radius, 0, Math.PI * 2);
	ctx.fill();



	// const position = {
	// 	x: point.x * wavesOptions.width,
	// 	y: point.y * wavesOptions.height
	// };
	// const radius = wavesOptions.radius;
	// const ctx = document.querySelector('canvas#WaterTexture').getContext("2d")

	// let intensity = 1;
	// if (point.age < wavesOptions.maxAge * 0.3) {
	// 	intensity = easeOutSine(point.age / (wavesOptions.maxAge * 0.3), 0, 1, 1);
	// } else {
	// 	intensity = easeOutQuad(
	// 		1 - (point.age - wavesOptions.maxAge * 0.3) / (wavesOptions.maxAge * 0.7),
	// 		0,
	// 		1,
	// 		1
	// 	);
	// }
	// intensity *= point.force;

	// const color = "255,255,255";

	// const offset = wavesOptions.width * 5;
	// // 1. Give the shadow a high offset.
	// ctx.shadowOffsetX = offset;
	// ctx.shadowOffsetY = offset;
	// ctx.shadowBlur = radius * 1;
	// ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;

	// ctx.beginPath();
	// ctx.fillStyle = "rgba(255,0,0,1)";
	// // 2. Move the circle to the other direction of the offset
	// ctx.arc(position.x - offset, position.y - offset, radius, 0, Math.PI * 2);
	// ctx.fill();
}

export default { initTexture, clear, addPoint, updatePoints, drawPoint };