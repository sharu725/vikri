import Prism from 'prismjs';

function renderPrism(node, code, lang) {
	code = code.trim();
	let html = Prism.highlight(code, lang);
	html = html
		.split('\n')
		.map((line) =>
			line.replace(/^(\s+)/, (_, m) => '<span class="tab"></span>'.repeat(m.length / 8))
		)
		.join('<br />');
	node.innerHTML = html;
}

function prismLang(lang) {
	return function prism(node, code) {
		renderPrism(node, code, lang);
		return {
			update(code) {
				renderPrism(node, code, lang);
			}
		};
	};
}

export const prismJs = prismLang(Prism.languages.javascript);