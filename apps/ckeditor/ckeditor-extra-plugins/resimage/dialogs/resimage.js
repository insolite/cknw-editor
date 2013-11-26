CKEDITOR.dialog.add('resimageDialog', function (editor) {
	var items = {};
	var sources = [
		FileExplorer.resources['Images'],
		FileExplorer.resources['Vector Images'],
	];
	$.each(sources, function (index, source) {
		$.each(source.files, function (index, file) {
			if (file['gen-type'] == 'file') {
				items[self.path.join(file['dir'], file['name'])] = {
					'filename': file['filename'],
					'dir': file['dir'],
				};
			}
		});
	});
	
	itemsList = [];
	$.each(items, function (index, item) {
		itemsList.push([item['filename'], self.path.join(item['dir'], item['filename'])]);
	});
	
	return {
		title : 'Image Properties',
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
						label : 'Image',
						items: itemsList,
						'default': itemsList[0][1],
						className: 'dialog-limited',
						onChange: function () {
							var dialog = this.getDialog();
							var previewElement = dialog.getContentElement('main', 'preview').getElement();
							var imgPath = this.getValue();
							previewElement.setAttribute("src", imgPath);
						},
					},
					{
						type: 'html',
						id: 'preview',
						label: 'Preview',
						html : '<img src="" />',
					},
				]
			}
		],
		
 		onShow: function () {
 			var selection = editor.getSelection();
			var element = selection.getSelectedElement() || selection.getStartElement();
			if (element) {
				var src = element.getAttribute('src');
				var dialog = this;
				var selectElement = dialog.getContentElement('main', 'filepath');
				if (items.hasOwnProperty(src)) {
					selectElement.setValue(src);
				}
				else {
					selectElement.setValue(itemsList[0][1]);
				}
			}
 		},
 		
		onOk: function() {
			editor.fire('saveSnapshot');
			var dialog = this;
			var selection = editor.getSelection();
			var selectedElement = selection.getSelectedElement() || selection.getStartElement();
			if (selectedElement && selectedElement.getName() == 'img') {
				selectedElement.$.removeAttribute('data-cke-saved-src'); //src won't assign without it
				var filename = dialog.getValueOf('main', 'filepath');
				selectedElement.setAttribute('src', filename);
			}
			else {
				var range = selection.getRanges(1)[0];
				// Use link URL as text with a collapsed cursor.
				if (range.collapsed) {
					var text = new CKEDITOR.dom.text(dialog.getValueOf('main', 'filepath'), editor.document);
					range.insertNode(text);
					range.selectNodeContents(text);
				}
				
				var filename = dialog.getValueOf('main', 'filepath');
				attributes = {
					'src': filename,
					'role': 'res-image',
				};
				var style = new CKEDITOR.style({ element: 'img', attributes: attributes });
				style.type = CKEDITOR.STYLE_INLINE; // need to override... dunno why.
				style.applyToRange(range);
				range.select();
			}
		},
	};
});
