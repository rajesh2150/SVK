@ECHO OFF
SETLOCAL
SET DIR=%~dp0
IF NOT EXIST "%DIR%.mvn\wrapper\maven-wrapper.jar" (
  ECHO Maven wrapper JAR not found. Please run 'mvn -N wrapper:wrapper' or download it manually.
  EXIT /B 1
)
java -classpath "%DIR%.mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*
