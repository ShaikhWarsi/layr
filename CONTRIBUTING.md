# Contributing to Layr

Thank you for your interest in contributing to Layr! We welcome contributions from the community and are excited to see what you'll bring to this AI-powered planning extension for VS Code.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [hey@manasdutta.in](mailto:hey@manasdutta.in).

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **VS Code** (for testing the extension)
- **Git** (for version control)

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/layr.git
   cd layr
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables** (optional, for AI features):
   ```bash
   cp .env.example .env
   # Edit .env and add your Gemini API key
   ```

5. **Compile the extension**:
   ```bash
   npm run compile
   ```

6. **Open in VS Code**:
   ```bash
   code .
   ```

7. **Run the extension**:
   - Press `F5` to open a new Extension Development Host window
   - Test the extension using `Ctrl+Shift+P` → "Layr: Create Plan"

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **Bug fixes** - Help us squash bugs and improve stability
- **Feature enhancements** - Add new functionality or improve existing features
- **Documentation** - Improve README, add examples, or write tutorials
- **Testing** - Add test cases or improve test coverage
- **Performance improvements** - Optimize code for better performance
- **UI/UX improvements** - Enhance user experience and interface design

### Before You Start

1. **Check existing issues** to see if your idea is already being discussed
2. **Create an issue** to discuss major changes before implementing them
3. **Look for "good first issue"** labels if you're new to the project
4. **Join our discussions** in GitHub Issues or Discussions

## Pull Request Process

### 1. Create a Branch

Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Follow our [coding standards](#coding-standards)
- Write clear, concise commit messages
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

Before submitting:

```bash
# Compile the extension
npm run compile

# Run tests (if available)
npm test

# Test manually in VS Code
# Press F5 and test your changes
```

### 4. Commit Your Changes

Use clear and descriptive commit messages:

```bash
git add .
git commit -m "feat: add support for custom templates"
# or
git commit -m "fix: resolve issue with API key validation"
```

### 5. Push and Create Pull Request

```bash
git push origin your-branch-name
```

Then create a pull request on GitHub with:

- **Clear title** describing the change
- **Detailed description** of what was changed and why
- **Screenshots** (if applicable)
- **Testing instructions** for reviewers
- **Link to related issues**

### 6. Code Review

- Be responsive to feedback
- Make requested changes promptly
- Keep discussions constructive and professional
- Update your branch if needed

## Issue Guidelines

### Reporting Bugs

When reporting bugs, please include:

- **Clear title** and description
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **VS Code version** and operating system
- **Extension version**
- **Error messages** or logs (if any)
- **Screenshots** (if helpful)

### Requesting Features

For feature requests, please provide:

- **Clear description** of the proposed feature
- **Use case** - why is this feature needed?
- **Proposed implementation** (if you have ideas)
- **Alternatives considered**
- **Additional context** or examples

### Issue Labels

We use labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

## Coding Standards

### TypeScript Guidelines

- Use **TypeScript** for all new code
- Follow **strict type checking**
- Use **meaningful variable and function names**
- Add **JSDoc comments** for public APIs
- Prefer **const** over **let** when possible

### Code Style

- Use **2 spaces** for indentation
- Use **semicolons** at the end of statements
- Use **single quotes** for strings
- Keep **line length under 100 characters**
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes and interfaces

### File Organization

```
src/
├── extension.ts          # Main extension entry point
└── planner/
    ├── index.ts         # Main planner orchestrator
    ├── ai.ts            # AI integration (Gemini)
    ├── rules.ts         # Template/rule-based planning
    └── interfaces.ts    # TypeScript interfaces
```

### Example Code Style

```typescript
interface PlanRequest {
  description: string;
  useAI: boolean;
  apiKey?: string;
}

export class PlanGenerator {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generates a project plan based on the provided description
   * @param request - The plan generation request
   * @returns Promise resolving to the generated plan
   */
  public async generatePlan(request: PlanRequest): Promise<string> {
    // Implementation here
  }
}
```

## Testing

### Manual Testing

1. **Install the extension** locally using `F5`
2. **Test core functionality**:
   - Plan generation with AI
   - Plan generation without AI (templates)
   - Error handling
   - Settings configuration

3. **Test edge cases**:
   - Invalid API keys
   - Network failures
   - Large plan descriptions
   - Special characters in input

### Automated Testing

We encourage adding automated tests:

```bash
# Run existing tests
npm test

# Add new test files in __tests__ directory
# Follow existing test patterns
```

## Documentation

### Code Documentation

- Add **JSDoc comments** for all public functions and classes
- Include **parameter descriptions** and **return types**
- Provide **usage examples** for complex functions

### User Documentation

- Update **README.md** for user-facing changes
- Add **examples** for new features
- Update **configuration instructions** if needed

### Inline Comments

- Explain **complex logic** or **business rules**
- Avoid **obvious comments**
- Use comments to explain **why**, not **what**

## Community

### Getting Help

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and general discussion
- **Email** - [hey@manasdutta.in](mailto:hey@manasdutta.in) for private matters

### Stay Updated

- **Watch** the repository for notifications
- **Star** the project if you find it useful
- **Follow** [@manasdutta04](https://github.com/manasdutta04) for updates

### Recognition

Contributors will be:

- **Listed** in our contributors section
- **Mentioned** in release notes for significant contributions
- **Thanked** publicly for their efforts

## Development Tips

### Debugging

- Use **VS Code debugger** with the provided launch configuration
- Add **console.log** statements for debugging
- Check **VS Code Developer Tools** (Help → Toggle Developer Tools)

### Extension Development

- **Reload** the extension host window after changes (`Ctrl+R`)
- **Check output panel** for extension logs
- **Use breakpoints** in TypeScript code for debugging

### Performance

- **Minimize API calls** to external services
- **Cache results** when appropriate
- **Use async/await** for non-blocking operations
- **Handle errors gracefully**

## Release Process

For maintainers:

1. **Update version** in `package.json`
2. **Update CHANGELOG.md** with new features and fixes
3. **Create release notes** on GitHub
4. **Publish to marketplace** using `vsce publish`

## Questions?

If you have any questions about contributing, please:

1. **Check existing issues** and documentation first
2. **Create a new issue** with the "question" label
3. **Reach out** via email if needed

Thank you for contributing to Layr! Your efforts help make this tool better for developers worldwide. 🚀