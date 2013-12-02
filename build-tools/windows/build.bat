::Variables
set project_name=cknw-editor
set platform=windows
set executable=%project_name%.exe

::Dir variables
set dir_build_tools=%~dp0
set dir_project=%dir_build_tools%\..\..
set dir_builds=%dir_project%\build
set dir_build=%dir_builds%\%project_name%-%platform%
set dir_build_tmp=%dir_build%\tmp
set dir_source=%dir_project%\%project_name%
set dir_tmp_source=%dir_build_tmp%\%project_name%
set dir_node_webkit=%dir_project%\node-webkit\%platform%

::Remove previous build
call %dir_build_tools%\clean.bat

::Initial setup
mkdir %dir_builds%
mkdir %dir_build%
mkdir %dir_build_tmp%

::Project specific block begin

::TODO: moving instead of link generation
::Generate links for new extra ckeditor plugins
cd %dir_source%\ckeditor\plugins
for /f %%p in ('dir /b %dir_source%\ckeditor-extra-plugins') do (
	rmdir %%p
	mklink /d %%p %dir_source%\ckeditor-extra-plugins\%%p
)

::Resolve links (required for windows only)
echo D | xcopy /s /e /q %dir_source% %dir_tmp_source%
cd %dir_tmp_source%\ckeditor-extra-plugins
for /f %%p in ('dir /b') do (
	rmdir /s /q %dir_tmp_source%\ckeditor\plugins\%%p
	move %%p %dir_tmp_source%\ckeditor\plugins
)

::Project specific block end

::Zip application
cd %dir_tmp_source%
%dir_build_tools%\7za.exe a -tzip %dir_build_tmp%\%project_name%.nw *

::Pack application with node-webkit
copy /b %dir_node_webkit%\nw.exe+%dir_build_tmp%\%project_name%.nw %dir_build%\%executable%

::Copy additional node-webkit files
copy %dir_node_webkit%\nw.pak %dir_build%
copy %dir_node_webkit%\icudt.dll %dir_build%

::Clean up
cd %dir_build_tools%
rmdir /s /q %dir_build_tmp%
