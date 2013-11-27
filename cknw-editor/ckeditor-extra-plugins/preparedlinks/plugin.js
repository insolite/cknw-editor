CKEDITOR.plugins.add('preparedlinks', {
	requires: 'dialog',
	//icons: '',
	plinkNextId: 1, //global id counter for prepared links
	publish: function (html) {
		var element = $('<div>' + html + '</div>');
		element.find('a[role="prepared-link"]').each(function (e) {
			$(this).contents().unwrap();
		});
		return element.html();
	},
	init: function (editor) {
		var self = this;
		
		CKEDITOR.dialog.add('anchorsDialog', CKEDITOR.plugins.get('preparedlinks').path + 'dialogs/anchors.js');
		editor.addCommand('anchorsDialog', new CKEDITOR.dialogCommand('anchorsDialog'));
		CKEDITOR.dialog.add('preparedLinksDialog', CKEDITOR.plugins.get('preparedlinks').path + 'dialogs/prepared-links.js');
		editor.addCommand('preparedLinksDialog', new CKEDITOR.dialogCommand('preparedLinksDialog'));
		editor.addCommand('prepareReslink', {
			exec : function (editor) {
				editor.fire('saveSnapshot');
				var selection = editor.getSelection();
				var selectedElement = selection.getSelectedElement();
				if (selectedElement && selectedElement.getName() == 'a') {
					var role = selectedElement.getAttribute('role');
					if (role == 'prepared-link') {
						selectedElement.setAttribute('role', 'prepared-link');
					}
				}
				else {
					var range = selection.getRanges(1)[0];
					// Use link URL as text with a collapsed cursor.
					if (range.collapsed) {
						var text = new CKEDITOR.dom.text('untitled link', editor.document);
						range.insertNode(text);
						range.selectNodeContents(text);
					}
					
					attributes = {
					};
					var style = new CKEDITOR.style({ element: 'a', attributes: attributes });
					style.type = CKEDITOR.STYLE_INLINE; // need to override... dunno why.
					style.applyToRange(range);
					range.select();
					selectedElement = selection.getSelectedElement() || selection.getStartElement();
					selectedElement.setAttribute('role', 'prepared-link');
				}
				selectedElement.$.removeAttribute('data-cke-saved-href'); //href won't assign without it
				selectedElement.setAttribute('href', '#');
				selectedElement.setAttribute('id', 'plink-' + self.plinkNextId++);
			}
		});
		editor.ui.addButton('PrepareLink', {
			label: 'Insert link for later definition',
			command: 'prepareReslink',
			icon: CKEDITOR.plugins.get('preparedlinks').path + 'icons/prepared-links.png',
		});
		
		// If the "menu" plugin is loaded, register the menu items.
		if (editor.addMenuItems) {
			editor.addMenuItems({
				preparedLinksDialog: {
					label: 'Link prepared link here',
					command: 'preparedLinksDialog',
					group: 'link', //TODO: create group
					order: 1
				},
				anchorsDialog: {
					label: 'Select anchor', //Edit prepared link here
					command: 'anchorsDialog',
					group: 'link', //TODO: create group
					order: 1
				},
			});
		}

		// If the "contextmenu" plugin is loaded, register the listeners.
		if (editor.contextMenu) {
			editor.contextMenu.addListener(function(element, selection) {
				if (!element || element.isReadOnly())
					return null;

				var menu = {};

				var role = element.getAttribute('role');
				var href = element.getAttribute('href');
				if (role == 'prepared-link' || (href && href.indexOf('#') >= 0)) {
					menu = { anchorsDialog: CKEDITOR.TRISTATE_OFF };
				}
				else if (element.hasAttribute('name')) {
					menu = { preparedLinksDialog: CKEDITOR.TRISTATE_OFF };
				}

				return menu;
			});
		}
		
		editor.on('doubleclick', function(evt) {
			var element = evt.data.element;

			if (!element.isReadOnly()) {
				if (element.is('a')) {
					var role = element.getAttribute('role');
					var href = element.getAttribute('href');
					if (role == 'prepared-link' || (href && href.indexOf('#') >= 0)) {
						evt.data.dialog = 'anchorsDialog';
						editor.getSelection().selectElement(element);
					}
				}
			}
		});
	},
});
