@echo off
setlocal
set "ROOT=%~dp0"
set "MAVEN_DIR=%ROOT%apache-maven-3.9.9"
set "MAVEN_BIN=%MAVEN_DIR%\bin\mvn.cmd"
set "MAVEN_ZIP=%ROOT%apache-maven-3.9.9-bin.zip"

if not exist "%MAVEN_BIN%" (
  if not exist "%MAVEN_ZIP%" (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip' -OutFile '%MAVEN_ZIP%'"
  )
  if not exist "%MAVEN_DIR%" (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%ROOT%' -Force"
  )
)

if not exist "%MAVEN_BIN%" (
  echo Maven installation failed. Please check your network connection and try again.
  exit /b 1
)

"%MAVEN_BIN%" %*
exit /b %ERRORLEVEL%
