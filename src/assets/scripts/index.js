function convertDate(date) {
	return date.toLocaleDateString("de-DE").replace(/\//g, ".")
}

function onFocusTitle(data) {
	setTimeout(() => {
		data.target.select()
	}, 300)
}

async function generateNews(filename) {
	const newsContent = document.getElementById("image-to-generate")
	const container = document.getElementById("container")
	container.style.opacity = 0
	newsContent.style.scale = 1

	processImage(newsContent, filename)
	container.style.opacity = 1
	updateImageContainerSize()
}

function processImage(newsContent, filename) {
	html2canvas(newsContent, {
		scrollY: -window.scrollX,
		scrollY: -window.scrollY,
		windowWidth: 1920,
		windowHeight: document.documentElement.offsetHeight,
	}).then(function (canvas) {
		// var img = canvas.toDataURL()
		var image = canvas.toDataURL("image/png")

		if (filename) {
			image.replace("image/png", "image/octet-stream")
			downloadImage(image, filename)
		} else shareImage(image)
	})
}

function shareImage(imageData) {
	// shareOrDownload(blob, 'cat.png', 'Cat in the snow', 'Getting cold feet…');
	// blob, fileName, title, text

	const data = {
		files: [
			new File([imageData], "fake-news.png", {
				type: "image/png",
			}),
		],
		title: "NEWS",
		text: "",
	}
	// Check if the Web Share API is available in the browser
	if (navigator.share) {
		// Create an object containing the image data and type
		// const shareData = {
		// 	files: [
		// 		new File([imageData], "news_image.png", {
		// 			// type: "blob",
		// 			type: "image/png",
		// 		}),
		// 	],
		// }

		// Use the Web Share API to share the image
		navigator
			.share(data)
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

async function downloadImage(image, filename) {
	var link = document.createElement("a")
	link.href = image
	link.download = `${filename}.png`
	link.click()
}

document.addEventListener("DOMContentLoaded", () => {
	updateImageContainerSize()
	let checkCounter = 0
	let isRemoved = false
	let interval = setInterval(() => {
		if (checkCounter++ > 100 || isRemoved) {
			clearInterval(interval)
		}
		isRemoved = checkBanner()
	}, 50)
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
listenBackgroundImageLoad()
function listenBackgroundImageLoad() {
	const imageContainer = document.querySelector(".image-container")

	// Create a new Image object
	const backgroundImage = new Image()

	backgroundImage.src = "src/assets/images/theme-1-template.png"

	backgroundImage.addEventListener("load", function () {
		console.log("Background image loaded successfully")
		const loader_section = document.getElementById("loader-section")

		setTimeout(() => {
			loader_section.classList.add("fade-out")
		}, 1000)
	})

	// Add an event listener for the 'error' event in case the image fails to load
	backgroundImage.addEventListener("error", function () {
		console.error("Error loading background image")
	})

	// Append the Image object to the .image-container to trigger the loading process
}
