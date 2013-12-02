::Variables
set project_name=cknw-editor
set platform=windows

::Dir variables
set dir_build_tools=%~dp0
set dir_project=%dir_build_tools%\..\..
set dir_builds=%dir_project%\build
set dir_build=%dir_builds%\%project_name%-%platform%

::Clean up
rmdir /s /q %dir_build%
