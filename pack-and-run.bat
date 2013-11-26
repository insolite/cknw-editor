del ckeditor.exe

rmdir /s /q build

echo D | xcopy /s /e /q apps build

cd build/ckeditor/ckeditor-extra-plugins
for /f %%f in ('dir /b') do (
	del ../ckeditor/plugins/%%f
	move %%f ../ckeditor/plugins/%%f
)
cd ..
rmdir ckeditor-extra-plugins
..\..\7za.exe a -tzip ..\..\ckeditor.zip *
cd ..\..
rmdir /s /q build

copy /b nw.exe+ckeditor.zip ckeditor.exe
del ckeditor.zip
ckeditor.exe "c:\Users\oleg\My Documents\projects\emergency_sunpp"
