CKEDITOR.dialog.add('anchorsDialog', function (editor) {
	var anchorExists = function (container, name) {
		for (var i in container) {
			if (container[i][1] == name) {
				return true;
			}
		}
		return false;
	};
	
	return {
		title : 'Anchor Selection',
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
						id : 'document',
						label : 'Document',
						items: [],
						onChange: function () {
							var dialog = this.getDialog();
							
							var documentSelectElement = dialog.getContentElement('main', 'document');
							var anchorSelectElement = dialog.getContentElement('main', 'anchor');
							anchorSelectElement.clear();
							var filepath = documentSelectElement.getValue();
							$('#sidebar-left > ul > li[path="' + filepath + '"] > a.opened').each(function (e) {
								var openedEditor = FileExplorer.getEditorByFilepath(filepath);
								var anchors = openedEditor.document.find('a');
								for (var i = 0; i < anchors.count(); i++) {
									anchor = anchors.getItem(i);
									if (anchor.hasAttribute('name') &&
										 (!anchor.hasAttribute('href') ||
										   anchor.getAttribute('href') == '#'
										)
									  ) {
										anchorSelectElement.add(anchor.getText(), anchor.getAttribute('name'));
									}
								}
							});
						},
					},
					{
						type : 'select',
						id : 'anchor',
						label : 'Anchor',
						items: [],
					},
				]
			}
		],
		
		onShow: function () {
			var dialog = this;
			
			var documentSelectElement = dialog.getContentElement('main', 'document');
			documentSelectElement.clear();
			var anchorSelectElement = dialog.getContentElement('main', 'anchor');
			var items = [];
			$('#sidebar-left > ul > li > a.opened').each(function (e) {
				items.push([$(this).text(), $(this).parent().attr('path')]);
				documentSelectElement.add($(this).text(), $(this).parent().attr('path'));
			});
			var selection = editor.getSelection();
			var element = selection.getSelectedElement() || selection.getStartElement();
			if (element) {
				var linkInfo = element.getAttribute('href').split('#');
				var page = linkInfo[0];
				var anchor = linkInfo[1];
				if (anchorExists(items, page)) {
					documentSelectElement.setValue(page);
					anchorSelectElement.setValue(anchor);
				}
				else {
					documentSelectElement.setValue(items[0][1]);
				}
			}
			else {
				documentSelectElement.setValue(items[0][1]);
			}
		},
 		
		onOk: function() {
			var dialog = this;
			
			editor.fire('saveSnapshot');
			var documentSelectElement = dialog.getContentElement('main', 'document');
			var anchorSelectElement = dialog.getContentElement('main', 'anchor');
			var filepath = documentSelectElement.getValue();
			var anchor = anchorSelectElement.getValue();
			var selection = editor.getSelection();
			var link = selection.getSelectedElement() || selection.getStartElement();
			//link.$.removeAttribute('data-cke-saved-href'); //href won't assign without it
			link.setAttribute('href', filepath + '#' + anchor);
			link.removeAttribute('role');
			link.removeAttribute('id');
		},
	};
});
