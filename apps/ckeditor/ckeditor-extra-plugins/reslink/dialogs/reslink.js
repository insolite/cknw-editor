CKEDITOR.dialog.add('reslinkDialog', function (editor) {
	var items = [];
	for (var i in FileExplorer.resources['Documents'].files) {
		file = FileExplorer.resources['Documents'].files[i];
		if (file['gen-type'] == 'file') {
			items.push([file['name'], file['rel-path']]);
		}
	}
	
	var resourceExists = function (container, name) {
		for (var i in items) {
			if (items[i][1] == name) {
				return true;
			}
		}
		return false;
	};
	
	return {
		title : 'Link Properties',
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
						type : 'select',
						id : 'filepath',
						label : 'Document',
						items: items,
						'default': items[0][1],
					},
				]
			}
		],
		
 		onShow: function () {
			var selection = editor.getSelection();
			var element = selection.getSelectedElement() || selection.getStartElement();
			if (element) {
				var name = element.getAttribute('filename');
				if (resourceExists(items, name)) {
					var dialog = this;
					dialog.getContentElement('main', 'filepath').setValue(name);
				}
			}
 		},
 		
		onOk: function() {
			editor.fire('saveSnapshot');
			var dialog = this;
			var selection = editor.getSelection();
			var selectedElement = selection.getSelectedElement() || selection.getStartElement();
			if (selectedElement && selectedElement.getName() == 'a') {
				selectedElement.$.removeAttribute('data-cke-saved-href'); //href won't assign without it
				selectedElement.setAttribute('href', FileExplorer.resources['Documents'].dir + '/' + dialog.getValueOf('main', 'filepath'));
				selectedElement.setAttribute('filename', dialog.getValueOf('main', 'filepath'));
			}
			else {
				var range = selection.getRanges(1)[0];
				// Use link URL as text with a collapsed cursor.
				if (range.collapsed) {
					var text = new CKEDITOR.dom.text(dialog.getValueOf('main', 'filepath'), editor.document);
					range.insertNode(text);
					range.selectNodeContents(text);
				}
				
				attributes = {
					'href': FileExplorer.resources['Documents'].dir + '/' + dialog.getValueOf('main', 'filepath'),
					'filename': dialog.getValueOf('main', 'filepath'),
					'role': 'res-link',
				};
				var style = new CKEDITOR.style({ element: 'a', attributes: attributes });
				style.type = CKEDITOR.STYLE_INLINE; // need to override... dunno why.
				style.applyToRange(range);
				range.select();
			}
		},
	};
});
