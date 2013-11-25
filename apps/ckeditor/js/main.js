$(window).ready(function () {
	MainMenu.init();
	FileExplorer.init();
	
	$(window).resize(function () {
		//editor.maximizeHeightNow(); //is not working correctly
		var height = $(window).height() - FileExplorer.editorHeightOffset;
		var editor = FileExplorer.getCurrentEditor();
		if (editor) {
			var menu = editor.container.findOne('#menu');
			if (menu) {
				height -= 28;
			}
			FileExplorer.getCurrentEditor().resize("100%", height);
		}
	});
	
	$('#file-create-dialog').dialog({
		modal: true,
		autoOpen: false,
		title: 'File preferences',
		buttons: {
			"Cancel": function() {
				$(this).dialog("close");
			},
			"OK": function() {
				var filepath = $(this).find('form > [name="filepath"]').val();
				//TODO: check if file exists
				var filename = $(this).find('form > [name="filename"]').val();
				var group = $(this).find('form > [name="group"]').val();
				group = group == '' ? 'root' : group;
				var modes = $(this).find('form > [name="modes"]').val().split(' ').join('');
				//var filepath = $(this).find('form > [name="group"]').val();
				FileExplorer.create(filepath, filename, group, modes, '');
				$(this).dialog("close");
			},
		},
		open: function () {
			$(this).html('');
			var form = $('<form></form>');
			form.append($('<label></label>')
				.attr({
					'for': 'filepath',
				})
				.html('File path')
			);
			form.append($('<input/>')
				.attr({
					'type': 'text',
					'name': 'filepath',
				})
			);
			form.append($('<label></label>')
				.attr({
					'for': 'filename',
				})
				.html('File name')
			);
			form.append($('<input/>')
				.attr({
					'type': 'text',
					'name': 'filename',
				})
			);
			form.append($('<label></label>')
				.attr({
					'for': 'group',
				})
				.html('Group')
			);
			//TODO: select
			form.append($('<input/>')
				.attr({
					'type': 'text',
					'name': 'group',
				})
			);
			form.append($('<label></label>')
				.attr({
					'for': 'modes',
				})
				.html('Modes')
			);
			//TODO: checkbox
			form.append($('<input/>')
				.attr({
					'type': 'text',
					'name': 'modes',
				})
			);
			$(this).append(form);
		}
	});
});
