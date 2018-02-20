const net = require("net")
const path = require("path")
const util = require("util")
const fs = require("fs")
const stream = require("stream")
const linter = require("./linter.js")
const readStreamText = require("./readStreamText.js")

const socketPath = process.argv[2]

void (async function main() {
	const cleanup = util.promisify(fs.unlink)(socketPath)
	try {
		await cleanup
	} catch (e) {}

	const server = net
		.createServer({
			allowHalfOpen: true,
		})
		.on("connection", async connection => {
			busy()
			try {
				const text = await readStreamText(connection)
				const commands = text.split("\n", 1)[0]
				const body = text.slice(commands.length + 1)
				const { stopService, serviceIdleTime, ...opts } = JSON.parse(commands)
				idleTime = Number(serviceIdleTime) || idleTime
				if (stopService) {
					connection.end("STOP OK")
					server.close()
				} else {
					connection.end(await linter(body, opts))
				}
			} catch (error) {
				console.error(error)
				connection.end()
			} finally {
				free()
			}
		})
		.on("listening", () => {
			console.log("START OK")
		})
		.on("error", error => console.error(error))
		.listen(socketPath)

	let idleTime = 7200
	let timer
	let counter = 1
	const busy = () => {
		++counter
		clearTimeout(timer)
	}
	const free = () => {
		--counter
		if (counter === 0 && server.listening) {
			timer = setTimeout(() => server.close(), idleTime * 1000)
		}
	}
	server.on("close", () => clearTimeout(timer))
	free()
})()
