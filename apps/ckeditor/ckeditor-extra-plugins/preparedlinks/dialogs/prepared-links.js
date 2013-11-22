CKEDITOR.dialog.add('preparedLinksDialog', function (editor) {
	return {
		title : 'Link Selection',
		minWidth : 400,
		minHeight : 200,
		maxWidth : 500,
		maxHeight : 300,
 		
		contents :
		[
			{
				id : 'main',
				label : 'Settings',
				elements :
				[
					{
						type : 'select',
						id : 'plink',
						label : 'Prepared link',
						items: [],
						//'default': items[0][1],
					},
				]
			}
		],
		
		onShow: function () {
			var dialog = this;
			var preparedLinks = [];
			
			var selectElement = dialog.getContentElement('main', 'plink');
			selectElement.clear();
			$('#sidebar-left > ul > li > a.opened').each(function (e) {
				var filepath = $(this).parent().attr('path');
				var openedEditor = FileExplorer.getEditorByFilepath($(this).parent().attr('path'));
				var links = openedEditor.document.find('a[role="prepared-link"]');
				for (var i = 0; i < links.count(); i++) {
					link = links.getItem(i);
					//console.log(filepath + '#' + link.getAttribute('id'));
					selectElement.add(link.getText(), filepath + '#' + link.getAttribute('id')); //TODO: print filepath
				}
			});
 		},
 		
		onOk: function() {
			var selection = editor.getSelection();
			var element = selection.getSelectedElement() || selection.getStartElement();
			if (element) {
				editor.fire('saveSnapshot');
				var dialog = this;
				var plinkInfo = dialog.getValueOf('main', 'plink').split('#');
				var page = plinkInfo[0];
				var linkId = plinkInfo[1];
				var linkEditor = FileExplorer.getEditorByFilepath(page);
				var link = linkEditor.document.find('a[role="prepared-link"]#' + linkId).getItem(0);
				var selection = editor.getSelection();
				var element = selection.getSelectedElement() || selection.getStartElement();
				var page = $('#sidebar-left').find('ul > li > a.current').parent().attr('path');
				//link.$.removeAttribute('data-cke-saved-href'); //href won't assign without it
				link.setAttribute('href', page + '#' + element.getAttribute('name'));
				link.removeAttribute('role');
				link.removeAttribute('id');
			}
		},
	};
});
