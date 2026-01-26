# PowerShell script to replace green colors with blood red across all JSX files
$files = Get-ChildItem -Path "src" -Filter "*.jsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace common green color patterns with blood red equivalents
    $content = $content -replace 'bg-green-50', 'bg-blood-50'
    $content = $content -replace 'bg-green-100', 'bg-blood-100'
    $content = $content -replace 'bg-green-400', 'bg-blood-400'
    $content = $content -replace 'bg-green-500', 'bg-blood-500'
    $content = $content -replace 'bg-green-600', 'bg-blood-600'
    $content = $content -replace 'bg-green-700', 'bg-blood-700'
    
    $content = $content -replace 'text-green-50', 'text-blood-50'
    $content = $content -replace 'text-green-100', 'text-blood-100'
    $content = $content -replace 'text-green-400', 'text-blood-400'
    $content = $content -replace 'text-green-500', 'text-blood-500'
    $content = $content -replace 'text-green-600', 'text-blood-600'
    $content = $content -replace 'text-green-700', 'text-blood-700'
    $content = $content -replace 'text-green-800', 'text-blood-800'
    
    $content = $content -replace 'border-green-300', 'border-blood-300'
    $content = $content -replace 'border-green-400', 'border-blood-400'
    $content = $content -replace 'border-green-500', 'border-blood-500'
    $content = $content -replace 'border-green-600', 'border-blood-600'
    
    $content = $content -replace 'hover:bg-green-50', 'hover:bg-blood-50'
    $content = $content -replace 'hover:bg-green-600', 'hover:bg-blood-600'
    $content = $content -replace 'hover:bg-green-700', 'hover:bg-blood-700'
    
    $content = $content -replace 'hover:text-green-600', 'hover:text-blood-600'
    $content = $content -replace 'hover:text-green-700', 'hover:text-blood-700'
    
    $content = $content -replace 'hover:border-green-300', 'hover:border-blood-300'
    $content = $content -replace 'hover:border-green-400', 'hover:border-blood-400'
    $content = $content -replace 'hover:border-green-500', 'hover:border-blood-500'
    
    $content = $content -replace 'focus:border-green-400', 'focus:border-blood-400'
    $content = $content -replace 'focus:border-green-500', 'focus:border-blood-500'
    $content = $content -replace 'focus:ring-green-100', 'focus:ring-blood-100'
    $content = $content -replace 'focus:ring-green-500', 'focus:ring-blood-500'
    
    $content = $content -replace 'group-hover:text-green-500', 'group-hover:text-blood-500'
    $content = $content -replace 'group-focus-within:text-green-500', 'group-focus-within:text-blood-500'
    
    # Replace gradient patterns
    $content = $content -replace 'from-green-50', 'from-blood-50'
    $content = $content -replace 'from-green-100', 'from-blood-100'
    $content = $content -replace 'from-green-400', 'from-blood-400'
    $content = $content -replace 'from-green-500', 'from-blood-500'
    $content = $content -replace 'from-green-600', 'from-blood-600'
    
    $content = $content -replace 'via-green-500', 'via-blood-500'
    $content = $content -replace 'via-green-600', 'via-blood-600'
    $content = $content -replace 'via-emerald-500', 'via-blood-600'
    $content = $content -replace 'via-emerald-600', 'via-blood-700'
    
    $content = $content -replace 'to-green-50', 'to-blood-50'
    $content = $content -replace 'to-green-500', 'to-blood-500'
    $content = $content -replace 'to-green-600', 'to-blood-600'
    $content = $content -replace 'to-green-700', 'to-blood-700'
    $content = $content -replace 'to-teal-600', 'to-blood-700'
    $content = $content -replace 'to-teal-700', 'to-blood-800'
    $content = $content -replace 'to-emerald-50', 'to-blood-100'
    $content = $content -replace 'to-emerald-500', 'to-blood-600'
    
    Set-Content -Path $file.FullName -Value $content
}

Write-Host "Color replacement complete! Updated $($files.Count) files."
