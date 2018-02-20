module.exports = stream => {
	let text = stream.read() || ""
	return new Promise((resolve, reject) =>
		stream
			.on("data", data => (text += data))
			.on("end", () => resolve(text))
			.on("error", reject)
			.resume(),
	)
}
