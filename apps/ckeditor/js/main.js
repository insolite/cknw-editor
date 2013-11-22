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
});
