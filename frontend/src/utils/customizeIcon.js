import materialIconTheme from "@iconify-json/material-icon-theme/icons.json" with { type: "json" }

const folderAliases = {
	assets: "images",
	components: "components",
	pages: "views",
	utils: "utils",
	helpers: "helper",
	services: "server",
	hooks: "hook",
	styles: "css",
	tests: "test",
	__tests__: "test",
	node_modules: "packages",
	data: "database",
}

const fileIcons = {
	js: "javascript",
	mjs: "javascript",
	cjs: "javascript",
	jsx: "react",
	ts: "typescript",
	dts: "typescript-def",
	tsx: "react-ts",
	py: "python",
	html: "html",
	htm: "html",
	css: "css",
	scss: "sass",
	sass: "sass",
	json: "json",
	md: "markdown",
	mdx: "markdown",
	go: "go",
	rs: "rust",
	java: "java",
	c: "c",
	h: "c",
	cc: "cpp",
	cpp: "cpp",
	cxx: "cpp",
	hpp: "cpp",
	cs: "csharp",
	php: "php",
	rb: "ruby",
	swift: "swift",
	kt: "kotlin",
	kts: "kotlin",
	dart: "dart",
	yml: "yaml",
	yaml: "yaml",
	vue: "vue",
	svelte: "svelte",
	graphql: "graphql",
	gql: "graphql",
	prisma: "prisma",
	dockerfile: "docker",
	"package-lock.json": "npm",
	"pnpm-lock.yaml": "pnpm",
	"yarn.lock": "yarn",
	".gitignore": "git",
	"eslint.config.js": "eslint",
	"vite.config.js": "vite",
	"vite.config.ts": "vite",
}

const getIcon = (iconName, fallbackName) => {
	const name = materialIconTheme.icons[iconName] ? iconName : fallbackName
	return {
		prefix: materialIconTheme.prefix,
		...materialIconTheme.icons[name],
	}
}

const customizeFileIcon = (fileName) => {
	const normalizedName = typeof fileName === "string" ? fileName.trim().toLowerCase() : ""
	const extension = normalizedName.split(".").pop()
	const iconName = fileIcons[normalizedName] || fileIcons[extension]
	return { icon: getIcon(iconName, "document") }
}

const customizeIcon = (folderName, isOpen = false) => {
	const normalizedName = typeof folderName === "string"
		? folderName.trim().toLowerCase().replace(/[\\/]+$/, "").split(/[\\/]/).pop()
		: ""
	const folderType = folderAliases[normalizedName] || normalizedName
	const iconName = `folder-${folderType}${isOpen ? "-open" : ""}`
	const fallbackName = isOpen ? "folder-base-open" : "folder-base"

	return { icon: getIcon(iconName, fallbackName) }
}

export default customizeIcon
export { customizeFileIcon }
