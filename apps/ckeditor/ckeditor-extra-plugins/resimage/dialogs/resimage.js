CKEDITOR.dialog.add('resimageDialog', function (editor) {
	var items = [];
	for (var i in FileExplorer.resources['Images'].files) {
		file = FileExplorer.resources['Images'].files[i];
		if (file['gen-type'] == 'file') {
			items.push([file['name'], file['rel-path']]);
		}
	}
	
	var resourceExists = function (container, name) {
		for (var i in container) {
			if (container[i][1] == name) {
				return true;
			}
		}
		return false;
	};
	
	return {
		title : 'Image Properties',
		minWidth : 400,
		minHeight : 200,
 		
 		onShow: function () {
 			var selection = editor.getSelection();
			var element = selection.getSelectedElement() || selection.getStartElement();
			if (element) {
				//var name = element.getAttribute('src');
				var name = element.getAttribute('filename');
				if (resourceExists(items, name)) {
					var dialog = this;
					dialog.getContentElement( 'main', 'filepath' ).setValue( name );
				}
			}
 		},
 		
		contents :
		[
			{
				id : 'main',
				label : 'Settings',
				elements :
				[
					{
						type : 'select',
						id : 'filepath',
						label : 'Image',
						items: items,
						'default': items[0][1],
					},
				]
			}
		],
		
		onOk: function() {
			editor.fire('saveSnapshot');
			var dialog = this;
			var selection = editor.getSelection();
			var selectedElement = selection.getSelectedElement() || selection.getStartElement();
			if (selectedElement && selectedElement.getName() == 'img') {
				selectedElement.$.removeAttribute( 'data-cke-saved-src' ); //src won't assign without it
				var filename = dialog.getValueOf('main', 'filepath');
				selectedElement.setAttribute('filename', filename);
				selectedElement.setAttribute('src', FileExplorer.resources['Images'].dir + '/' + filename);
			}
			else {
				var range = selection.getRanges(1)[0];
				// Use link URL as text with a collapsed cursor.
				if ( range.collapsed ) {
					var text = new CKEDITOR.dom.text(dialog.getValueOf( 'main', 'filepath' ), editor.document);
					range.insertNode( text );
					range.selectNodeContents( text );
				}
				
				// Apply style.
				var filename = dialog.getValueOf('main', 'filepath');
				attributes = {
					'filename': filename,
					'src': FileExplorer.resources['Images'].dir + '/' + filename,
					'class': 'res-image',
				};
				var style = new CKEDITOR.style({ element: 'img', attributes: attributes } );
				style.type = CKEDITOR.STYLE_INLINE; // need to override... dunno why.
				style.applyToRange( range );
				range.select();
			}
		},
	};
});
