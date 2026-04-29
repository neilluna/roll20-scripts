$resumeFile = ".claude\last-session-id.txt"

if (Test-Path $resumeFile) {
    $sessionId = Get-Content $resumeFile
    claude --resume $sessionId
} else {
    claude
}
