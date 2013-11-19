CKEDITOR.plugins.add('resimage', {
	requires: 'dialog',
	//icons: '',
	publish: function (html) {
		var element = $('<div>' + html + '</div>');
		element.find('img.res-image').each(function (e) {
			$(this).removeClass('res-image');
			$(this).removeAttr('filename');
			
			//src = $(this).attr('src');
			//$(this).attr('src', FileExplorer.resources['Images'].dir + '/' + src);
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
		if ( editor.addMenuItems ) {
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
		if ( editor.contextMenu ) {
			editor.contextMenu.addListener( function( element, selection ) {
				var selection = editor.getSelection();
				var selectedElement = selection.getSelectedElement() || selection.getStartElement();
				var menu = {};
				if (selectedElement) {
					if (!selectedElement.isReadOnly()) {
						if (selectedElement.hasClass('res-image')) {
							menu = { resimageDialog: CKEDITOR.TRISTATE_OFF };
						}
					}
				}
				return menu;
			});
		}
		
		editor.on( 'doubleclick', function( evt ) {
			var element = getSelectedLink( editor ) || evt.data.element;

			if ( !element.isReadOnly() ) {
				if ( element.is( 'img' ) ) {
					if (element.hasClass('res-image')) {
						evt.data.dialog = 'resimageDialog';
						editor.getSelection().selectElement( element );
					}
				}
			}
		});
	},
});
