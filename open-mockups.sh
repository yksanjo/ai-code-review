#!/bin/bash

# Script to open mockups in browser for screenshot capture

echo "🎨 Opening AI Developer Tools Mockups..."
echo ""
echo "Choose an option:"
echo "  1) Open index page (all mockups)"
echo "  2) AI Code Review Assistant"
echo "  3) API Documentation Generator"
echo "  4) Smart Git Commit Generator"
echo "  5) Dev Environment Setup"
echo "  6) Codebase Question Answerer"
echo "  7) Error Message Translator"
echo "  8) Test Case Generator"
echo ""
read -p "Enter choice (1-8): " choice

MOCKUPS_DIR="$(cd "$(dirname "$0")" && pwd)/mockups"

case $choice in
    1)
        open "$MOCKUPS_DIR/index.html"
        ;;
    2)
        open "$MOCKUPS_DIR/1-ai-code-review.html"
        ;;
    3)
        open "$MOCKUPS_DIR/2-api-docs.html"
        ;;
    4)
        open "$MOCKUPS_DIR/3-git-commit.html"
        ;;
    5)
        open "$MOCKUPS_DIR/4-dev-setup.html"
        ;;
    6)
        open "$MOCKUPS_DIR/5-codebase-qa.html"
        ;;
    7)
        open "$MOCKUPS_DIR/6-error-translator.html"
        ;;
    8)
        open "$MOCKUPS_DIR/7-test-generator.html"
        ;;
    *)
        echo "Invalid choice. Opening index page..."
        open "$MOCKUPS_DIR/index.html"
        ;;
esac

echo ""
echo "✅ Mockup opened in browser!"
echo ""
echo "📸 To take screenshots:"
echo "   Mac: Cmd+Shift+4 (select area) or Cmd+Shift+3 (full screen)"
echo "   Save to: mockups/screenshots/"
echo ""

