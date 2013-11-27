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
set dir_node_webkit=%dir_project%\node-webkit\%platform%

::Initial setup
mkdir %dir_builds%
mkdir %dir_build%
mkdir %dir_build_tmp%

::Project specific block begin

::Generate links for new extra ckeditor plugins
cd %dir_source%\ckeditor\plugins
for /f %plugin% in ('dir /b %dir_source%\ckeditor-extra-plugins') do (
	del %plugin%
	mklink /d %plugin% %dir_source%\ckeditor-extra-plugins\%plugin%
)

::Resolve links (required for windows only)
echo D | xcopy /s /e /q %dir_source% %dir_build_tmp%
cd %dir_build_tmp%\%dir_source%\ckeditor-extra-plugins
for /f %plugin% in ('dir /b') do (
	del %dir_build_tmp%\%dir_source%\ckeditor\plugins\%plugin%
	move %plugin% %dir_build_tmp%\%dir_source%\ckeditor\plugins
)

::Project specific block end

::Zip application
cd %dir_build_tmp%\%dir_source%
%dir_build_tools%\7za.exe a -tzip %dir_buil_tmp%\ckeditor.nw *

::Pack application with node-webkit
copy /b %dir_node_webkit%\nw.exe+%dir_build_tmp%\%project_name%.nw %dir_build%\%executable%

::Copy additional node-webkit files
copy %dir_node_webkit%\nw.pak %dir_build%
copy %dir_node_webkit%\icudt.dll %dir_build%

::Clean up
rmdir /s /e %dir_build_tmp%

::Run application
set run=%dir_build%\%executable%
set args=c:\Users\oleg\My Documents\projects\emergency_sunpp
%run% %args%

