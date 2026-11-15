@echo off
setlocal
set "ROOT=%~dp0.."
set "VENV_PY=%ROOT%\.venv\Scripts\python.exe"

if not exist "%VENV_PY%" (
  where py >nul 2>nul
  if not errorlevel 1 (
    py -3 -m venv "%ROOT%\.venv"
  ) else (
    where python >nul 2>nul
    if errorlevel 1 (
      echo Python 3 is not installed or is not on PATH.
      echo Install Python 3.10 or newer, then run this script again.
      exit /b 1
    )
    python -m venv "%ROOT%\.venv"
  )
)

if errorlevel 1 (
  echo Failed to create the virtual environment.
  exit /b 1
)

"%VENV_PY%" -m unittest discover -v
exit /b %ERRORLEVEL%
