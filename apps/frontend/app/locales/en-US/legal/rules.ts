export interface RulesProps {
    title: string;
    supportEmail: string;
    privacyPageUrl: string;
    termsPageUrl: string;
    siteName_Short: string;
}

export const Rules = (props: RulesProps) => `
# ${props.title}

*Last modified: May 3, 2025*

If you come across any form of violation of these Rules on our website, we ask you to make us aware. You may use the Report button on any project, version, or user page, or you may email us at [${props.supportEmail}](mailto:${props.supportEmail}).

## 1. Prohibited Content

Content must in their entirety comply with all applicable federal, state, local, and international laws and regulations. Without limiting the foregoing, Content must not:

1. Contain any material which is defamatory, obscene, indecent, abusive, offensive, harassing, violent, hateful, inflammatory, harmful, damaging, disruptive, contradictory, or otherwise objectionable.
2. Promote sexually explicit or pornographic material, violence, or discrimination based on race, sex, gender, religion, nationality, disability, sexual orientation, or age.
3. Infringe any patent, trademark, trade secret, copyright, or other intellectual property or other rights of any other person.
4. Violate the legal rights (including the rights of publicity and privacy) of others or contain any material that could give rise to any civil or criminal liability under applicable laws or regulations or that otherwise may be in conflict with our [Terms of Use](${props.termsPageUrl}) or [Privacy Policy](${props.privacyPageUrl}).
5. Promote any illegal activity, or advocate, promote or assist any unlawful act, including real-life drugs or illicit substances.
6. Cause needless anxiety or be likely to upset, embarrass, alarm, harm, or deceive any other person.
7. Impersonate any person, or misrepresent your identity or affiliation with any person or organization.
8. Give the impression that they emanate from or are endorsed by us or any other person or entity, if this is not the case.
9. Upload any data to a remote server without clear disclosure ingame.

## 2. Clear and Honest Function

Projects, a form of Content, must make a clear and honest attempt to describe their purpose in designated areas on the project page. Necessary information must not be obscured in any way. Using confusing language or technical jargon when it is not necessary constitutes a violation.

### 2.1. General Expectations

From a project description, users should be able to understand what the project does and how to use it. Projects must attempt to describe the following three things within their description:

a. What the project specifically does or adds  
b. Why someone should want to download the project  
c. Any other critical information the user must know before downloading  

### 2.2. Accessibility

Project descriptions must be accessible so that they can be read through a variety of mediums. All descriptions must have a plain-text version, though images, videos, and other content can take priority if desired. Headers must not be used for body text.

Project descriptions must have an English-language translation unless they are exclusively meant for use in a specific language, such as translation packs. Descriptions may provide translations into other languages if desired.

## 3. Cheats and Hacks

Projects cannot contain or download "cheats," which we define as a client-side modification that:

1. Is advertised as a "cheat," "hack," or "hacked client."  
2. Contains any of the following functions without requiring a server-side opt-in:  
    a. Active client-side hiding of third-party modifications that have server-side opt-outs  
    b. Unnecessary sending of packets to a server  
    c. Harming to other users devices  

## 4. Copyright and Reuploads

You must own or have the necessary licenses, rights, consents, and permissions to store, share, and distribute the Content that is uploaded under your ${props.siteName_Short} account.

Content may not be directly reuploaded from another source without explicit permission from the original author. If explicit permission has been granted, or it is a license-abiding "fork," this restriction does not apply.

## 5. Miscellaneous

There are certain other small aspects to creating projects that all authors should attempt to abide by. These will not necessarily always be enforced, but abiding by all will result in a faster review with fewer potential issues.

1. All metadata, including license, client/server-side information, tags, etc., are filled out correctly and are consistent with information found elsewhere.
2. Project titles are only the name of the project, without any other unnecessary filler data.
3. Project summaries contain a small summary of the project without any formatting and without repeating the project title.
4. All external links lead to public resources that are relevant.
5. Gallery images are relevant to the project and each contains a title.
6. All dependencies must be specified in the Dependencies section of each version.
7. "Additional files" are only used for special designated purposes, such as source JAR files. In other words, separate versions and/or projects are used where appropriate instead of additional files.
`;
