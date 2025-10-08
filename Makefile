.PHONY: help install setup browsers test test-headed test-ui test-debug test-report codegen clean

# Default target
help:
	@echo "Available targets:"
	@echo "  make setup         - Install all dependencies and browsers (complete setup)"
	@echo "  make install       - Install npm dependencies"
	@echo "  make browsers      - Install Playwright browsers"
	@echo "  make test          - Run all tests"
	@echo "  make test-headed   - Run tests with visible browser"
	@echo "  make test-ui       - Run tests in interactive UI mode"
	@echo "  make test-debug    - Run tests in debug mode"
	@echo "  make test-report   - View HTML test report"
	@echo "  make codegen       - Generate tests using Playwright codegen"
	@echo "  make clean         - Remove node_modules and generated files"

# Complete setup - install dependencies and browsers
setup: install browsers
	@echo "✅ Setup complete! You can now run 'make test' to run the tests."

# Install npm dependencies
install:
	@echo "📦 Installing npm dependencies..."
	npm install

# Install Playwright browsers
browsers:
	@echo "🌐 Installing Playwright browsers..."
	npx playwright install

# Run all tests
test:
	@echo "🧪 Running all tests..."
	npm test

# Run tests in headed mode (see browser)
test-headed:
	@echo "🧪 Running tests in headed mode..."
	npm run test:headed

# Run tests in UI mode (interactive)
test-ui:
	@echo "🧪 Running tests in UI mode..."
	npm run test:ui

# Run tests in debug mode
test-debug:
	@echo "🧪 Running tests in debug mode..."
	npm run test:debug

# View test report
test-report:
	@echo "📊 Opening test report..."
	npm run test:report

# Generate tests using Codegen
codegen:
	@echo "🎬 Starting Playwright Codegen..."
	npm run test:codegen

# Clean up generated files and dependencies
clean:
	@echo "🧹 Cleaning up..."
	rm -rf node_modules
	rm -rf test-results
	rm -rf playwright-report
	rm -rf playwright/.cache
	@echo "✅ Cleanup complete!"
