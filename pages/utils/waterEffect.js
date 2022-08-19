const size = window.innerWidth

const wavesOptions = {
	size,
	radius: size * 0.03,
	points: [],
	maxAge: 50,
	width: size,
	height: size,
}

export function initTexture({ width, height }) {
	const canvas = document.createElement("canvas");
	canvas.id = "WaterTexture";
	document.body.append(canvas);
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	clear({ ctx, canvas });
}

export function clear({ ctx, canvas }) {
	ctx.fillStyle = "black";
	ctx?.fillRect(0, 0, canvas.width, canvas.height);
}

export function addPoint({ point }) {
	wavesOptions.points = [
		...wavesOptions.points,
		{
			x: point.x,
			y: point.y,
			age: 0
		}
	];
}

export function updatePoints() {
	clear({ ctx: document.querySelector('canvas#WaterTexture').getContext("2d"), canvas: document.querySelector('canvas#WaterTexture') });
	wavesOptions.points.forEach((point, i) => {
		point.age += 1;
		if (point.age > wavesOptions.maxAge) {
			wavesOptions.points.splice(i, 1);
		}
	});
	wavesOptions.points.forEach(point => {
		drawPoint(point);
	});
}

export function drawPoint(point) {
	// Convert normalized position into canvas coordinates
	const position = {
		x: point.x * wavesOptions.width,
		y: point.y * wavesOptions.height
	};
	const radius = wavesOptions.radius;

	let intensity = 1;
	intensity = 1 - point.age / wavesOptions.maxAge;

	const ctx = document.querySelector('canvas#WaterTexture').getContext("2d")

	const color = "255,255,255";

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
}

export default { initTexture, clear, addPoint, updatePoints, drawPoint };