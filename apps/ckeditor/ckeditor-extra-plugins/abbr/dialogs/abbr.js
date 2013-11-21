CKEDITOR.dialog.add('abbrDialog', function (editor) {
	return {
		title : 'Abbreviation Properties',
		minWidth : 400,
		minHeight : 200,
 
		contents :
		[
			{
				id : 'main',
				label : 'Settings',
				elements :
				[
					{
						type : 'text',
						id : 'abbr',
						label : 'Abbreviation',
						validate : CKEDITOR.dialog.validate.notEmpty( "Abbreviation field cannot be empty" )
					},
					{
						type : 'text',
						id : 'definition',
						label : 'Explanation',
						validate : CKEDITOR.dialog.validate.notEmpty( "Explanation field cannot be empty" )
					},
					{
						type : 'radio',
						id : 'position',
						label : 'Explanation',
						items: [ [ 'Before selection', 'before' ], [ 'After selection', 'after' ] ],
						'default': 'after',
					},
				]
			}
		],
		
		onOk: function() {
			editor.fire('saveSnapshot');
			var dialog = this;
			var currentElement = editor.getSelection().getStartElement();
			if (currentElement) {
				var currentElementTag = currentElement.getName();
				if (currentElementTag == 'dt' || currentElementTag == 'dd') {
					currentElement = currentElement.getParent();
					//currentElement = currentElement.getParent(); //Widget version (div ckeditor wrapper)
				}
				/*
				//Widget version (div ckeditor wrapper)
				else if (currentElementTag == 'dl') { //Probably, this is impossible, cause of div wrapper over dl
					currentElement = currentElement.getParent();
				}
				*/
			}
			var dt = editor.document.createElement('dt');
			dt.setHtml(dialog.getValueOf( 'main', 'abbr' )); //setHtml returns html, not dt o_0
			var dd = editor.document.createElement('dd');
			dd.setHtml(dialog.getValueOf( 'main', 'definition' )); //setHtml returns html, not dd o_0
			var dl = editor.document.createElement('dl');
			dl.append(dt);
			dl.append(dd);
			if (currentElement) {
				var position = dialog.getValueOf( 'main', 'position' );
				if (position == 'before') {
					currentElement.insertBeforeMe(dl);
				}
				else if (position == 'after') {
					dl.insertAfter(currentElement);
				}
				else {
					//Wrong selection, appending to the end
					editor.editable().append(dl);
				}
			}
			else {
				editor.editable().append(dl);
			}
			//Widget version:
			//var widget = editor.widgets.initOn( dl, 'abbreviation' );
		},
	};
});
