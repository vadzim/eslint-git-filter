const path = require("path")
const fs = require("fs")
const util = require("util")

module.exports = async (cachedSource, { filename, cwd }) => {
	const engine = getEngine(cwd)
	let output = undefined
	try {
		output = engine.executeOnText(cachedSource, filename).results[0].output
	} catch (error) {
		console.error(error)
	}
	return output || cachedSource
}

function getEngine(cwd) {
	const { CLIEngine } = cwd ? requireInPath("eslint", cwd) : require("eslint")
	const engine = new CLIEngine({ fix: true })
	return engine
}

function requireInPath(modulename, pathname) {
	const m = new module.constructor()
	const node_modules = "node_modules"
	m.paths = []
	let p = pathname
	for (;;) {
		const up = path.dirname(p)
		if (up === p) {
			m.paths.push(p + node_modules)
			break
		}
		m.paths.push(p + path.sep + node_modules)
		p = up
	}
	return m.require(modulename)
}
