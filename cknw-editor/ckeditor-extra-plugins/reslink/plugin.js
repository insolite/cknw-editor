CKEDITOR.plugins.add('reslink', {
	requires: 'dialog',
	//icons: '',
	publish: function (html) {
		var element = $('<div>' + html + '</div>');
		element.find('a[role="res-link"]').each(function (e) {
			$(this).removeAttr('role');
		});
		return element.html();
	},
	init: function (editor) {
		CKEDITOR.dialog.add( 'reslinkDialog', CKEDITOR.plugins.get('reslink').path + 'dialogs/reslink.js' );
		editor.addCommand( 'reslinkDialog', new CKEDITOR.dialogCommand( 'reslinkDialog' ));
		editor.ui.addButton( 'ResLink', {
			label: 'Insert Link',
			command: 'reslinkDialog',
			icon: CKEDITOR.plugins.get('reslink').path + 'icons/reslink.png',
		});
		
		// If the "menu" plugin is loaded, register the menu items.
		if (editor.addMenuItems) {
			editor.addMenuItems({
				reslinkDialog: {
					label: 'Edit document link', //label: editor.lang.link.menu,
					command: 'reslinkDialog',
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
				if (role == 'res-link') {
					menu = { reslinkDialog: CKEDITOR.TRISTATE_OFF };
				}

				return menu;
			});
		}
		
		editor.on('doubleclick', function(evt) {
			var element = evt.data.element;

			if (!element.isReadOnly()) {
				if (element.is('a')) {
					var role = element.getAttribute('role');
					if (role == 'res-link') {
						evt.data.dialog = 'reslinkDialog';
						editor.getSelection().selectElement(element);
					}
				}
			}
		});
	},
});
