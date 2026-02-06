export interface PrivacyProps {
    title: string;
    supportEmail: string;
    siteName_Short: string;
    siteName_Long: string;

    websiteUrl: string;
    accountSettings_PageUrl: string;
    sessionSettings_PageUrl: string;
}

export const PrivacyPolicy = (props: PrivacyProps) => `
# ${props.title}

*Last modified: May 3, 2025*

### **Introduction**

${props.siteName_Long} (${props.siteName_Short}) is operated by a group of developers and managers ("we", "our", "us"). This privacy policy explains how we collect, use, and protect your data when you access our website, **${props.websiteUrl}** ("Service" or "Website"). It also outlines your rights regarding your data.

By using our Service, you agree to the collection and use of your data as described in this policy. If you do not agree with these terms, please do not use our Website.

This policy may change from time to time, and any changes will be posted on this page with an updated "Last modified" date.

### **What Data Do We Collect?**

#### **User Data**

When you sign up to ${props.siteName_Short}, we collect the following data:

* **Email address** (used for registration and account communication)
* **Username** (unique identifier)
* **Avatar** (optional, profile picture)
* **Name** (optional)
* **Date of Account Creation**

Whenever the user logs in (a session is created), the following data is stored with the session:
* **Auth provider** (optional, The third party auth provider used to log in)
* **Ip address** (For security purposes)
* **Geo location** (Based on the IP address, for security purposes)
* **User agent** (Browser and OS information, for security purposes)
* **Date of login**
* **Date of last activity** (The last time this session was used for authentication)

It should be noted that the session data is only stored for the duration of the session and is visible to the user on the website on the [session settings](${props.sessionSettings_PageUrl}) page.

We also store information about:

* **Auth Accounts** (linked third-party accounts such as Google, GitHub, Discord, or GitLab)
* **User password** (A hash of the password is stored if the user decides to add one)

#### **Third-Party Data Collection**

We use third-party services for our infrastructure, including:

* **Cloudflare**
* **Fastly**
* **Backblaze**

These services help improve the performance, security and reliability of our services.

We also self-host open-source software such as **Clickhouse DB**, **Postgresql**, **Valkey** and **Meilisearch** for database management and other internal functions.

#### **No Monetization**

We do not monetize user data and have no plans for monetization at this time.

### **Data Retention**

We store your data as long as needed for the operation of the Service. You can request the deletion of your data at any time. Once deleted, your data will no longer be accessible, but may remain in backup systems for a short period.

### **Your Rights and Requests**

You have the right to request the deletion of your personal data from our systems. However, we do not provide full access to all the data we store as much of it is what you've already provided.

To request deletion of your data, please contact us at **[${props.supportEmail}](mailto:${props.supportEmail})**, or go to **[account settings](${props.accountSettings_PageUrl})** and scroll down to "Delete account" and follow the steps on-screen.

### **Third-Party Services**

We do not share your personal data with any third-party service providers for marketing purposes. Our third-party service providers include:

* **Cloudflare** (for performance and security)
* **Fastly** (for content delivery)
* **Backblaze** (For storing backups)

### **Children’s Privacy**

We do not specifically collect personal data from children under the age of 13. Our Service is not directed at children, and we encourage parents and guardians to monitor and control their children's online activities.

If we become aware that a child under 13 has provided personal information, we will make every effort to remove that information from our records.

### **Cookies**

We use cookies to:

* Log you into your account
* Save your cosmetic preferences

You can set your browser to block or alert you about cookies. However, disabling cookies may affect certain features of the Website.

### **Changes to the Privacy Policy**

We may update this privacy policy from time to time. We will post any changes on this page and update the "Last modified" date. Your continued use of the Website after any changes will be deemed as acceptance of the updated privacy policy.

### **Contact Us**

If you have any questions about this privacy policy or how we handle your data, please contact us at [${props.supportEmail}](mailto:${props.supportEmail})
`;
