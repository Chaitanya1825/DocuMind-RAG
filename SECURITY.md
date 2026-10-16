# Security Policy

## Supported Versions

We actively support and provide security updates for the latest versions of DocuMind-RAG:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The DocuMind-RAG team takes security seriously. If you discover a security vulnerability or sensitive data leakage risk (such as API keys, credential exposure, or prompt injection exploits), please report it responsibly:

1. **Do NOT open a public GitHub issue.**
2. Send an email to the repository maintainers with:
   - Description of the vulnerability
   - Steps to reproduce or proof of concept
   - Potential impact
3. We will acknowledge receipt of your vulnerability report within 48 hours and work with you on a resolution timeline before public disclosure.

## Security Best Practices for Deployments

- **Never commit `.env` files**: Keep API credentials, AWS secret keys, and database connection strings strictly out of version control.
- **Isolate local Chroma storage**: Ensure the `chroma/` directory has appropriate file system permissions.
- **Sanitize user inputs**: While DocuMind-RAG enforces context constraints in prompt templates, always sanitize untrusted user queries in multi-tenant environments.
