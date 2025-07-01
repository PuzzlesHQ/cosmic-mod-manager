export interface CopyrightProps {
    title: string;
    adminEmail: string;
    siteName_Short: string;
    siteName_Long: string;
}

export function CopyrightPolicy(props: CopyrightProps) {
    return `
# ${props.title}

*Last modified: May 3, 2025*

${props.siteName_Short} (${props.siteName_Long}) respects the rights of copyright holders and expects our users to do the same. This policy outlines how we handle copyright claims, counter claims, and repeat infringements in accordance with UK copyright law. While the United Kingdom does not have a direct equivalent to the US DMCA, we adhere to similar principles to ensure fair treatment of all parties. We also operate under the Copyright, Designs and Patents Act 1988, which provides the legal framework for protecting original creative works in the UK.

---

**Reporting Copyright Infringement**

If you believe that content hosted on ${props.siteName_Short} infringes your copyright, you may submit a takedown request by emailing us at [${props.adminEmail}](mailto:${props.adminEmail}).


Your request should include the following:

1. Your **full** legal name and contact information (postal address, phone number, and email address).
2. A **clear** description of the copyrighted work you claim has been infringed.
3. A **direct link** (URL) to the allegedly infringing content on ${props.siteName_Short}.
4. A statement confirming that:

   * You have a **good faith** belief that use of the material in the manner complained of is not authorised by you (the copyright owner), your agent, or the law.
   * The information provided in the notification is **accurate**.
   * You are the **copyright owner** or authorised to act on behalf of the owner.
   * The notification is made **under penalty of perjury**.

We will reject any complaint that is clearly unprofessional or automated in nature. This includes messages that lack essential details, are copy-pasted form letters without proper names or context, or appear to be mass-generated notices. All copyright claims must be submitted with genuine intent and sufficient information to be considered.

---

**Response and Removal Process**

We will review your request and, **if valid**, may remove or restrict access to the allegedly infringing content. We will also inform the user who uploaded the content and share the complaint with them.

If the complaint is clearly **invalid** or **abusive**, we reserve the right to **reject it outright**. Abusive complaints include those submitted in bad faith, submitted as a means of harassment, or lacking the necessary information outlined above.

---

**Counter Notification Process**

If you are a user who has received a copyright complaint and believe the material was removed in error, you may respond by submitting a counter notice to [${props.adminEmail}](mailto:${props.adminEmail})

Your counter notice should include:

1. Your **full** legal name and contact information (postal address, phone number, and email address).
2. A **link to the content** that was removed or disabled.
3. A statement **under penalty of perjury** that you have a **good faith** belief the material was removed as a result of **mistake** or **misidentification**.
4. **A statement that you consent to ${props.siteName_Short} sharing your counter notice with the original claimant.**

We will forward your counter notice to the original complainant. If they do not take legal action within **five** (5) business days, we may restore the content. If the original claim does not meet the necessary requirements—such as missing contact information, lacking a clear description of the copyrighted work, or failing to assert good faith—it will be considered invalid upon review and we may restore the content **immediately**.

---

**Repeat Infringer Policy**

Users who receive **three** (3) valid copyright complaints will have their account **suspended**. We will notify users after **each complaint**, but **no response opportunity** will be provided before the suspension is applied following the third strike. Accounts found **repeatedly** uploading **infringing** content may be **permanently banned** from ${props.siteName_Short}. We reserve the right to escalate action based on the severity of each case.

Users who submit **false or malicious claims** or counterclaims may also face **account termination** and potential **legal liability**.

---

**Content Moderation & Hosting**

${props.siteName_Short} hosts mod files directly. When a project is created, it is manually reviewed by our moderation team before being published. However, we do not manually verify each file uploaded thereafter. We plan to implement automated scanning, such as integration with VirusTotal, in the future to improve safety. Users are **solely** responsible for ensuring that any files they upload **do not** infringe on the rights of others.

---

**Contact**

For all copyright-related enquiries, please contact:


${props.siteName_Short} Admin Team
[${props.adminEmail}](mailto:${props.adminEmail})


---

**Changes to This Policy**

We may update this Copyright Policy from time to time, without notice. Any changes will be posted on this page and will take effect immediately upon posting. We do not guarantee this page will always be up-to-date.
`;
}
