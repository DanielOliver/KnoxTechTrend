SET ARMOutput=%1
ECHO %ARMOutput%
set temp=%ARMOutput:"="""%
ECHO %temp%
powershell -File ./extra_steps.ps1 ""%temp%""