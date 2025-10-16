# Read the content file
$contentFile = "d:\winsurf\strongpasspro-dev\pages\Understanding1224WordRecoveryPhrasesCompleteG-content.html"
$content = [System.IO.File]::ReadAllText($contentFile)

# Extract Conclusion section (case insensitive match)
$conclusionPattern = '(?si)(<h2[^>]*>\s*Conclusion\s*</h2>.*?)(?=<h2|$)'
$conclusionMatch = [regex]::Match($content, $conclusionPattern)
$conclusionSection = $conclusionMatch.Groups[1].Value

# Remove the original conclusion section
$content = $content -replace $conclusionPattern, ''

# Find the FAQ section and insert conclusion before it
$faqPattern = '(?si)(<h2[^>]*>\s*Frequently Asked Questions\s*</h2>)'
if ($content -match $faqPattern) {
    $content = $content -replace $faqPattern, "$conclusionSection`n`n$($matches[1])"
    
    # Save the modified content
    [System.IO.File]::WriteAllText($contentFile, $content, [System.Text.Encoding]::UTF8)
    "Sections reordered successfully. Conclusion moved above FAQ section."
} else {
    "Could not find FAQ section to reorder. File remains unchanged."
}
