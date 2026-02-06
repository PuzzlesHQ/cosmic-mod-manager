export interface TermsProps {
    title: string;
    supportEmail: string;
}

export const TermsOfUse = (props: TermsProps) => `
# ${props.title}

*Last modified: May 3, 2025*

Welcome to CRMM (Cosmic Reach Mod Manager). By accessing or using our platform, you agree to these Terms of Use. Please read them carefully. If you do not agree, you may not use our services.

---

## 1. Acceptance of Terms

By creating an account or using any part of CRMM, you confirm that you understand and agree to be bound by these Terms. If you are under the age of 13, you may create an account only with parental consent, which we strongly recommend obtaining.


## 2. User Accounts

* Users must provide accurate and current information during registration.
* Accounts are intended for individual use only and must not be shared.
* Users are responsible for maintaining the confidentiality of their credentials.


## 3. Content Hosting

CRMM directly hosts user-submitted files, including modifications (mods) for Cosmic Reach. We do not permit:

* Malware or harmful code
* NSFW (Not Safe For Work) content
* Illegal or infringing material

We reserve the right to remove any content that violates these standards.


## 4. Monetisation

At present, CRMM does not offer any form of monetisation or financial transactions. This may change in the future, at which point this document will be updated accordingly.


## 5. API Access

CRMM provides an open API, subject to fair use and reasonable rate limits.

* Users of the API must provide proper attribution to CRMM.
* Abuse of the API or failure to provide credit may result in revoked access.


## 6. Account Termination

We reserve the right to terminate user accounts at our discretion, without notice. Grounds for termination include but are not limited to:

* DMCA takedown requests
* Violation of applicable laws
* Breaches of these Terms of Use

Some terminations, such as those for Terms violations, may be eligible for appeal. However, any breach of law will result in a permanent ban with no appeal process.


## 7. Legal Jurisdiction and Disputes

CRMM is managed and operated from Wales, United Kingdom.

* By using CRMM, you agree to resolve any disputes under the laws of the United Kingdom.
* You waive any rights to participate in class action lawsuits against CRMM.
* Mandatory arbitration may be used at our discretion if legally applicable.


## 8. Data Collection and Use

We collect the following user information:

* Name, username, email, avatar
* Account creation date, email verification status
* Session data, third-party auth accounts
* Project uploads, collections, team memberships

Analytics are used solely for performance and platform improvements. No external tracking or unauthorised data sharing occurs.


## 9. Mod Rights and Licensing

* Mod authors retain full rights to their own content.
* A clearly defined license must be included with all uploads.

CRMM acts as a distribution platform and does not claim ownership over any mods.


## 10. Service Shutdown

In the event that CRMM shuts down, users may receive prior notice. However:

* User data may not be recoverable after shutdown.
* All data will be securely deleted in accordance with our data policies.


## 11. Changes to These Terms

These Terms of Use may be updated from time to time, without notice. Continued use of the service after changes constitutes acceptance of the new terms.


## 12. Contact

For questions or concerns regarding these Terms, please contact us at [${props.supportEmail}](mailto:${props.supportEmail}).

---

Thank you for using CRMM.
`;
