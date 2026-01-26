# PowerShell script to replace blue and indigo colors with blood red across all JSX files
$files = Get-ChildItem -Path "src" -Filter "*.jsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace blue color patterns with blood red equivalents
    $content = $content -replace 'bg-blue-50', 'bg-blood-50'
    $content = $content -replace 'bg-blue-100', 'bg-blood-100'
    $content = $content -replace 'bg-blue-400', 'bg-blood-400'
    $content = $content -replace 'bg-blue-500', 'bg-blood-500'
    $content = $content -replace 'bg-blue-600', 'bg-blood-600'
    $content = $content -replace 'bg-blue-700', 'bg-blood-700'
    
    $content = $content -replace 'text-blue-50', 'text-blood-50'
    $content = $content -replace 'text-blue-100', 'text-blood-100'
    $content = $content -replace 'text-blue-400', 'text-blood-400'
    $content = $content -replace 'text-blue-500', 'text-blood-500'
    $content = $content -replace 'text-blue-600', 'text-blood-600'
    $content = $content -replace 'text-blue-700', 'text-blood-700'
    $content = $content -replace 'text-blue-800', 'text-blood-800'
    
    $content = $content -replace 'border-blue-300', 'border-blood-300'
    $content = $content -replace 'border-blue-400', 'border-blood-400'
    $content = $content -replace 'border-blue-500', 'border-blood-500'
    $content = $content -replace 'border-blue-600', 'border-blood-600'
    
    $content = $content -replace 'hover:bg-blue-50', 'hover:bg-blood-50'
    $content = $content -replace 'hover:bg-blue-100', 'hover:bg-blood-100'
    $content = $content -replace 'hover:bg-blue-600', 'hover:bg-blood-600'
    $content = $content -replace 'hover:bg-blue-700', 'hover:bg-blood-700'
    
    $content = $content -replace 'hover:text-blue-600', 'hover:text-blood-600'
    $content = $content -replace 'hover:text-blue-700', 'hover:text-blood-700'
    
    $content = $content -replace 'hover:border-blue-300', 'hover:border-blood-300'
    $content = $content -replace 'hover:border-blue-400', 'hover:border-blood-400'
    $content = $content -replace 'hover:border-blue-500', 'hover:border-blood-500'
    
    $content = $content -replace 'focus:border-blue-400', 'focus:border-blood-400'
    $content = $content -replace 'focus:border-blue-500', 'focus:border-blood-500'
    $content = $content -replace 'focus:ring-blue-100', 'focus:ring-blood-100'
    $content = $content -replace 'focus:ring-blue-500', 'focus:ring-blood-500'
    
    # Replace gradient patterns
    $content = $content -replace 'from-blue-50', 'from-blood-50'
    $content = $content -replace 'from-blue-100', 'from-blood-100'
    $content = $content -replace 'from-blue-400', 'from-blood-400'
    $content = $content -replace 'from-blue-500', 'from-blood-500'
    $content = $content -replace 'from-blue-600', 'from-blood-600'
    
    $content = $content -replace 'via-blue-500', 'via-blood-500'
    $content = $content -replace 'via-blue-600', 'via-blood-600'
    
    $content = $content -replace 'to-blue-50', 'to-blood-50'
    $content = $content -replace 'to-blue-500', 'to-blood-500'
    $content = $content -replace 'to-blue-600', 'to-blood-600'
    $content = $content -replace 'to-blue-700', 'to-blood-700'
    
    # Replace indigo color patterns with blood red equivalents
    $content = $content -replace 'bg-indigo-50', 'bg-blood-50'
    $content = $content -replace 'bg-indigo-100', 'bg-blood-100'
    $content = $content -replace 'bg-indigo-400', 'bg-blood-400'
    $content = $content -replace 'bg-indigo-500', 'bg-blood-500'
    $content = $content -replace 'bg-indigo-600', 'bg-blood-600'
    $content = $content -replace 'bg-indigo-700', 'bg-blood-700'
    
    $content = $content -replace 'text-indigo-50', 'text-blood-50'
    $content = $content -replace 'text-indigo-100', 'text-blood-100'
    $content = $content -replace 'text-indigo-400', 'text-blood-400'
    $content = $content -replace 'text-indigo-500', 'text-blood-500'
    $content = $content -replace 'text-indigo-600', 'text-blood-600'
    $content = $content -replace 'text-indigo-700', 'text-blood-700'
    
    $content = $content -replace 'hover:bg-indigo-700', 'hover:bg-blood-700'
    $content = $content -replace 'hover:text-indigo-600', 'hover:text-blood-600'
    
    $content = $content -replace 'from-indigo-500', 'from-blood-500'
    $content = $content -replace 'from-indigo-600', 'from-blood-600'
    $content = $content -replace 'via-indigo-500', 'via-blood-500'
    $content = $content -replace 'via-indigo-600', 'via-blood-600'
    $content = $content -replace 'to-indigo-600', 'to-blood-600'
    $content = $content -replace 'to-indigo-700', 'to-blood-700'
    
    Set-Content -Path $file.FullName -Value $content
}

Write-Host "Blue and indigo color replacement complete! Updated $($files.Count) files."
