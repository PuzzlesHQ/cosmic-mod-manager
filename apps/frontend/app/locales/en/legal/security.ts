export interface SecurityProps {
    title: string;
    adminEmail: string;
    siteName_Short: string;
}

export const SecurityNotice = (props: SecurityProps) => `
# ${props.title}

**Version 2025-05**
*Last modified: May 3, 2025*

This is the security notice for **all ${props.siteName_Short} repositories** and **infrastructure**. This document explains how to report vulnerabilities to us in a **responsible** and **secure** manner.


## Reporting a Vulnerability

If you discover a vulnerability in ${props.siteName_Short}, we’d appreciate it if you let us know **privately** so we can resolve the issue before it is publicly disclosed.

**Please do not open a GitHub issue or discuss the vulnerability in public channels.**

Instead, email us at **[${props.adminEmail}](mailto:${props.adminEmail})** with the following:

* The website, page, or repository where the vulnerability can be observed
* A brief description of the vulnerability
* (Optional) The type of vulnerability and any related OWASP category
* (Optional) Steps to non-destructively reproduce the issue or proof-of-concept details

We aim to respond to valid reports within **48 hours**.


## Scope

The following types of reports are **not** considered within the scope of this policy:

* **Volumetric vulnerabilities**, such as high request volume intended to overwhelm a service
* Reports that indicate we are missing **security best practices**, such as absent HTTP headers or minor configuration issues that do not pose direct threats

If you’re unsure whether your findings are in scope, feel free to reach out regardless. We appreciate your efforts to help us improve ${props.siteName_Short}'s security.


## Coordinated Disclosure

We ask that all security researchers follow a **coordinated disclosure process**. Please give us the opportunity to assess and resolve reported issues before any public disclosure.
`;
