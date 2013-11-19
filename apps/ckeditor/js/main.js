$(window).ready(function () {
	//TODO: move to common mode
	getSelectedLink = function( editor ) {
		var selection = editor.getSelection();
		var selectedElement = selection.getSelectedElement() || selection.getStartElement();
		if ( selectedElement && selectedElement.is( 'a' ) ) {
			return selectedElement;
		}
	
		var range = selection.getRanges( true )[ 0 ];
	
		if ( range ) {
			range.shrink( CKEDITOR.SHRINK_TEXT );
			return editor.elementPath( range.getCommonAncestor() ).contains( 'a', 1 );
		}
		return null;
	},
	//TODO: move to common mode
	tryRestoreFakeAnchor = function( editor, element ) {
		if ( element && element.data( 'cke-real-element-type' ) && element.data( 'cke-real-element-type' ) == 'anchor' ) {
			var link = editor.restoreRealElement( element );
			if ( link.data( 'cke-saved-name' ) )
				return link;
		}
	},
	
	MainMenu.init();
	FileExplorer.init();
	
	$(window).resize(function () {
		FileExplorer.getCurrentEditor().resize("100%", $(window).height() - FileExplorer.editorHeightOffset);
	});
});
