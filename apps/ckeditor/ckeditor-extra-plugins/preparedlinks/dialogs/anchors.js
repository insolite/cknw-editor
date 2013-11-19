CKEDITOR.dialog.add('anchorsDialog', function (editor) {
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
							
							var documentSelectElement = dialog.getContentElement( 'main', 'document' );
							var anchorSelectElement = dialog.getContentElement( 'main', 'anchor' );
							anchorSelectElement.clear();
							var filepath = documentSelectElement.getValue();
							$('#sidebar-left > ul > li[path="' + filepath + '"] > a.opened').each(function (e) {
								var openedEditor = FileExplorer.getEditorByFilepath(filepath);
								var anchors = openedEditor.document.find('a');
								for (var i = 0; i < anchors.count(); i++) {
									anchor = anchors.getItem(i);
									if ( anchor.hasAttribute('name') &&
										 ( !anchor.hasAttribute( 'href' ) ||
										   anchor.getAttribute( 'href' ) == '#'
										 )
									   ) {
										anchorSelectElement.add(anchor.getText(), filepath + '#' + anchor.getAttribute('name'));
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
			
			var documentSelectElement = dialog.getContentElement( 'main', 'document' );
			documentSelectElement.clear();
			$('#sidebar-left > ul > li > a.opened').each(function (e) {
				documentSelectElement.add($(this).text(), $(this).parent().attr('path'));
			});
			documentSelectElement.fire('onChange');
		},
 		
		onOk: function() {
			editor.fire('saveSnapshot');
		},
	};
});
