module.exports = {
	env: {
		node: true,
	},
	extends: [
		'eslint:recommended',
		"plugin:vue/vue3-recommended",
		"prettier"],
	rules: {
		'vue/multi-word-component-names': 0,
		'no-console': 0,
		'vue/no-side-effects-in-computed-properties': 0,
		'vue/require-explicit-emits': 0,
		'vue/first-attribute-line-break': 0,
	},
}