CKEDITOR.plugins.add('abbr', {
	//requires: 'widget',
	//icons: '',
	publish: function (html) {
		return html;
		//var element = $('<div>' + html + '</div>');
		//return element.html();
	},
	init: function (editor) {
		/*
		//Widget version:
		editor.widgets.add('abbreviation', {
			//allowedContent: 'dl(!simplebox); dt(!simplebox-title); dd(!simplebox-content)',
			requiredContent: 'dl',
			editables: {
				title: {
					selector: 'dl > dt',
					allowedContent: 'strong b i' //TODO: <a>
				},
				content: {
					selector: 'dl > dd',
					allowedContent: 'strong b i' //TODO: <a>
				},
			},
			template:
				'<dl>' +
					'<dt>ABBR</dt>' +
					'<dd>Definition</dd>' +
				'</dl>',
			//button: 'Create abbreviation',
			upcast: function(element) {
				return element.name == 'dl';
			}
		});
		*/
		CKEDITOR.dialog.add( 'abbrDialog', CKEDITOR.plugins.get('abbr').path + 'dialogs/abbr.js' );
		editor.addCommand( 'abbrDialog', new CKEDITOR.dialogCommand( 'abbrDialog' ));
		editor.ui.addButton( 'Abbr', {
			label: 'Insert Abbreviation',
			command: 'abbrDialog',
			icon: CKEDITOR.plugins.get('abbr').path + 'icons/abbreviation.png',
		});
	},
});