@REM @echo off
@REM setlocal

@REM REM 获取当前批处理脚本的路径
@REM set "scriptPath=%~dp0"

@REM REM 构建目标启动目录的路径
@REM set "startupFolder=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

@REM REM 构建新 .bat 文件的路径
@REM set "startupScript=%startupFolder%\MyStartupScript.bat"

@REM REM 写入启动脚本内容
@REM echo @echo off > "%startupScript%"
@REM echo cd /d "%scriptPath%" >> "%startupScript%"
@REM echo start "MyApp" "yourapp.exe" >> "%startupScript%"

@REM REM 添加到开机启动，但不启动 .exe 文件
@REM copy /y nul "%startupScript%"

@REM exit