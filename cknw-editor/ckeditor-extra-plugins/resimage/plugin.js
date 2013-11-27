CKEDITOR.plugins.add('resimage', {
	requires: 'dialog',
	//icons: '',
	publish: function (html) {
		var element = $('<div>' + html + '</div>');
		element.find('img[role="res-image"]').each(function (e) {
			$(this).removeAttr('role');
			$(this).removeAttr('filename');
		});
		return element.html();
	},
	init: function (editor) {
		CKEDITOR.dialog.add( 'resimageDialog', CKEDITOR.plugins.get('resimage').path + 'dialogs/resimage.js' );
		editor.addCommand( 'resimageDialog', new CKEDITOR.dialogCommand( 'resimageDialog' ));
		editor.ui.addButton( 'ResImage', {
			label: 'Insert Image',
			command: 'resimageDialog',
			icon: CKEDITOR.plugins.get('resimage').path + 'icons/resimage.png',
		});
		
		// If the "menu" plugin is loaded, register the menu items.
		if (editor.addMenuItems) {
			editor.addMenuItems({
				resimageDialog: {
					label: 'Edit image', //label: editor.lang.link.menu,
					command: 'resimageDialog',
					group: 'link', //TODO: create group
					order: 1,
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
				if (role == 'res-image') {
					menu = { resimageDialog: CKEDITOR.TRISTATE_OFF };
				}

				return menu;
			});
		}
		
		editor.on('doubleclick', function(evt) {
			var element = evt.data.element;

			if (!element.isReadOnly()) {
				if (element.is('img')) {
					var role = element.getAttribute('role');
					if (role == 'res-image') {
						evt.data.dialog = 'resimageDialog';
						editor.getSelection().selectElement(element);
					}
				}
			}
		});
	},
});
