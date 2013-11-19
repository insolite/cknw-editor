CKEDITOR.plugins.add('reslink', {
	requires: 'dialog',
	//icons: '',
	publish: function (html) {
		var element = $('<div>' + html + '</div>');
		element.find('a.res-link').each(function (e) {
			$(this).removeClass('res-link');
			href = $(this).attr('href');
			$(this).attr('href', FileExplorer.resources['Documents'].dir + '/' + href);
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
		if ( editor.addMenuItems ) {
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
		if ( editor.contextMenu ) {
			editor.contextMenu.addListener( function( element, selection ) {
				if ( !element || element.isReadOnly() )
					return null;

				var anchor = tryRestoreFakeAnchor( editor, element );

				if ( !anchor && !( anchor = getSelectedLink( editor ) ) )
					return null;

				var menu = {};

				if ( anchor.getAttribute( 'href' ) && anchor.getChildCount()) {
					if (anchor.hasClass('res-link')) {
						menu = { reslinkDialog: CKEDITOR.TRISTATE_OFF };
					}
				}

				//if ( anchor && anchor.hasAttribute( 'name' ) )
					//menu.anchor = menu.removeAnchor = CKEDITOR.TRISTATE_OFF;

				return menu;
			});
		}
		
		//Override listener from 'link' plugin
		editor.on( 'doubleclick', function( evt ) {
			var element = getSelectedLink( editor ) || evt.data.element;

			if ( !element.isReadOnly() ) {
				if ( element.is( 'a' ) ) {
					if (element.hasClass('res-link')) {
						evt.data.dialog = 'reslinkDialog';
						editor.getSelection().selectElement( element );
					}
				}
			}
		});
	},
});
