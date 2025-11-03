# Rename Jhumka images script
# Places: expects original images in images\large\
# Output: images\large\jhumka1.jpg ... jhumka12.jpg (will back up originals to _backup)

$src = "images\large"
if (-not (Test-Path $src)) {
    Write-Host "Source folder '$src' not found. Please create it and put your images there." -ForegroundColor Red
    exit 1
}

$backup = Join-Path $src "_backup"
New-Item -ItemType Directory -Force -Path $backup | Out-Null

# Collect image files (jpg/jpeg/png)
$files = Get-ChildItem -Path $src -Include *.jpg,*.jpeg,*.png -File | Where-Object { $_.DirectoryName -ne $backup } | Sort-Object LastWriteTime

if ($files.Count -eq 0) {
    Write-Host "No image files found in $src. Place your product images there and run this script again." -ForegroundColor Yellow
    exit 1
}

# Move originals to backup to avoid name collisions
foreach ($f in $files) {
    $dest = Join-Path $backup $f.Name
    Move-Item -Path $f.FullName -Destination $dest -Force
}

# Re-list backed up files and map to jhumka1..jhumka12
$backed = Get-ChildItem -Path $backup -Include *.jpg,*.jpeg,*.png -File | Sort-Object LastWriteTime

$index = 1
foreach ($f in $backed) {
    if ($index -gt 12) { break }
    $ext = $f.Extension.ToLower()
    $newName = "jhumka$index$ext"
    $newPath = Join-Path $src $newName
    Copy-Item -Path $f.FullName -Destination $newPath -Force
    Write-Host "Created: $newName"
    $index++
}

Write-Host "Done. Created $($index - 1) files in $src with names jhumka1..jhumka$($index - 1)." -ForegroundColor Green
Write-Host "Originals are saved in: $backup" -ForegroundColor Cyan

# Optional: remind about logo
Write-Host "\nRemember to place your logo file as images\logo.png (black background with gold Hindu-inspired decoration) so it displays correctly in the header." -ForegroundColor Yellow
