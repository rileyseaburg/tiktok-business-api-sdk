# Publishing Guide

This guide explains how to publish the TypeScript SDK to GitHub Packages.

## Prerequisites

1. **GitHub Personal Access Token** with `write:packages` permission
   - Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - Create a new token with `write:packages` and `read:packages` permissions
   - Save the token securely

2. **Repository Access**
   - You must have write access to the `rileyseaburg/tiktok-business-api-sdk` repository
   - The package is scoped to `@rileyseaburg`

## Publishing Methods

### Method 1: Automated Publishing (Recommended)

**Via GitHub Releases:**
1. Create a new release on GitHub
2. Tag the release with format: `typescript-sdk-vX.Y.Z`
3. GitHub Actions will automatically build and publish

**Via Manual Workflow Trigger:**
1. Go to [GitHub Actions](https://github.com/rileyseaburg/tiktok-business-api-sdk/actions)
2. Select "Publish TypeScript SDK to GitHub Packages"
3. Click "Run workflow"
4. Choose version bump type (patch/minor/major)
5. Click "Run workflow"

### Method 2: Local Publishing

**Setup:**
```bash
cd typescript_sdk
export NODE_AUTH_TOKEN="your_github_token_here"
```

**Using the publish script:**
```bash
node publish.js
```

**Manual steps:**
```bash
# 1. Clean and build
npm run clean
npm run build

# 2. Run quality checks
npm run type-check
npm run lint
npm run test

# 3. Bump version (optional)
npm version patch  # or minor/major

# 4. Publish
npm publish
```

## Installation for Users

Once published, users can install the package:

```bash
# First, configure npm to use GitHub Packages for @rileyseaburg scope
echo "@rileyseaburg:registry=https://npm.pkg.github.com" >> ~/.npmrc

# Install the package
npm install @rileyseaburg/tiktok-business-api-sdk
```

Or with authentication for private packages:
```bash
npm login --scope=@rileyseaburg --registry=https://npm.pkg.github.com
npm install @rileyseaburg/tiktok-business-api-sdk
```

## Versioning Strategy

We follow [Semantic Versioning](https://semver.org/):

- **PATCH** (2.0.1): Bug fixes, documentation updates
- **MINOR** (2.1.0): New features, backward compatible changes
- **MAJOR** (3.0.0): Breaking changes

## Package Configuration

The package is configured with:
- **Registry**: `https://npm.pkg.github.com`
- **Scope**: `@rileyseaburg`
- **Name**: `@rileyseaburg/tiktok-business-api-sdk`

## Troubleshooting

### Authentication Issues
```bash
# Verify your token has correct permissions
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user

# Check package registry access
npm whoami --registry=https://npm.pkg.github.com
```

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check
```

### Publishing Errors

**403 Forbidden:**
- Check your GitHub token has `write:packages` permission
- Verify you have access to the repository
- Ensure you're authenticated: `npm whoami --registry=https://npm.pkg.github.com`

**Version Already Exists:**
- Bump the version: `npm version patch`
- Or use a pre-release version: `npm version prerelease --preid=alpha`

**Network Issues:**
- Check your internet connection
- Try using a different network
- Clear npm cache: `npm cache clean --force`

## CI/CD Pipeline

The GitHub Actions workflow:
1. **Triggers**: On release creation or manual dispatch
2. **Tests**: Runs on Node.js 18+ with full test suite
3. **Build**: Creates optimized production build
4. **Publish**: Publishes to GitHub Packages with authentication
5. **Release**: Creates GitHub release with changelog

## Monitoring

After publishing:
1. **Package Page**: https://github.com/rileyseaburg/tiktok-business-api-sdk/packages
2. **Downloads**: Check package statistics on GitHub
3. **Issues**: Monitor for user feedback and bug reports

## Support

For publishing issues:
1. Check this guide first
2. Review GitHub Actions logs
3. Create an issue in the repository
4. Contact the maintainers