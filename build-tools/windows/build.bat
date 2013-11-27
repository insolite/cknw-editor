set /p project_name="cknw-editor"
set /p platform="windows"
set /p executable="%%project_name"

set dir_build_tools=%CD%
set /p dir_project="%%dir_build_tools\..\.."
set /p dir_builds="%%dir_project\build"
set /p dir_build="%%dir_builds\%%project_name-%%platform"
set /p dir_build_tmp="%%dir_build\tmp"
set /p dir_source="%%dir_project\%%project_name"
set /p dir_node_webkit="%%dir_project\node-webkit\%%platform"

mkdir %%dir_builds
mkdir %%dir_build
mkdir %%dir_build_tmp

::Generate links for new extra ckeditor plugins
cd %%dir_source\ckeditor\plugins
for /f %%plugin in ('dir /b %%dir_source\ckeditor-extra-plugins') do (
	del %%plugin
	mklink /d %%plugin %%dir_source\ckeditor-extra-plugins\%%plugin
)

::Resolve links (required for windows only)
echo D | xcopy /s /e /q %%dir_source %%dir_build_tmp
cd %%dir_build_tmp\%%dir_source\ckeditor-extra-plugins
for /f %%plugin in ('dir /b') do (
	del %%dir_build_tmp\%%dir_source\ckeditor\plugins\%%plugin
	move %%plugin %%dir_build_tmp\%%dir_source\ckeditor\plugins
)

::Zip application
cd %%dir_build_tmp\%%dir_source
%%dir_build_tools\7za.exe a -tzip %%dir_buil_tmp\ckeditor.zip *

::Pack application with node-webkit
copy /b %%dir_node_webkit\nw.exe+%%dir_build_tmp\%%project_name.nw %%dir_build\%%executable
copy %%dir_node_webkit\nw.pak %%dir_build

set /p run="%%dir_build\%%executable"
set /p args="c:\Users\oleg\My Documents\projects\emergency_sunpp"
%%run %%args

