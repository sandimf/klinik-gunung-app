# Contributing to Klinik Gunung

Thank you for your interest in contributing to Klinik Gunung! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

### Reporting Issues
- Check existing issues before creating a new one
- Use the appropriate issue template
- Provide clear steps to reproduce
- Include system information and logs when relevant

### Suggesting Features
- Open a feature request issue
- Describe the problem you're trying to solve
- Explain your proposed solution
- Consider backward compatibility

### Code Contributions
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🔧 Development Setup

### Prerequisites
- PHP >= 8.2
- Node.js >= 18.x
- Composer
- MySQL/SQLite

### Local Environment
```bash
# Clone your fork
git clone https://github.com/your-username/klinik-gunung.git
cd klinik-gunung

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Setup database
php artisan migrate --seed

# Start development servers
composer run dev
```

## 📏 Code Standards

### PHP (Laravel)
- Follow PSR-12 coding standards
- Use meaningful variable and method names
- Write comprehensive PHPDoc comments
- Follow Laravel naming conventions

### JavaScript/React
- Use ES6+ features
- Follow React Hooks best practices
- Use TypeScript-style JSDoc when helpful
- Prefer functional components

### CSS/Tailwind
- Use Tailwind utility classes
- Follow mobile-first approach
- Maintain consistent spacing and colors
- Use semantic class names for components

## 🧪 Testing

### Running Tests
```bash
# PHP tests
php artisan test

# Test specific feature
php artisan test --filter=PatientTest

# Generate coverage
php artisan test --coverage
```

### Writing Tests
- Write tests for new features
- Include both unit and feature tests
- Test edge cases and error conditions
- Maintain good test coverage

## 📝 Pull Request Process

### Before Submitting
1. Update documentation if needed
2. Run all tests and ensure they pass
3. Check code style compliance
4. Update CHANGELOG.md if applicable

### PR Requirements
- Clear, descriptive title
- Detailed description of changes
- Reference related issues
- Include testing information

### Review Process
1. Automated checks must pass
2. Code review by maintainers
3. Testing by reviewers
4. Approval and merge

## 🎨 UI/UX Guidelines

### Design Principles
- Clean, professional medical interface
- Accessibility-first approach
- Mobile-responsive design
- Consistent user experience

### Component Guidelines
- Use existing Shadcn/UI components
- Follow established patterns
- Maintain consistent spacing
- Include proper loading states

## 🔐 Security Guidelines

### Code Security
- Validate all user inputs
- Use prepared statements
- Implement proper authentication
- Follow OWASP guidelines

### Medical Data
- Encrypt sensitive information
- Implement audit trails
- Follow healthcare compliance
- Respect patient privacy

## 📚 Documentation

### Code Documentation
- Write clear comments
- Document complex logic
- Include usage examples
- Update API documentation

### User Documentation
- Update README for new features
- Include screenshot for UI changes
- Write clear installation steps
- Maintain troubleshooting guide

## 🐛 Debugging

### Common Tools
- Laravel Telescope for debugging
- Browser DevTools for frontend
- Laravel Debugbar for development
- Xdebug for PHP debugging

### Logging
- Use appropriate log levels
- Include context information
- Avoid logging sensitive data
- Follow Laravel logging practices

## 🌐 Internationalization

### Adding Translations
- Use Laravel localization
- Add translations for new text
- Test with different locales
- Consider RTL languages

### Best Practices
- Use translation keys consistently
- Avoid hardcoded strings
- Consider pluralization
- Test with long translations

## 📦 Dependencies

### Adding Dependencies
- Justify new dependencies
- Check for security vulnerabilities
- Consider bundle size impact
- Update lock files

### Updating Dependencies
- Test thoroughly after updates
- Check for breaking changes
- Update documentation
- Consider compatibility

## 🚀 Release Process

### Version Numbering
- Follow Semantic Versioning
- Document breaking changes
- Update version in relevant files
- Tag releases properly

### Changelog
- Document all changes
- Categorize by type (Added, Changed, Fixed)
- Include migration notes
- Credit contributors

## 👥 Community

### Communication
- Be respectful and professional
- Help others in discussions
- Share knowledge and experience
- Follow code of conduct

### Getting Help
- Check documentation first
- Search existing issues
- Ask in discussions
- Contact maintainers

## 📊 Performance

### Best Practices
- Optimize database queries
- Minimize API calls
- Use caching appropriately
- Profile before optimizing

### Monitoring
- Include performance metrics
- Monitor memory usage
- Check for N+1 queries
- Test with realistic data

## 🔄 Continuous Integration

### Automated Checks
- Code style validation
- Test suite execution
- Security vulnerability scanning
- Dependency analysis

### Quality Gates
- All tests must pass
- Code coverage thresholds
- No security vulnerabilities
- Performance benchmarks

## 💡 Tips for Contributors

### First-Time Contributors
- Start with small issues
- Read existing code
- Ask questions when unsure
- Follow established patterns

### Regular Contributors
- Help review PRs
- Mentor new contributors
- Improve documentation
- Suggest improvements

## 📋 Checklist Template

### For Pull Requests
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code style checked
- [ ] Breaking changes documented
- [ ] Changelog updated
- [ ] Security implications considered

### For Issues
- [ ] Clear description
- [ ] Steps to reproduce
- [ ] Expected behavior
- [ ] Actual behavior
- [ ] Environment details
- [ ] Related issues linked

## 📞 Contact

- **General Questions**: GitHub Discussions
- **Bug Reports**: GitHub Issues
- **Security Issues**: security@klinikgunung.com
- **Feature Requests**: GitHub Issues

Thank you for contributing to Klinik Gunung! 🏥
