CKEDITOR.dialog.add('reslinkDialog', function (editor) {
	var items = {};
	var sources = [
		FileExplorer.resources['Documents'],
		FileExplorer.resources['Blanks'],
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
		itemsList.push([self.path.join(item['filename'], item['dir'], item['filename'])]);
	});
	
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
						items: itemsList,
						'default': itemsList[0][1],
						className: 'dialog-limited',
					},
					{
						type : 'button',
						id : 'view',
						label : 'View',
						'onClick': function (e) {
							var dialog = this.getDialog();
							document.location = dialog.getContentElement('main', 'filepath').getValue();
							//TODO: use pdf.js
							/*
							var dialog = this.getDialog();
							var spawn = require('child_process').spawn;
							var viewer = '';
							var pdf = spawn(viever, [self.path.join(process.cwd(), dialog.getContentElement('main', 'filepath').getValue())]);
						
							ls.stdout.on('data', function (data) {
								console.log('stdout: ' + data);
							});
							
							ls.stderr.on('data', function (data) {
								console.log('stderr: ' + data);
							});
							
							ls.on('close', function (code) {
								console.log('child process exited with code ' + code);
							});
							*/
						},
					},
				]
			}
		],
		
 		onShow: function () {
			var selection = editor.getSelection();
			var element = selection.getSelectedElement() || selection.getStartElement();
			if (element) {
				var href = element.getAttribute('href');
				var dialog = this;
				var selectElement = dialog.getContentElement('main', 'filepath');
				if (items.hasOwnProperty(href)) {
					selectElement.setValue(href);
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
			if (selectedElement && selectedElement.getName() == 'a') {
				selectedElement.$.removeAttribute('data-cke-saved-href'); //href won't assign without it
				selectedElement.setAttribute('href', dialog.getValueOf('main', 'filepath'));
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
					'href': dialog.getValueOf('main', 'filepath'),
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
