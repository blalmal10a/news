function convertDate(date) {
	return date.toLocaleDateString("de-DE").replace(/\//g, ".")
}

// function convertToImage(divId) {
// 	// Get the div element by its ID.
// 	var div = document.getElementById(divId)

// 	// Create a canvas element.
// 	var canvas = document.createElement("canvas")
// 	console.log("canvas is: ", canvas)
// 	console.log("div is: ", div)

// 	// Set the canvas's width and height to the same as the div element's.
// 	canvas.width = div.offsetWidth
// 	canvas.height = div.offsetHeight

// 	// Create a 2D context for the canvas.
// 	var ctx = canvas.getContext("2d")

// 	// Draw the div element's contents to the canvas.
// 	ctx.drawImage(div, 0, 0)

// 	// Get the canvas's image data as a base64 string.
// 	var imageData = canvas.toDataURL("image/png")

// 	// Save the image data to a file.
// 	var fileName = "image.png"
// 	var file = new File(imageData, fileName)
// 	file.save()
// }
function onFocusTitle(data) {
	setTimeout(() => {
		data.target.select()
	}, 300)
}

async function generateNews() {
	// const popupWindow = await openInNewWindow()
	// const newsContent = popupWindow.document.getElementById("image-to-generate")

	const newsContent = document.getElementById("image-to-generate")
	const container = document.getElementById("container")
	container.style.opacity = 0
	newsContent.style.scale = 1

	setTimeout(() => {
		processImage(newsContent)
		container.style.opacity = 1
		updateImageContainerSize()
	}, 800)
}

function processImage(newsContent) {
	html2canvas(newsContent, {
		scrollX: -1700,
		scrollY: -window.scrollY,
		windowWidth: newsContent.scrollWidth,
		windowHeight: document.documentElement.offsetHeight,
	}).then(function (canvas) {
		// var img = canvas.toDataURL()
		var image = canvas
			.toDataURL("image/png")
			.replace("image/png", "image/octet-stream")

		shareImage(image)
		// downloadImage(image)
	})
}

function shareImage(imageData) {
	// Check if the Web Share API is available in the browser
	if (navigator.share) {
		// Create an object containing the image data and type
		const shareData = {
			files: [new File([imageData], "news_image.png", {type: "image/png"})],
		}

		// Use the Web Share API to share the image
		navigator
			.share(shareData)
			.then(() => {
				console.log("Image shared successfully")
			})
			.catch((error) => {
				console.error("Error sharing image:", error)
			})
	} else {
		console.log("Web Share API is not available in this browser.")
		// You can provide a fallback method or message here for browsers that do not support Web Share API.
	}
}

async function downloadImage(image) {
	var link = document.createElement("a")
	link.href = image
	link.download = "my-image.png"
	link.click()
}

async function openInNewWindow() {
	const htmlContent = `
	<head>
	
	<style>
	.image-container {
		position: relative;
		background-image: url(src/assets/images/theme-1-template.png);
		width: 1700px;
		background-size: contain;
		aspect-ratio: 16/9;
	}

	.inner-image {
		position: absolute;

		height: 645px;
		top: 140px;
		left: 290px;
		aspect-ratio: 16/9;
	}

	#top-banner {
		position: absolute;
		color: white;
		top: 35px;
		left: 280px;
		font-size: 36px;
		font-weight: 700;
		white-space: nowrap;
	}

	#news-header {
		position: absolute;
		top: 780px;
		left: 380px;
		font-size: 27px;
		font-weight: 800;
		color: black;
		white-space: nowrap;
	}

	#bottom-left {
		position: absolute;
		color: white;
		top: 845px;
		left: 380px;
		font-size: 17px;
		font-weight: 500;
	}

	#bottom-right {
		position: absolute;
		color: white;
		top: 835px;
		left: 1250px;
		font-size: 17px;
		font-weight: 500;
	}

	button:active {
		transform: translateY(1px);
	}
	button:disabled:active {
		transform: translate(0px);
	}
</style>
	</head>
	<body>
	<div id="image-to-generate" style="position: relative;">
		<div class="inner-image" id>
			<img
				src="src/assets/images/another.jpg"
				alt
				style="
					height: 100%;
					width: 100%;
					object-fit: cover;
					object-position: center;
				"
			/>
		</div>
		<div class="image-container"></div>
		<span id="top-banner" x-text="banner_text"></span>
		<span id="news-header" x-text="news_title"></span>
		<!-- <span id="bottom-left" x-text="banner_text"></span> -->
		<span id="bottom-right" x-text="selected_date"></span>
	</div>

	</body>
	`
	const popupWindow = window.open("", "popupWindow", "width: 1700,height:600")

	popupWindow.document.write(htmlContent)

	return popupWindow
}

document.addEventListener("DOMContentLoaded", () => {
	updateImageContainerSize()
	let checkCounter = 0
	let isRemoved = false
	let interval = setInterval(() => {
		if (checkCounter++ > 10 || isRemoved) {
			clearInterval(interval)
		}
		isRemoved = checkBanner()
	}, 500)
})

function updateImageContainerSize() {
	const testElement = document.getElementById("image-to-generate")
	const screenWidth = screen.width

	let mainWidth = window.innerWidth
	if (screenWidth < mainWidth) mainWidth = screenWidth
	const scaleValue = mainWidth / (1700 + screenWidth)
	console.log("scale value is: ", scaleValue)
	testElement.style.scale = scaleValue
	testElement.style.display = "block"
}

function onSelectImage(event) {
	const innerImage = document.getElementById("inner-image")
	const selectedImage = event.target.files[0]
	if (selectedImage) {
		const reader = new FileReader()

		reader.onload = function (e) {
			const dataURI = e.target.result

			innerImage.src = dataURI
		}
		reader.readAsDataURL(selectedImage)
	} else {
		// If no image is selected, clear the inner image src
		this.selectedImage = ""
	}
}

window.addEventListener("resize", updateImageContainerSize)

function checkBanner() {
	document.body.style.marginBottom = 0
	const divElement = document.querySelector("div")
	if (
		divElement.firstElementChild &&
		divElement.firstElementChild.tagName === "A"
	) {
		divElement.parentNode.removeChild(divElement)
		return true
	}
	return false
}
