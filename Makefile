.PHONY: help install setup browsers test test-headed test-ui test-debug test-report codegen clean test-data test-data-filtered test-data-cli

# Default target
help:
	@echo "Available targets:"
	@echo "  make setup              - Install all dependencies and browsers (complete setup)"
	@echo "  make install            - Install npm dependencies"
	@echo "  make browsers           - Install Playwright browsers"
	@echo "  make test               - Run all tests"
	@echo "  make test-headed        - Run tests with visible browser"
	@echo "  make test-ui            - Run tests in interactive UI mode"
	@echo "  make test-debug         - Run tests in debug mode"
	@echo "  make test-report        - View HTML test report"
	@echo "  make codegen            - Generate tests using Playwright codegen"
	@echo "  make test-data          - Run data-driven tests from CSV"
	@echo "  make test-data-filtered - Run filtered data-driven tests"
	@echo "  make test-data-cli      - Run data-driven test with CLI params"
	@echo "  make clean              - Remove node_modules and generated files"

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

# Run data-driven tests from CSV
test-data:
	@echo "📊 Running data-driven tests from CSV..."
	npx playwright test data-driven.spec.ts

# Run filtered data-driven tests (specific story)
test-data-filtered:
	@echo "📊 Running filtered data-driven tests..."
	npx playwright test data-driven.spec.ts --grep "User Registration"

# Run data-driven test with custom parameters via environment variables
# Example: make test-data-cli STORY="My Story" RULE="My Rule" MIN=1 MAX=100
test-data-cli:
	@echo "📊 Running data-driven test with custom parameters..."
	@if [ -z "$(STORY)" ]; then \
		echo "Usage: make test-data-cli STORY=\"My Story\" RULE=\"My Rule\" MIN=1 MAX=100"; \
		echo "Running with default CSV data..."; \
		npx playwright test data-driven-cli.spec.ts; \
	else \
		TEST_STORY="$(STORY)" TEST_RULE="$(RULE)" TEST_MIN=$(MIN) TEST_MAX=$(MAX) npx playwright test data-driven-cli.spec.ts; \
	fi

# Clean up generated files and dependencies
clean:
	@echo "🧹 Cleaning up..."
	rm -rf node_modules
	rm -rf test-results
	rm -rf playwright-report
	rm -rf playwright/.cache
	@echo "✅ Cleanup complete!"
