import { Capitalize } from "@app/utils/string";
import type { Locale } from "~/locales/types";
// import { AboutUs } from "./about";
// import { CopyrightPolicy } from "./legal/copyright";
// import { PrivacyPolicy } from "./legal/privacy";
// import { SecurityNotice } from "./legal/security";
import { Rules } from "./legal/rules";
import tags from "./tags";

type Gender = "f" | "m" | "n" | "a";

const definiteArticleDative: { [Property in Gender]-?: string } = {
    m: "dem",
    f: "der",
    n: "dem",
    a: "der/dem",
};

const indefiniteArticleNominative: { [Property in Gender]-?: string } = {
    m: "ein",
    f: "eine",
    n: "ein",
    a: "ein/e",
};

const demonstrativePronounDative: { [Property in Gender]-?: string } = {
    m: "diesem",
    f: "dieser",
    n: "diesem",
    a: "dieser/m",
};

const secondPersonPossesivePronouns: { [Property in Gender]-?: string } = {
    m: "dein",
    f: "deine",
    n: "dein",
    a: "dein/e",
};

const _teamTypeGenitive: { [noun: string]: string } = {
    Organisation: "Organisation",
    Projekt: "Projektes",
};

const genderOf: { [noun: string]: Gender } = {
    Organisation: "f",
    Projekt: "n",
    Mod: "f",
    Datamod: "f",
    Shader: "m",
    Modpack: "n",
    Plugin: "n",
    Ressourcenpaket: "n",
};

export default {
    common: {
        settings: "Einstellungen",
        success: "Erfolgreich",
        error: "Fehler",
        home: "Startseite",
        somethingWentWrong: "Etwas ist schiefgelaufen!",
        redirecting: "Weiterleiten...",
        accept: "Akzeptieren",
        decline: "Ablehnen",
        download: "Herunterladen",
        report: "Melden",
        copyId: "ID kopieren",
        all: "Alle",
        noResults: "Keine Ergebnisse",
        more: "Mehr",
    },

    count: {
        downloads: (count: number) => {
            if (count === 1) return ["", count, "Download"];
            return ["", count, "Downloads"];
        },
        followers: (count: number) => {
            if (count === 1) return ["", count, "Follower"];
            return ["", count, "Followers"];
        },
        projects: (count: number) => {
            if (count === 1) return ["", count, "Projekt"];
            return ["", count, "Projekte"];
        },
        members: (count: number) => {
            if (count === 1) return ["", count, "Mitglied"];
            return ["", count, "Mitglieder"];
        },
    },

    navbar: {
        mod: "Mod",
        mods: "Mods",
        datamod: "Datamod",
        datamods: "Datamods",
        "resource-pack": "Ressourcenpaket",
        "resource-packs": "Ressourcenpakete",
        shader: "Shader",
        shaders: "Shader",
        modpack: "Modpack",
        modpacks: "Modpacks",
        plugin: "Plugin",
        plugins: "Plugins",
        world: "Welt",
        worlds: "Welten",
        signout: "Ausloggen",
        profile: "Profil",
        skipToMainContent: "Zum Hauptinhalt vorspringen",
    },

    homePage: {
        title: (projectType: string) => ["Der Ort für Cosmic\u00A0Reach ", projectType, ""],
        desc: "Der beste Ort für deine Cosmic Reach Mods. Entdecke, spiele und erstelle Inhalte, alles an einer Stelle.",
        exploreMods: "Entdecke Mods",
    },

    auth: {
        email: "Email",
        password: "Passwort",
        changePassword: "Passwort ändern",
        loginUsing: "Anmelden mit:",
        dontHaveAccount: (signup) => ["Du hast kein Konto? ", signup],
        alreadyHaveAccount: (login) => ["Du hast bereits ein Konto? ", login],
        forgotPassword: (changePassword) => ["Passwort vergessen? ", changePassword],
        signupWithProviders: "Registriere dich mit einer dieser Anmeldemethoden:",
        agreement: (terms, privacyPolicy) => [
            "Mit dem Erstellen eines Kontos akzeptierst du unsere ",
            terms,
            " und ",
            privacyPolicy,
            ".",
        ],
        invalidCode: "Ungültiger oder abgelaufener Code",
        didntRequest: "Nicht angefragt?",
        checkSessions: "Angemeldete Sitzungen überprüfen",
        confirmNewPass: "Neues Passwort bestätigen",
        confirmNewPassDesc:
            "Ein neues Passwort wurde letztens zu deinem Konto hinzugefügt und wartet auf Bestätigung. Bestätige unten, dass du das warst.",
        newPass: "Neues Passwort",
        newPass_label: "Neues Passwort eingeben",
        confirmPass: "Passwort bestätigen",
        confirmPass_label: "Passwort erneut eingeben",
        deleteAccount: "Konto löschen",
        deleteAccountDesc:
            "Durch das Löschen des Kontos werden alle deine Daten von unserer Datenbank entfernt. Es gibt kein Zurück, nachdem du dein Konto gelöscht hast.",
        enterEmail: "E-Mail-Adresse eingeben",
    },

    settings: {
        account: "Konto",
        preferences: "Präferenzen",
        publicProfile: "Öffentliches Profil",
        accountAndSecurity: "Konto und Sicherheit",
        sessions: "Sitzungen",
        toggleFeatures: "Funktionen ein- und ausschalten",
        enableOrDisableFeatures: "Schalte bestimmte Funktionen für dieses Gerät ein oder aus.",
        viewTransitions: "Übergänge zeigen",
        viewTransitionsDesc: "Aktiviert Übergänge (morph), während dem Navigieren zwischen Seiten.",
        accountSecurity: "Konto-Sicherheit",
        changePassTitle: "Passwort vom Konto ändern",
        addPassDesc: "Füge ein Passwort hinzu, um den Passwort-Login zu ermöglichen.",
        manageAuthProviders: "Anmeldemethoden verwalten",
        manageProvidersDesc: "Füge dem Konto Anmeldemethoden hinzu oder entferne sie.",
        removePass: "Passwort entfernen",
        removePassTitle: "Passwort vom Konto entfernen",
        removePassDesc: "Nach dem Entfernen des Passwort kannst du dich nicht mehr mit ihm anmelden.",
        enterCurrentPass: "Gib das aktuelle Passwort ein",
        addPass: "Passwort hinzufügen",
        addPassDialogDesc: "Du wirst diese Passwort benutzen können, um dich mit deinem Konto anzumelden.",
        manageProviders: "Verwalten",
        linkedProviders: "Verknüpfte Anmeldemethode",
        linkProvider: (provider: string) => `Verknüpfe ${provider} mit deinem Konto`,
        link: "Verknüpfen", // Verb
        sureToDeleteAccount: "Bist du sicher, dass du dein Konto löschen willst?",
        profileInfo: "Profil",
        profileInfoDesc: (site: string) => `Dein Profil ist öffentlich sichtbar auf ${site}.`,
        profilePic: "Profilbild",
        bio: "Bio",
        bioDesc: "Eine kurze Beschreibung, um anderen ein wenig über dich zu erzählen.",
        visitYourProfile: "Profil besuchen",
        showIpAddr: "IP Adressen anzeigen",
        sessionsDesc:
            "Diese Geräte sind aktuell in deinen Account eingeloggt; du kannst jede Sitzung jederzeit beenden. Solltest du etwas sehen, das du nicht kennst, beende die entsprechende Sitzung sofort und ändere das Passwort deiner Anmeldemethode.",
        ipHidden: "IP versteckt",
        lastAccessed: (when: string) => `Zuletzt ${when} zugegriffen`,
        created: (when: string) => `${Capitalize(when)} erstellt`, // eg: Created a month ago
        sessionCreatedUsing: (providerName: string) => `Sitzung erstellt über ${providerName}`,
        currSession: "Aktuelle Sitzung",
        revokeSession: "Sitzung beenden",
    },

    dashboard: {
        dashboard: "Dashboard",
        overview: "Übersicht",
        notifications: "Benachrichtigungen",
        activeReports: "Aktive Meldungen",
        analytics: "Analysen",
        projects: "Projekte",
        organizations: "Organisationen",
        collections: "Sammlungen",
        collection: "Sammlung",
        revenue: "Einnahmen",
        manage: "Verwalten",
        seeAll: "Alles anzeigen",
        viewNotifHistory: "Benachrichtungsverlauf anzeigen",
        noUnreadNotifs: "Du hast keine ungelesenen Benachrichtigungen.",
        totalDownloads: "Gesamtdownloads",
        fromProjects: (count: number) => `von ${count} Projekten`,
        totalFollowers: "Gesamtfollower",
        viewHistory: "Verlauf anzeigen",
        markAllRead: "Alle als gelesen markieren",
        markRead: "Als gelesen markieren",
        deleteNotif: "Benachrichtigung löschen",
        received: "Erhalten",
        history: "Verlauf",
        notifHistory: "Benachrichtigungsverlauf",
        createProjectInfo: "Du hast noch keine Projekte. Klicke auf den obigen Knopf, um eines zu erstellen.",
        type: "Typ",
        status: "Status",
        createProject: "Ein Projekt erstellen",
        creatingProject: "Erstellen eines Projektes",
        chooseProjectType: "Projekttyp wählen",
        projectTypeDesc: "Wähle den passenden Typ für dein Projekt",
        createOrg: "Organisation erstellen",
        creatingOrg: "Erstellen einer Organisation",
        enterOrgName: "Organisationsname eingeben",
        enterOrgDescription: "Gebe eine kurze Beschreibung für deine Organisation ein",
        creatingACollection: "Eine Sammlung erstellen",
        enterCollectionName: "Gib der Sammlung einen Namen",
        createCollection: "Sammlung erstellen",
    },

    search: {
        // Search labels
        project: "Durchsuche Projekte",
        mod: "Durchsuche Mods",
        "resource-pack": "Durchsuche Ressourcenpakete",
        shader: "Durchsuche Shader",
        plugin: "Durchsuche Plugins",
        modpack: "Durchsuche Modpacks",
        datamod: "Durchsuche Datamods",
        world: "Durchsuche Welten",

        // Sorting methods
        showPerPage: "Zeige pro Seite",
        sortBy: "Sortiere nach",
        relevance: "Relevanz",
        downloads: "Downloads",
        follow_count: "Followerzahl",
        recently_updated: "Zuletzt aktualisiert",
        recently_published: "Zuletzt veröffentlicht",

        filters: "Filter",
        searchFilters: "Durchsuche Filter",
        loaders: "Loader",
        gameVersions: "Spielversionen",
        channels: "Kanäle",
        environment: "Umgebung",
        category: "Kategorien",
        feature: "Funktionen",
        resolution: "Auflösung",
        performance_impact: "Performance-Einfluss",
        license: "Lizenz",
        openSourceOnly: "Nur Open Source",
        clearFilters: "Alle Filter entfernen",

        tags: tags,
        searchItemAuthor: (project, author) => [project, " von ", author],
    },

    project: {
        compatibility: "Kompatibilität",
        environments: "Umgebungen",
        reportIssues: "Fehler melden",
        viewSource: "Quellcode anzeigen",
        visitWiki: "Wiki besuchen",
        joinDiscord: "Discord Server beitreten",
        featuredVersions: "Vorgestellte Versionen",
        creators: "Ersteller",
        organization: "Organisation",
        project: "Projekt",
        details: "Details",
        licensed: (license: string) => ["LIZENSIERT UNTER", license, ""],
        updatedAt: (when: string) => `${Capitalize(when)} aktualisiert`, // eg: Updated 3 days ago
        publishedAt: (when: string) => `${Capitalize(when)} veröffentlicht`, // eg: Published 3 days ago
        gallery: "Gallerie",
        changelog: "Änderungsverlauf",
        versions: "Versionen",
        noProjectDesc: "Keine Projektbeschriebung vorhanden",
        uploadNewImg: "Neues Bild hochladen",
        uploadImg: "Bild hochladen",
        galleryOrderingDesc: "Bilder mit höherer Sortierung werden zuerst aufgelistet.",
        featuredGalleryImgDesc:
            "Ein hervorgehobenes Galleriebild taucht in der Suche und auf der Projektkarte auf. Es kann nur ein Galleriebild hervorgehoben werden.",
        addGalleryImg: "Galleriebild hinzufügen",
        featureImg: "Bild hervorheben",
        unfeatureImg: "Bild nicht mehr hervorheben",
        sureToDeleteImg: "Willst du dieses Bild wirklich löschen?",
        deleteImgDesc: "Das wird das Bild für immer entfernen (also wirklich für immer immer).",
        editGalleryImg: "Bild bearbeiten",
        currImage: "Aktuelles Bild",

        // Version
        uploadVersion: "Version hochladen",
        uploadNewVersion: "Neue Version hochladen",
        showDevVersions: "Development-Versionen anzeigen",
        noProjectVersions: "Keine Versionen gefunden",
        stats: "Statistiken",
        published: "Veröffentlicht", // Used for table headers
        downloads: "Downloads", // Used for table headers
        openInNewTab: "In neuem Tab öffnen",
        copyLink: "Link kopieren",
        doesNotSupport: (project: string, version: string, loader: string) => {
            return `${project} unterstützt ${version} für ${loader} nicht`;
        },
        downloadProject: (project: string) => `Lade ${project} herunter`,
        gameVersion: "Spielversion:",
        selectGameVersion: "Spielversion wählen",
        platform: "Platform:",
        selectPlatform: "Platform wählen",
        onlyAvailableFor: (project: string, platform: string) => `${project} ist nur für ${platform} verfügbar`,
        noVersionsAvailableFor: (gameVersion: string, loader: string) =>
            `Keine Versionen für ${gameVersion} auf ${loader} verfügbar`,
        declinedInvitation: "Abgelehnte Einladung",
        teamInvitationTitle: (teamType: string) =>
            `Einladung, ${definiteArticleDative[genderOf[teamType] || ("a" as Gender)]} ${teamType} beizutreten`, // teamType = organization | project
        teamInviteDesc: (teamType: string, role: string) =>
            `Du wurdest eingeladen, in ${demonstrativePronounDative[genderOf[teamType] || ("a" as Gender)]} ${teamType} Mitglied mit der Rolle '${role}' zu sein.`,

        browse: {
            mod: "Entdecke Mods",
            datamod: "Entdecke Datamods",
            "resource-pack": "Entdecke Ressourcenpakete",
            shader: "Entdecke Shaders",
            modpack: "Entdecke Modpacks",
            plugin: "Entdecke Plugins",
            world: "Entdecke Welten",
        },

        rejected: "Abgelehnt",
        withheld: "Zurückgehalten",
        archivedMessage: (project: string) =>
            `${project} wurde archiviert. Es wird keine weiteren Updates geben, außer der Author entscheidet sich, die Archivierung des Projekts aufzuheben.`,
        updateProjectStatus: "Projektstatus ändern",
        sureToUpdateStatus: (projectName: string, projectType: string, prevStatus: string, newStatus: string) =>
            `Bist du dir sicher, dass du den Status des Projektes **${projectName}** ${projectType} von **${prevStatus}** zu **${newStatus}** ändern möchtest?`,

        publishingChecklist: {
            required: "Benötigt",
            suggestion: "Vorschlag",
            review: "Prüfung",
            progress: "Fortschritt:",
            title: "Veröffentlichungs-Checkliste",
            uploadVersion: "Eine Version hochladen",
            uploadVersionDesc: "Mindestens eine Version ist benötigt, um das Projekt zur Prüfung vorzulegen.",
            addDescription: "Beschribung hinzufügen",
            addDescriptionDesc: "Eine Beschreibung, die den Sinn und die Funktion des Projektes klar darlegt, wird benötigt.",
            addIcon: "Ein Icon hinzufügen",
            addIconDesc:
                "Dein Projekt sollte ein schön-aussehendes Icon haben, um es eindeutig und auf einen Blick identifizieren zu können.",
            featureGalleryImg: "Ein Galleriebild hervorheben",
            featureGalleryImgDesc: "Hervorgehobene Galleriebilder sind für viele Nutzer der erste Eindruck von deinem Projekt.",
            selectTags: "Tags wählen",
            selectTagsDesc: "Wähle alle Tags, die auf dein Projekt zutreffen.",
            addExtLinks: "Externe Links hinzufügen",
            addExtLinksDesc:
                "Füge jegliche relevante Links hinzu, wie zum Quellcode, zum Bugtracker, oder einer Discord-Einladung.",
            selectLicense: "Lizenz wählen",
            selectLicenseDesc: (projectType: string) =>
                `Wähle die Lizenz, unter der ${secondPersonPossesivePronouns[genderOf[projectType] || ("a" as Gender)]} ${projectType} verbreitet wird.`,
            selectEnv: "Wähle unterstützte Umgebungen",
            selectEnvDesc: (projectType: string) =>
                `Wähle, ob ${secondPersonPossesivePronouns[genderOf[projectType] || ("a" as Gender)]} ${projectType} Client- und/oder Serverseitige Funktionen hat.`,
            requiredStepsDesc: "Alle mit einem Sternchen (*) markierten Felder werden benötigt.",
            submitForReview: "Zur Prüfung vorlegen",
            submitForReviewDesc:
                "Dein Projekt kann nur von den Mitgliedern des Projektes gesehen werden. Es muss von Moderatoren zugelassen werden, um veröffentlicht zu werden.",
            resubmitForReview: "Erneut zur Prüfung vorlegen",
            resubmit_ApprovalRejected:
                "Dein Projekt wurde von einem unserer Moderatoren abgelehnt. In den meisten Fällen kannst du das Prokekt, nachdem du dich mit der Nachricht des Moderators befasst hast, erneut vorlegen.",
            resubmit_ProjectWithheld:
                "Dein Projekt wurde von einem unserer Moderatoren zurückgehalten. In den meisten Fällen kannst du das Prokekt, nachdem du dich mit der Nachricht des Moderators befasst hast, erneut vorlegen.",
            visit: {
                versionsPage: "Versionsseite öffnen",
                descriptionSettings: "Beschreibungseinstellungen öffnen",
                generalSettings: "Allgemeine Einstellungen öffnen",
                galleryPage: "Gallerie öffnen",
                tagSettings: "Tag-Einstellungen öffnen",
                linksSettings: "Link-Einstellungen öffnen",
                licenseSettings: "Lizenz-Einstellungen öffnen",
                moderationPage: "Moderationsseite öffnen",
            },
        },
    },

    version: {
        deleteVersion: "Version löschen",
        sureToDelete: "Bist du sicher, dass du diese Version löschen willst?",
        deleteDesc: "Dadurch wird diese Version für immer entfernt (also wirklich für immer immer).",
        enterVersionTitle: "Gib den Versionstitel ein...",
        feature: "Version hervorheben",
        unfeature: "Version nicht mehr hervorheben",
        featured: "Hervorgehoben",
        releaseChannel: "Veröffentlichungskanal",
        versionNumber: "Versionsnummer",
        selectLoaders: "Loader wählen",
        selectVersions: "Versionen wählen",
        cantAddCurrProject: "Du kannst nicht dieses Projekt nicht abhängig von sich selbst machen.",
        cantAddDuplicateDep: "Du kannst nicht die gleiche Abhängigkeit zweimal hinzufügen.",
        addDep: "Abhängigkeit hinzufügen",
        enterProjectId: "Projekt-ID eingeben",
        enterVersionId: "Versions-ID eingeben",
        dependencies: "Abhängigkeiten",
        files: "Dateien",

        depencency: {
            required: "Benötigt",
            optional: "Optional",
            incompatible: "Unvollständig",
            embedded: "Eingebettet",
            required_desc: (version: string) => `Version ${version} ist benötigt`,
            optional_desc: (version: string) => `Version ${version} ist optional`,
            incompatible_desc: (version: string) => `Version ${version} ist inkompatibel`,
            embedded_desc: (version: string) => `Version ${version} ist eingebettet`,
        },

        primary: "Primär",
        noPrimaryFile: "Keine primäre Datei gewählt",
        chooseFile: "Datei wählen",
        replaceFile: "Datei ersetzen",
        uploadExtraFiles: "Zusätzliche Dateien hochladen",
        uploadExtraFilesDesc: "Nutzbar für zusätzliche Dateien, wie Quellen, Dokumentation, etc.",
        selectFiles: "Dateien wählen",
        primaryFileRequired: "Eine primäre Datei wird benötigt",
        metadata: "Metadaten",
        devReleasesNote:
            "Notiz:- Ältere Development-Versionen werden automatisch gelöscht, sobald eine neue veröffentlicht wird.",
        publicationDate: "Veröffentlichungsdatum",
        publisher: "Veröffentlicher",
        versionID: "Versions ID",
        copySha1: "SHA-1 Hash kopieren",
        copySha512: "SHA-512 Hash kopieren",
        copyFileUrl: "Datei-URL kopieren",

        publishedBy: (version, author, publish_date) => [version, " von ", author, " am ", publish_date],
    },

    projectSettings: {
        settings: "Projekteinstellungen",
        general: "Allgemein",
        tags: "Tags",
        links: "Links",
        members: "Mitglieder",
        view: "Zeige",
        upload: "Hochladen",
        externalLinks: "Externe Links",
        issueTracker: "Bugtracker",
        issueTrackerDesc: "Ein Ort für Nutzer, Fehler und Bedenken über dein Projekt zu äußern.",
        sourceCode: "Quellcode",
        sourceCodeDesc: "Eine Seite oder ein Repository, welches den Quellcode deines Projektes enthält.",
        wikiPage: "Wiki-Seite",
        wikiPageDesc: "Eine Seite die Informationen, Dokumentation und Hilfe zu deinem Projekt enthält.",
        discordInvite: "Discord-Einladung",
        discordInviteDesc: "Ein Einladungslink zu deinem Discord-Server.",
        licenseDesc: (projectType: string) =>
            `Es ist sehr wichtig, die richtige Lizenz für ${secondPersonPossesivePronouns[genderOf[projectType] || ("a" as Gender)]} ${projectType} zu wählen. Du kannst eine von unserer Liste wählen, oder eine eigene Lizenz festlegen. Du kannst auch eine URL zu deiner gewählten Lizenz festlegen; andernfalls wird der Text der Lizenz angezeigt.`,
        customLicenseDesc:
            "Gib einen gültigen [SPDX Lizenz-Identifikator](https://spdx.org/licenses) in den markierten Bereich ein. Wenn deine Lizenz keinen SPDX-Identifikator hat (zum Beispiel, wenn du die Lizenz selber erstellt hast, oder, wenn sie sich speziell auf Cosmic Reach bezieht), setze einfach einen Haken in der Box und gib stattdessen den Namen der Lizenz ein.",
        selectLicense: "Lizenz wählen",
        custom: "Eigene",
        licenseName: "Lizenzname",
        licenseUrl: "Lizenz-URL (optional)",
        spdxId: "SPDX-Identifikator",
        doesntHaveSpdxId: "Die Lizenz hat keinen SPDX-Identifikator",
        tagsDesc: (projectType) =>
            `Das korrekte Wählen von Tags ist wichtig, um Leuten zu helfen, ${secondPersonPossesivePronouns[genderOf[projectType] || ("a" as Gender)]} ${projectType} zu finden. Stelle sicher, alle Tags zu wählen, die zutreffen.`,
        featuredCategories: "Hervorgehobene Kategorien",
        featuredCategoriesDesc: (count: number) => `Du kannst bis zu ${count} deiner relevantesten Tags hervorheben.`,
        selectAtLeastOneCategory: "Wähle mindestens eine Kategorie, um eine Kategorie hervorzuheben.",
        projectInfo: "Projekt",
        clientSide: "Clientseitig",
        clientSideDesc: (projectType: string) =>
            `Wähle dies, wenn ${secondPersonPossesivePronouns[genderOf[projectType] || ("a" as Gender)]} ${projectType} Clientseitige Funktionalität hat.`,
        serverSide: "Serverseitig",
        serverSideDesc: (projectType: string) =>
            `Wähle dies, wenn ${secondPersonPossesivePronouns[genderOf[projectType] || ("a" as Gender)]} ${projectType} Serverseitige Funktionalität hat.`,
        unknown: "Unbekannt",
        clientOrServer: "Client oder Server",
        clientAndServer: "Client und Server",
        required: "Benötigt",
        optional: "Optional",
        unsupported: "Nicht unterstützt",
        visibilityDesc:
            "Gelistete und archivierte Projekte sind in der Suche sichtbar. Nicht gelistete Projekte sind veröffentlicht, aber nicht in der Suche oder auf Benutzerseiten sichtbar. Private Projekte können nur von Mitgliedern des Projektes eingesehen werden.",
        ifApproved: "Wenn von den Moderatoren zugelassen:",
        visibleInSearch: "Sichtbar in der Suche",
        visibleOnProfile: "Sichtbar auf deinem Profil",
        visibleViaUrl: "Auffindbar per URL",
        visibleToMembersOnly: "Nur Mitglieder werden das Projekt sehen können",
        listed: "Gelistet",
        private: "Privat",
        public: "Öffentlich",
        unlisted: "Nicht gelistet",
        archived: "Archiviert",
        deleteProject: "Projekt löschen",
        deleteProjectDesc: (site: string) =>
            `Entfernt sein Projekt von ${site}s Servern und aus der Suche. Du löschst dein Projekt damit entgültig, sei also extra vosichtig!`,
        sureToDeleteProject: "Bist du sicher, dass du dieses Projekt löschen willst?",
        deleteProjectDesc2:
            "Wenn du fortfährst, werden alle Versionen und jegliche zusammenhängende Information von unseren Server entfernt. Das kann die Funktion anderer Projekte stören oder sie kaputt machen, sei also vorsichtig.",
        typeToVerify: (projectName: string) => `Zum Verifizieren gib unten **${projectName}** ein:`,
        typeHere: "Hier eingeben...",
        manageMembers: "Mitglieder verwalten",
        leftProjectTeam: "Du hast das Team verlassen",
        leaveOrg: "Organisation verlassen",
        leaveProject: "Projekt verlassen",
        leaveOrgDesc: "Entferne dich selbst als Mitglied von dieser Organisation.",
        leaveProjectDesc: "Entferne dich selbst als Mitglied von diesem Projekt.",
        sureToLeaveTeam: "Willst du dieses Team wirklich verlassen?",
        cantManageInvites: "Du hast keine Berechtigungen, Einladungen zu verwalten",
        inviteMember: "Mitglied einladen",
        inviteProjectMemberDesc:
            "Gib den Nutzernamen der Person ein, die du gerne als Mitglied zu diesem Projekt einladen würdest.",
        inviteOrgMemberDesc:
            "Gib den Nutzernamen der Person ein, die du gerne als Mitglied zu dieser Organisation einladen würdest.",
        invite: "Einladung",
        memberUpdated: "Mitglied erfolgreich aktualisiert",
        pending: "Ausstehend",
        role: "Rolle",
        roleDesc: "Der Titel der Rolle die dieses Mitglied für das Team spielt.",
        permissions: "Berechtigungen",
        perms: {
            upload_version: "Version hochladen",
            delete_version: "Version löschen",
            edit_details: "Details bearbeiten",
            edit_description: "Beschreibung bearbeiten",
            manage_invites: "Einladungen verwalten",
            remove_member: "Mitglied entfernen",
            edit_member: "Mitglied bearbeiten",
            delete_project: "Projekt löschen",
            view_analytics: "Analysen ansehen",
            view_revenue: "Einnahmen sehen",
        },
        owner: "Besitzer",
        removeMember: "Mitglied entfernen",
        transferOwnership: "Besitz übertragen",
        overrideValues: "Werte überschreiben",
        overrideValuesDesc:
            "Standardwerte der Organisation überschreiben und damit Berechtigungen und Rollen für den Nutzer für dieses Projekt festlegen",
        projectNotManagedByOrg:
            "Dieses Projekt wird nicht von einer Organisation verwaltet. Wenn du einer Organisation angehörst, kannst du die Verwaltungsrechte an diese übertragen.",
        transferManagementToOrg: "Verwaltungsrechte übertragen",
        selectOrg: "Organisation wählen",
        projectManagedByOrg: (orgName: string) =>
            `Dieses Projekt wird von ${orgName} verwaltet. Die Standardwerte für Mitgleiderberechtigungen werden in den Organisationseinstellungen festgelegt. Du kannst sie unten überschreiben.`,
        removeFromOrg: "Aus Organisation entfernen",
        memberRemoved: "Mitglied erfolgreich entfernt",
        sureToRemoveMember: (memberName: string) => `Möchtest du ${memberName} wirklich aus diesem Team entfernen?`,
        ownershipTransfered: "Besitz erfolgreich übertragen.",
        sureToTransferOwnership: (memberName: string) => `Möchtest du wirklich ${memberName} zum Besitzer machen?`,
    },

    organization: {
        orgDoesntHaveProjects: "Diese Organisation hat noch keine Projekte.",
        manageProjects: "Projekte verwalten",
        orgSettings: "Organizationseinstellungen",
        transferProjectsTip:
            "Du kannst über Projekteinstellungen > Mitglieder existierende Projekte zu dieser Organisation übertragen",
        noProjects_CreateOne: "Diese Organisation hat noch keine Projekte. Klicke auf den Knopf oben, um eines zu erstellen.",
        orgInfo: "Organisation",
        deleteOrg: "Organisation löschen",
        deleteOrgDesc:
            "Durch das Löschen deiner Organisation werden alle Projekte zum Organisationsinhaber verschoben. Das kann nicht rückgängig gemacht werden.",
        sureToDeleteOrg: "Bist du sicher, dass du diese Organisation löschen willst?",
        deleteOrgNamed: (orgName: string) => `Organisation ${orgName} löschen`,
        deletionWarning: "Dadurch wird die Organisation für immer gelöscht (also wirklich für immer immer).",

        perms: {
            edit_details: "Details bearbeiten",
            manage_invites: "Einladungen verwalten",
            remove_member: "Mitglied entfernen",
            edit_member: "Mitglied bearbeiten",
            add_project: "Projekt hinzufügen",
            remove_project: "Projekt entfernen",
            delete_organization: "Organisation löschen",
            edit_member_default_permissions: "Standard-Mitgliederberechtigungen bearbeiten",
        },
    },

    user: {
        admin: "Admin",
        moderator: "Moderator",
        doesntHaveProjects: (user: string) => `${user} hat noch keine Projekte.`,
        isntPartOfAnyOrgs: (user: string) => `${user} ist nicht Mitglied einer Organization.`,
        joined: (when: string) => `${Capitalize(when)} beigetreten`, // eg: Joined 2 months ago
    },

    footer: {
        resources: "Ressourcen",
        docs: "Dokumentation",
        status: "Status",
        support: "Support",
        socials: "Sociale Medien",
        about: "Über Uns",
        changeTheme: "Theme wechseln",
        siteOfferedIn: (site: string) => `${site} wird angeboten in:`,
    },

    legal: {
        legal: "Legal",
        rulesTitle: "Inhaltsregeln",
        contentRules: Rules,
        termsTitle: "Nutzungsbedingungen",
        // termsOfUse: TermsOfUse,
        copyrightPolicyTitle: "Copyright-Bestimmungen",
        // copyrightPolicy: CopyrightPolicy,
        securityNoticeTitle: "Sicherheitsinformation",
        // securityNotice: SecurityNotice,
        privacyPolicyTitle: "Privatsphärebestimmungen",
        // privacyPolicy: PrivacyPolicy,

        // About us page
        // aboutUs: AboutUs
    },

    moderation: {
        review: "Review projects",
        reports: "Meldungen",
        moderation: "Moderation",
        statistics: "Statistiken",
        authors: "Autoren",
        projectsInQueue: (count: number) => {
            if (count === 1) return "Es ist ein Projekt in der Warteschlange.";
            return `Es sind ${count} Projekte in der Warteschlange.`;
        },
        // hours will either be 24 or 48
        projectsQueuedFor: (count: number, hours: number) => {
            if (count === 1) return `Ein Projekt war über ${hours} Stunden in der Warteschlange.`;
            return `${count} Projekte waren über ${hours} Stunden in der Warteschlange.`;
        },
        submitted: (when: string) => `${Capitalize(when)} abgeschickt`, // eg: Submitted 4 hours ago, (the date string comes from the localized phrases defined at end of the file)
        viewProject: "Projekt anzeigen",
        awaitingApproval: "Projekt ist in der Prüfungs-Warteschlange",
        draft: "Entwurf",
        approve: "Zulassen",
        reject: "Ablehnen",
        withhold: "Zurückhalten",
    },

    form: {
        login: "Anmelden",
        login_withSpace: "Anmelden",
        signup: "Registrieren",
        email: "Email",
        username: "Nutzername",
        password: "Passwort",
        displayName: "Anzeigename",
        name: "Name",
        icon: "Icon",
        details: "Details",
        description: "Beschreibung",
        id: "ID",
        url: "URL",
        projectType: "Projekttyp",
        visibility: "Sichtbarkeit",
        summary: "Zusammenfassung",
        title: "Titel",
        ordering: "Sortierung",
        featured: "Vorgestellt",
        continue: "Fortfahren",
        submit: "Einreichen",
        remove: "Entfernen",
        confirm: "Bestätigen",
        edit: "Bearbeiten",
        delete: "Löschen",
        cancel: "Abbrechen",
        saveChanges: "Änderungen speichern",
        uploadIcon: "Icon hochladen",
        removeIcon: "Icon entfernen",
        noFileChosen: "Keine Datei gewählt",
        showAllVersions: "Zeige alle Versionen",
        createNew: "Hinzufügen",
    },

    error: {
        sthWentWrong: "Ups! Etwas ist schiefgelaufen.",
        errorDesc:
            "Sieht aus als wäre etwas kaputt. Während wir versuchen, das Problem zu lösen, kannst du versuchen, die Seite neu zu laden.",
        refresh: "Neu laden",
        pageNotFound: "404 | Seite nicht gefunden.",
        pageNotFoundDesc: "Sorry, aber wir konnten die Seite nach der du gesucht hast nicht finden.",
        projectNotFound: "Projekt nicht gefunden",
        projectNotFoundDesc: (type: string, slug: string) =>
            `${Capitalize(indefiniteArticleNominative[genderOf[type] || ("a" as Gender)])} ${type} mit der ID "${slug}" existiert nicht.`,
    },

    editor: {
        heading1: "Überschrift 1",
        heading2: "Überschrift 2",
        heading3: "Überschrift 3",
        bold: "Fett",
        italic: "Italic",
        underline: "Unterstrichen",
        strikethrough: "Durchgestrichen",
        code: "Code",
        spoiler: "Spoiler",
        bulletedList: "Stichpunkte-Liste",
        numberedList: "Numerierte Liste",
        quote: "Zitat",
        insertLink: "Link einfügen",
        label: "Label",
        enterLabel: "Label eingeben",
        link: "Link", // Noun
        enterUrl: "Link-URL eingeben",
        insertImage: "Bild einfügen",
        imgAlt: "Beschriebung (alt-Text)",
        imgAltDesc: "Gib eine Beschreibung für das Bild ein",
        enterImgUrl: "Bild-URL eingeben",
        image: "Bild",
        inserYtVideo: "YouTube-Video einfügen",
        ytVideoUrl: "YouTube-Video-URL",
        enterYtUrl: "Gib die YouTube-Video-URL ein",
        video: "Video",
        preview: "Vorschau",
        insert: "Einfügen",
        supportsMarkdown: (markdownPageUrl: string) => `Du kannst hier [Markdown](${markdownPageUrl}) nutzen.`,
        keyboardShortcuts: "Tastenkombinationen",
        action: "Aktion",
        shortcut: "Tastenkombination",
        toggleLineWrap: "Zeilenumbruch umschalten",
    },
} satisfies Locale;
