@echo off
setlocal

REM 获取当前批处理脚本的路径
set "scriptPath=%~dp0"

REM 构建目标启动目录的路径
set "startupFolder=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

REM 构建新 .bat 文件的路径
set "startupScript=%startupFolder%\MyStartupScript.bat"

REM 写入启动脚本内容
echo @echo off > "%startupScript%"
echo cd /d "%scriptPath%" >> "%startupScript%"
echo start "MyApp" "yourapp.exe" >> "%startupScript%"

REM 添加到开机启动，但不启动 .exe 文件
copy /y nul "%startupScript%"

exit