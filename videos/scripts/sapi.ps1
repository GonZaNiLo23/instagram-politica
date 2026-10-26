param([string]$TextoFile, [string]$Salida)
# Voz del sistema de Windows (PROVISIONAL). Prefiere una voz en español.
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$es = $s.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Culture.Name -like 'es-*' } | Select-Object -First 1
if (-not $es) { Write-Output 'SIN_VOZ_ES'; exit 3 }
$s.SelectVoice($es.VoiceInfo.Name)
$s.Rate = 1
$s.SetOutputToWaveFile($Salida)
$s.Speak([IO.File]::ReadAllText($TextoFile, [Text.Encoding]::UTF8))
$s.Dispose()
Write-Output $es.VoiceInfo.Name
