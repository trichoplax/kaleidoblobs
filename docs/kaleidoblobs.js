$(load)

function load() {
	timeOut = 0
	canvas = document.getElementById('canvas')
	ctx = canvas.getContext('2d')
	fullScreenDiv = document.getElementById('full_screen_div')
	updateResolution()
	
	document.onfullscreenchange = function(event) {
		adjustCanvas()
		restart()
	}
	document.onmozfullscreenchange = document.onfullscreenchange
	document.onwebkitfullscreenchange = document.onfullscreenchange
	
	$('#restart').click(function() { restart() })
	
	$('#x_resolution').change(function() { updateResolution() })
	$('#y_resolution').change(function() { updateResolution() })
	
	$('#full_screen').click(function() {
		if(fullScreenDiv.requestFullscreen) {
			fullScreenDiv.requestFullscreen()
		} else if (fullScreenDiv.mozRequestFullScreen) {
			fullScreenDiv.mozRequestFullScreen()
		} else if (fullScreenDiv.webkitRequestFullscreen) {
			fullScreenDiv.webkitRequestFullscreen()
		} else if (fullScreenDiv.msRequestFullscreen) {
			fullScreenDiv.msRequestFullscreen()
		}
	})
	
	restart()
}

function adjustCanvas() {
	if (document.mozFullScreen || document.webkitIsFullScreen || document.fullscreen) {
		canvas.height = resolutionY
		canvas.width = resolutionX	
	} else {
		canvas.height = document.body.clientHeight
		canvas.width = document.body.clientWidth			
	}
}

function updateResolution() {
	resolutionX = parseInt($('#x_resolution').val(), 10)
	resolutionY = parseInt($('#y_resolution').val(), 10)
}

function restart() {
	clearTimeout(timeOut)
	numberOfShapes = parseInt($('#shapes').val(), 10)
	minPoints = parseInt($('#min_points').val(), 10)
	maxPoints = parseInt($('#max_points').val(), 10)
	minSymmetry = parseInt($('#min_symmetry').val(), 10)
	maxSymmetry = parseInt($('#max_symmetry').val(), 10)
	adjustCanvas()
	shapes = []
	var horizontalSpacing = canvas.width / (numberOfShapes+1)
	var verticalExtent = canvas.height / 4
	maxRadius = Math.min(horizontalSpacing / 2, verticalExtent * 2)
	maxRadiusSquared = maxRadius * maxRadius
	var initialRadius = maxRadius / 4
	for (var s=0; s<numberOfShapes; s++) {
		var shape = {}
		shape.symmetry = random(maxSymmetry - minSymmetry + 1) + minSymmetry
		shape.centre = {x:(s+1)*horizontalSpacing, y:canvas.height/2}
		shape.drift = {x:0, y:0}
		shape.numberOfPoints = random(maxPoints - minPoints + 1) + minPoints
		var angleStep = 2*Math.PI / shape.symmetry / shape.numberOfPoints
		shape.points = []
		for (var p=0; p<shape.numberOfPoints; p++) {
			var x = Math.cos(angleStep * p) * initialRadius
			var y = Math.sin(angleStep * p) * initialRadius
			var drift = {x:0, y:0}
			shape.points.push({x:x, y:y, drift:drift})
		}
		shapes.push(shape)
	}
	
	animate()
}

function animate() {
	timeOut = setTimeout(animate, 32)
	movePoints()
	displayPoints()
}

function movePoints() {
	for (var s=0; s<numberOfShapes; s++) {
		var angle = Math.random() * 2*Math.PI
		var shape = shapes[s]
		var points = shape.points
		var centre = shape.centre
		var drift = shape.drift
		drift.x += Math.cos(angle) / 30
		drift.y += Math.sin(angle) / 30
		var lengthSquared = drift.x * drift.x + drift.y * drift.y
		if (lengthSquared > 1) {
			drift.x /= Math.sqrt(lengthSquared)
			drift.y /= Math.sqrt(lengthSquared)
		}		
		centre.x += drift.x / 10
		centre.y += drift.y / 10
		if (centre.x < 0) {
			centre.x += canvas.width
		} else if (centre.x > canvas.width) {
			centre.x -= canvas.width
		}
		if (centre.y < 0) {
			centre.y += canvas.height
		} else if (centre.y > canvas.height) {
			centre.y -= canvas.height
		}
		for (var p=0; p<shape.numberOfPoints; p++) {
			var angle = Math.random() * 2*Math.PI
			var point = points[p]
			var drift = point.drift
			drift.x += Math.cos(angle) / 30
			drift.y += Math.sin(angle) / 30
			var lengthSquared = drift.x * drift.x + drift.y * drift.y
			if (lengthSquared > 1) {
				drift.x /= Math.sqrt(lengthSquared)
				drift.y /= Math.sqrt(lengthSquared)
			}
			point.x += drift.x / 10
			point.y += drift.y / 10
			var lengthSquared = point.x * point.x + point.y * point.y
			if (lengthSquared > maxRadiusSquared) {
				point.x *= maxRadius / Math.sqrt(lengthSquared)
				point.y *= maxRadius / Math.sqrt(lengthSquared)
				var angle = Math.random() * 2*Math.PI
				drift.x = Math.cos(angle) / 20
				drift.y = Math.sin(angle) / 20
			}
		}
	}
}

function displayPoints() {
	ctx.fillStyle = 'rgba(255, 255, 255, 255)'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	for (var s=0; s<numberOfShapes; s++) {
		var shape = shapes[s]
		var symmetry = shape.symmetry
		var mainCentre = shape.centre
		var points = shape.points
		var horizontalStart = mainCentre.x > canvas.width - maxRadius ?-1:0
		var horizontalEnd = mainCentre.x < maxRadius ?1:0
		var verticalStart = mainCentre.y > canvas.height - maxRadius ?-1:0
		var verticalEnd = mainCentre.y < maxRadius ?1:0
		for (var horizontal=horizontalStart; horizontal<=horizontalEnd; horizontal++) {
			for (var vertical=verticalStart; vertical<=verticalEnd; vertical++) {
				var centre = {x:mainCentre.x + horizontal*canvas.width, y:mainCentre.y + vertical*canvas.height}
				ctx.beginPath()
				ctx.moveTo(centre.x + points[0].x, centre.y + points[0].y)
				for (var rotation=0; rotation<symmetry; rotation++) {
					for (var p=0; p<shape.numberOfPoints; p++) {
						var rotatedCoords = rotated(points[p], rotation, symmetry)
						var x = rotatedCoords.x
						var y = rotatedCoords.y
						ctx.lineTo(centre.x + x, centre.y + y)
					}
				}
				ctx.closePath()
				ctx.fillStyle = 'rgba(0, 0, 0, 255)'
				ctx.fill('evenodd')
			}
		}
	}
}

function rotated(point, rotation, symmetry) {
	var angle = 2*Math.PI / symmetry * rotation
	var x = point.x * Math.cos(angle) - point.y * Math.sin(angle)
	var y = point.x * Math.sin(angle) + point.y * Math.cos(angle)
	return {x:x, y:y}
}

function random(n) {
	return Math.floor(Math.random() * n)
}
