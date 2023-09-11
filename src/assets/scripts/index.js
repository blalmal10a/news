function convertDate(date) {
	return date.toLocaleDateString("de-DE").replace(/\//g, ".")
}

function onFocusTitle(data) {
	setTimeout(() => {
		data.target.select()
	}, 300)
}

async function generateNews(filename, download) {
	const newsContent = document.getElementById("image-to-generate")
	if (download) processImage(newsContent, filename)
	else {
		shareImage(newsContent, filename)
	}
}

async function shareImage(newsContent, filename) {
	const container = document.getElementById("scrollable-container")

	html2canvas(newsContent, {
		scrollX: 0,
		scrollY: -window.scrollY,
		windowWidth: 600,
		windowHeight: document.documentElement.offsetHeight,
	}).then(function (canvas) {
		canvas.toBlob(async (blob) => {
			// Even if you want to share just one file you need to
			// send them as an array of files.
			const files = [new File([blob], `${filename}.png`, {type: blob.type})]
			const shareData = {
				url: window.location.href
				text: filename,
				title: "Chanchin thar lem2 lo siam ve rawh le!",

				files,
			}
			if (navigator.canShare(shareData)) {
				try {
					await navigator.share(shareData)
				} catch (err) {
					if (err.name !== "AbortError") {
						console.error(err.name, err.message)
					}
				}
			} else {
				console.warn("Sharing not supported", shareData)
			}
		})
	})
}

function processImage(newsContent, filename) {
	const container = document.getElementById("scrollable-container")

	html2canvas(newsContent, {
		scrollX: 0,
		scrollY: -window.scrollY,
		windowWidth: 600,
		windowHeight: document.documentElement.offsetHeight,
	}).then(function (canvas) {
		var image = canvas.toDataURL("image/png")

		downloadImage(image, filename)
	})
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
	// const testElement = document.getElementById("image-to-generate")
	// testElement.style.display = "inline-block"
	return
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
