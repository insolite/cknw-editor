CKEDITOR.plugins.add('enumerating', {
	requires: 'tagmoving',
	//icons: '',
	publish: function (html) {
		var element = $('<div>' + html + '</div>');
		//TODO: as separate css file
		element.prepend('\
		<style type="text/css">\
		body { counter-reset: enum1; }\
		p.enumerable-1 {\
			counter-reset: enum2 enum3;\
		}\
		p.enumerable-1:before {\
			counter-increment: enum1;\
			content: counter(enum1) ". ";\
		}\
		p.enumerable-2 {\
			counter-reset: enum3;\
		}\
		p.enumerable-2:before {\
			counter-increment: enum2;\
			content: counter(enum1) "." counter(enum2) ". ";\
		}\
		p.enumerable-3:before {\
			counter-increment: enum3;\
			content: counter(enum1) "." counter(enum2) "." counter(enum3) ". ";\
		}\
		</style>\
		');
		/*
		element.find('.enumerable').each(function (e) {
			counters = [];
			for (var i = 1; i <= 3; i++) {
				counters.push('counter(enum' + i + ')');
				var className = 'enumerable-' + i;
				if ($(this).hasClass(className)) {
					$(this).removeClass(className);
					$(this).css({
						'counter-increment': 'enum' + i,
						'content': counters.join('"."'),
					});
				}
			}
			$(this).removeClass('enumerable');
		});
		*/
		return element.html();
	},
	init: function (editor) {
		if (!CKEDITOR.plugins.get('tagmoving').tagOptions['p']) {
			CKEDITOR.plugins.get('tagmoving').tagOptions['p'] = [];
		}
		CKEDITOR.plugins.get('tagmoving').tagOptions['p'].push({
			type: 'container',
			label: 'Enumerable',
			children: [
				{
					type: 'element',
					label: 'Clear',
					click: function (element) {
						element.removeClass('enumerable');
						for (var i = 1; i <= 3; i++) {
							element.removeClass('enumerable-' + i);
						}
					},
				},
				{
					type: 'element',
					label: 'Level 1',
					click: function (element) {
						if (element.hasClass('enumerable')) {
							element.removeClass('enumerable-1');
							element.removeClass('enumerable-2');
							element.removeClass('enumerable-3');
						}
						else {
							element.addClass('enumerable');
						}
						element.addClass('enumerable-1');
					},
				},
				{
					type: 'element',
					label: 'Level 2',
					click: function (element) {
						if (element.hasClass('enumerable')) {
							element.removeClass('enumerable-1');
							element.removeClass('enumerable-2');
							element.removeClass('enumerable-3');
						}
						else {
							element.addClass('enumerable');
						}
						element.addClass('enumerable-2');
					},
				},
				{
					type: 'element',
					label: 'Level 3',
					click: function (element) {
						if (element.hasClass('enumerable')) {
							element.removeClass('enumerable-1');
							element.removeClass('enumerable-2');
							element.removeClass('enumerable-3');
						}
						else {
							element.addClass('enumerable');
						}
						element.addClass('enumerable-3');
					},
				},
			],
		});
	},
});
