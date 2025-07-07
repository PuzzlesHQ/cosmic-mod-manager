import type { Locale } from "~/locales/types";
import tags from "./tags";

// import { AboutUs } from "./about";
// import { CopyrightPolicy } from "./legal/copyright";
// import { PrivacyPolicy } from "./legal/privacy";
// import { SecurityNotice } from "./legal/security";
// import { Rules } from "./legal/rules";

function Pluralize(num: number, str_1: string, str_234: string, str_other: string) {
    if (num === 1) return str_1;
    const lastDigit = num % 10;

    if (lastDigit === 1) {
        if (Math.floor((num % 100) / 10) === 1) return str_other;
        return str_1;
    }

    if ([2, 3, 4].includes(lastDigit)) return str_234;

    return str_other;
}

export default {
    common: {
        settings: "Настройки",
        success: "Успех",
        error: "Ошибка",
        home: "Главная",
        somethingWentWrong: "Что-то пошло не так!",
        redirecting: "Перенаправляем...",
        accept: "Принять",
        decline: "Отклонить",
        download: "Скачать",
        report: "Пожаловаться",
        copyId: "Скопировать ID",
        all: "Все",
        noResults: "Ничего не найдено",
        // ? more: "More"
    },

    count: {
        downloads: (count, formattedCount) => {
            const word = Pluralize(count, "загрузка", "загрузки", "загрузок");
            return [formattedCount, " ", word];
        },
        followers: (count, formattedCount) => {
            const word = Pluralize(count, "фолловер", "фолловера", "фолловеров");
            return [formattedCount, " ", word];
        },
        projects: (count, formattedCount) => {
            const word = Pluralize(count, "проект", "проекта", "проектов");
            return [formattedCount, " ", word];
        },
        members: (count, formattedCount) => {
            const word = Pluralize(count, "участник", "участника", "участников");
            return [formattedCount, " ", word];
        },
    },

    navbar: {
        mod: "мод",
        mods: "моды",
        datamod: "дата-мод",
        datamods: "дата-моды",
        "resource-pack": "ресурспак",
        "resource-packs": "ресурспаки",
        shader: "шейдер",
        shaders: "шейдеры",
        modpack: "модпак",
        modpacks: "модпаки",
        plugin: "плагин",
        plugins: "плагины",
        // ? New strings
        // world: "world",
        // worlds: "worlds",
        signout: "Выйти",
        profile: "Профиль",
        skipToMainContent: "Перейти к основному контенту",
    },

    homePage: {
        title: (projectType: string) => ["Место, где вы найдете ", projectType, " для Cosmic\u00A0Reach"],
        desc: "Лучшее место для ваших модов Cosmic Reach. Открывайте, играйте и создавайте контент, здесь и сразу.",
        exploreMods: "Найти моды",
    },

    auth: {
        email: "Почта",
        password: "Пароль",
        changePassword: "Сменить пароль",
        // ? loginUsing: "Login using:",
        dontHaveAccount: (signup) => ["Не зарегистрированы? ", signup],
        alreadyHaveAccount: (login) => ["Уже зарегистрированы? ", login],
        forgotPassword: (changePassword) => ["Забыли пароль? ", changePassword],
        signupWithProviders: "Зарегистрируйтесь одним из способов:",
        agreement: (terms, privacyPolicy) => ["Создавая аккаунт, вы соглашаетесь с нашими ", terms, " и ", privacyPolicy, "."],
        invalidCode: "Неверный или уже истекший код",
        didntRequest: "Не запрашивали это?",
        checkSessions: "Посмотреть авторизованные сессии",
        confirmNewPass: "Подтвердите новый пароль",
        confirmNewPassDesc:
            "Новый пароль был недавно добавлен к вашему аккаунту и ожидает подтверждения. Подтвердите ниже, если это были вы.",
        newPass: "Новый пароль",
        newPass_label: "Введите ваш новый пароль",
        confirmPass: "Подтвердите пароль",
        confirmPass_label: "Повторите ваш пароль",
        deleteAccount: "Удалить аккаунт",
        deleteAccountDesc:
            "Удаление аккаунта приведет к удалению всего, что было создано Вами на нашем сайте. Восстановление аккаунта после удаления невозможно.",
        enterEmail: "Введите ваш почтовый адрес",
    },

    settings: {
        account: "Аккаунт",
        preferences: "Настройки",
        publicProfile: "Публичный профиль",
        accountAndSecurity: "Аккаунт и Безопасность",
        sessions: "Сессии",
        toggleFeatures: "Переключение возможностей",
        enableOrDisableFeatures: "Включите или выключите определённые возможности для этого девайса.",
        viewTransitions: "Анимация интерфейса",
        viewTransitionsDesc: "Включить анимации навигации по страницам.",
        accountSecurity: "Безопасность аккаунта",
        changePassTitle: "Сменить пароль от аккаунта",
        addPassDesc: "Добавьте пароль, чтобы иметь возможность входить по логину и паролю.",
        manageAuthProviders: "Управление способами входа",
        manageProvidersDesc: "Добавьте или уберите способы входа в аккаунт.",
        removePass: "Убрать пароль",
        removePassTitle: "Удаление пароля",
        removePassDesc: "После удаления пароля вы потеряете возможность входа по логину и паролю",
        enterCurrentPass: "Введите текущий пароль",
        addPass: "Добавить пароль",
        addPassDialogDesc: "Вы сможете использовать этот пароль для входа в аккаунт",
        manageProviders: "Управление способами входа",
        linkedProviders: "Используемые способы входа",
        linkProvider: (provider: string) => `Добавьте возможность входа в аккаунт через ${provider}`,
        link: "Добавить", // Verb
        sureToDeleteAccount: "Вы уверены, что хотите удалить аккаунт?",
        profileInfo: "Информация о профиле",
        profileInfoDesc: (site: string) => `Информация о вашем профиле доступна на ${site}.`,
        profilePic: "Аватарка",
        bio: "Информация",
        bioDesc: "Кратко опишите себя.",
        visitYourProfile: "Перейти в профиль",
        showIpAddr: "Показать IP-адреса",
        sessionsDesc:
            "На этих девайсах есть активные сессии, вы можете завершить любую сессию в любое время. " +
            "Если вы видите незнакомое устройство, немедленно завершите сессию и смените пароль у соответствующего способа входа.",
        ipHidden: "IP Скрыт",
        lastAccessed: (when: string) => `Последний раз был активен ${when}`,
        created: (when: string) => `Создан ${when}`, // eg: Created a month ago
        sessionCreatedUsing: (providerName: string) => `Сессия создана через ${providerName}`,
        currSession: "Текущая сессия",
        revokeSession: "Завершить сессию",
    },

    dashboard: {
        dashboard: "Панель управления",
        overview: "Основное",
        notifications: "Уведомления",
        activeReports: "Активные жалобы",
        analytics: "Аналитика",
        projects: "Проекты",
        organizations: "Организации",
        collections: "Коллекции",
        // ? collection: "Collection",
        revenue: "Доход",
        manage: "Управление",
        seeAll: "Посмотреть все",
        viewNotifHistory: "Посмотреть историю уведомлений",
        noUnreadNotifs: "У вас нет непрочитанных уведомлений.",
        totalDownloads: "Всего скачиваний",
        fromProjects: (count: number) => `с ${count} проектов`,
        totalFollowers: "Всего фолловеров",
        viewHistory: "Посмотреть историю",
        markAllRead: "Отметить все как прочитанные",
        markRead: "Отметить как прочитанное",
        deleteNotif: "Удалить уведомление",
        received: "Получено",
        history: "История",
        notifHistory: "История уведомлений",
        createProjectInfo: "У вас нет проектов. Нажмите кнопку выше, чтобы создать новый.",
        type: "Тип",
        status: "Статус",
        createProject: "Создать проект",
        creatingProject: "Создание проекта",
        chooseProjectType: "Выберите тип проекта",
        projectTypeDesc: "Выберите подходящий тип для вашего проекта",
        createOrg: "Создать организацию",
        creatingOrg: "Создание организации",
        enterOrgName: "Введите название организации",
        enterOrgDescription: "Кратко опишите вашу организацию",
        // ? creatingACollection: "Creating a collection",
        // ? enterCollectionName: "Enter collection name",
        // ? createCollection: "Create collection",
    },

    search: {
        // Search labels
        project: "Найти проекты",
        mod: "Найти моды",
        "resource-pack": "Найти ресурспаки",
        shader: "Найти шейдеры",
        plugin: "Найти плагины",
        modpack: "Найти модпаки",
        datamod: "Найти дата-моды",
        // ? New string
        // world: "Search worlds",

        // Sorting methods
        showPerPage: "На странице",
        sortBy: "Сортировать по",
        relevance: "Релевантность",
        downloads: "Количество загрузок",
        follow_count: "Количество фолловеров",
        recently_updated: "Недавно обновлённые",
        recently_published: "Недавно опубликованные",

        filters: "Фильтры",
        searchFilters: "Найти фильтры",
        loaders: "Загрузчики",
        gameVersions: "Версии игры",
        channels: "Каналы",
        environment: "Среда",
        category: "Категории",
        feature: "Возможности",
        resolution: "Разрешения",
        performance_impact: "Влияние на производительность",
        license: "Лицензия",
        openSourceOnly: "Только с открытым исходным кодом",
        clearFilters: "Очистить фильтры",

        tags: tags,
        searchItemAuthor: (project, author) => [project, " от ", author],
    },

    project: {
        compatibility: "Совместимость",
        environments: "Среда",
        reportIssues: "Сообщить о проблемах",
        viewSource: "Посмотреть исходный код",
        visitWiki: "Посмотреть вики",
        joinDiscord: "Зайти в Discord-сервер",
        featuredVersions: "Лучшие версии",
        creators: "Создатели",
        organization: "Организация",
        project: "Проект",
        details: "Подробнее",
        // ? New string
        // licensed: (license: string) => ["LICENSED", license, ""],
        updatedAt: (when: string) => `Обновлено ${when}`, // eg: Updated 3 days ago
        publishedAt: (when: string) => `Опубликовано ${when}`, // eg: Published 3 days ago
        gallery: "Галерея",
        changelog: "Список изменений",
        versions: "Версии",
        noProjectDesc: "Описание проекта не заполнено",
        uploadNewImg: "Добавить изображение в галерею",
        uploadImg: "Добавить изображение в галерею",
        galleryOrderingDesc: "Изображение с бОльшим значением будет показано первым.",
        featuredGalleryImgDesc:
            "Лучшее изображение показывается в поиске и в карточке проекта. Только одно изображение может быть помечено лучшим.",
        addGalleryImg: "Добавить изображение в галерею",
        featureImg: "Отметить лучшим",
        unfeatureImg: "Снять отметку лучшего",
        sureToDeleteImg: "Вы уверены, что хотите удалить это изображение?",
        deleteImgDesc: "Это действие удалит изображение навсегда (типо реально навсегда).",
        editGalleryImg: "Редактировать изображение",
        currImage: "Текущее изображение",

        // Version
        uploadVersion: "Загрузить версию",
        uploadNewVersion: "Загрузить новую версию",
        showDevVersions: "Показать разрабатываемые версии",
        noProjectVersions: "Версий не найдено",
        stats: "Статистика",
        published: "Опубликовано", // Used for table headers
        downloads: "Загрузки", // Used for table headers
        openInNewTab: "Открыть в новой вкладке",
        copyLink: "Копировать ссылку",
        doesNotSupport: (project: string, version: string, loader: string) => {
            return `${project} не поддерживает версию ${version} для ${loader}`;
        },
        downloadProject: (project: string) => `Скачать ${project}`,
        gameVersion: (version) => ["Версия игры: ", version],
        selectGameVersion: "Выберите версию игры",
        platform: (loader) => ["Платформа: ", loader],
        selectPlatform: "Выберите платформу",
        onlyAvailableFor: (project: string, platform: string) => `${project} доступен только для ${platform}`,
        noVersionsAvailableFor: (gameVersion: string, loader: string) => `Версий не найдено для ${gameVersion} на ${loader}`,
        declinedInvitation: "Отклонённое приглашение",
        teamInvitationTitle: (teamType: string) => `Приглашение для присоединения к ${teamType}`, // teamType = organization | project
        teamInviteDesc: (teamType: string, role: string) => `Вы были приглашены стать частью ${teamType} в качестве ${role}.`,

        browse: {
            mod: "Найти моды",
            datamod: "Найти дата-моды",
            "resource-pack": "Найти ресурспаки",
            shader: "Найти шейдеры",
            modpack: "Найти модпаки",
            plugin: "Найти плагины",
            // ? New string
            world: "Browse worlds",
        },

        rejected: "Отклонено",
        withheld: "Скрыт",
        archivedMessage: (project: string) =>
            `Проект ${project} был архивирован. Он не будет получать никаких обновлений до тех пор, пока автор не решит разархивировать его.`,
        publishingChecklist: {
            required: "Обязательно",
            suggestion: "Предложение",
            review: "Рассмотреть",
            progress: "Прогресс:",
            title: "План публикации",
            uploadVersion: "Загрузите версию",
            uploadVersionDesc:
                "Для того, чтобы проект можно было отправить на рассмотрение, необходимо загрузить как минимум одну версию.",
            addDescription: "Добавьте описание",
            addDescriptionDesc: "Необходимо понятное описание к проекту.",
            addIcon: "Добавьте иконку",
            addIconDesc: "Желательно, чтобы ваш проект имел красивую и уникальную иконку, чтобы его можно было легко заметить.",
            featureGalleryImg: "Добавьте лучшее изображение",
            featureGalleryImgDesc: "Лучшие изображения могут создать первое впечатление у пользователей.",
            selectTags: "Выберите теги",
            selectTagsDesc: "Выберите все подходящие теги.",
            addExtLinks: "Добавьте ссылки",
            addExtLinksDesc: "Любые полезные ссылки, например, на исходный код, вики и так далее.",
            selectLicense: "Выберите лицензию",
            selectLicenseDesc: (projectType: string) => `Выберите лицензию, под которой вы распространяете ${projectType}.`,
            selectEnv: "Выберите поддерживаемые среды",
            selectEnvDesc: (projectType: string) => `Выберите среды, где применяется ваш ${projectType}.`,
            // ? New string
            // requiredStepsDesc: "All marked with an asterisk(*) are required",
            submitForReview: "Отправить на рассмотрение",
            submitForReviewDesc:
                "Ваш проект виден только для участников. Он должен быть рассмотрен модераторами, чтобы стать доступным для всех.",
            resubmitForReview: "Повторно отправить на рассмотрение",
            resubmit_ApprovalRejected:
                "Ваш проект был отклонён модератором. В большинстве случаев вы можете отправить проект на повторное рассмотрение после выполнения требований модератора.",
            resubmit_ProjectWithheld:
                "Ваш проект был скрыт модератором. В большинстве случаев вы можете отправить проект на повторное рассмотрение после выполнения требований модератора.",
            visit: {
                versionsPage: "Посетить страницу версий",
                descriptionSettings: "Посетить настройки описания",
                generalSettings: "Посетить основные настройки",
                galleryPage: "Посетить галерею",
                tagSettings: "Посетить настройки тегов",
                linksSettings: "Посетить настройки ссылок",
                licenseSettings: "Посетить настройки лицензии",
                moderationPage: "Посетить страницу модерации",
            },
        },
    },

    version: {
        deleteVersion: "Удалить версию",
        sureToDelete: "Вы уверены, что хотите удалить эту версию?",
        deleteDesc: "Это действие удалит эту версию навсегда (типо реально навсегда).",
        enterVersionTitle: "Введите название версии...",
        feature: "Пометить версию лучшей",
        unfeature: "Снять отметку Лучшая с версии",
        featured: "Лучшие",
        releaseChannel: "Канал релизов",
        versionNumber: "Номер версии",
        selectLoaders: "Выберите загрузчики",
        selectVersions: "Выберите версии",
        cantAddCurrProject: "Нельзя добавить текущий проект как зависимость",
        cantAddDuplicateDep: "Нельзя добавить одну и ту же зависимость два раза",
        addDep: "Добавить зависимость",
        enterProjectId: "Введите ID/Slug проекта",
        enterVersionId: "Введите ID/Slug версии",
        dependencies: "Зависимости",
        files: "Файлы",

        depencency: {
            required: "Обязательно",
            optional: "Необязательно",
            incompatible: "Несовместимо",
            embedded: "Встроено",
            required_desc: (version: string) => `Версия ${version} обязательна`,
            optional_desc: (version: string) => `Версия ${version} необязательна`,
            incompatible_desc: (version: string) => `Версия ${version} несовместима`,
            embedded_desc: (version: string) => `Версия ${version} встроена`,
        },

        primary: "Основной",
        noPrimaryFile: "Основной файл не выбран",
        chooseFile: "Выбрать файл",
        replaceFile: "Заменить файл",
        uploadExtraFiles: "Загрузить дополнительные файлы",
        uploadExtraFilesDesc: "Используется для дополнительных файлов, таких как исходники, документация и так далее.",
        selectFiles: "Выбрать файлы",
        primaryFileRequired: "Основной файл обязателен",
        metadata: "Метаданные",
        devReleasesNote: "ВНИМАНИЕ:- Старые dev-релизы будут удалены после публикации нового.",
        publicationDate: "Опубликовано",
        publisher: "Пользователь",
        versionID: "ID Версии",
        copySha1: "Копировать SHA-1 хеш",
        copySha512: "Копировать SHA-512 хеш",
        copyFileUrl: "Копировать URL файла",
    },

    projectSettings: {
        settings: "Настройки проекта",
        general: "Основное",
        tags: "Теги",
        links: "Ссылки",
        members: "Участники",
        view: "Отображение",
        upload: "Загруженное",
        externalLinks: "Внешние ссылки",
        issueTracker: "Трекер проблем",
        issueTrackerDesc:
            "Место, где пользователи делятся своими проблемами, ошибками и переживаниями касательно вашего проекта.",
        sourceCode: "Исходный код",
        sourceCodeDesc: "Страница/репозиторий, где содержится исходный код вашего проекта.",
        wikiPage: "Вики",
        wikiPageDesc: "Страница, содержащая информацию, документацию и помощь к вашему проекту.",
        discordInvite: "Приглашение в Discord",
        discordInviteDesc: "Ссылка-приглашение на ваш Discord сервер.",
        licenseDesc: (projectType) =>
            `Очень важно выбрать правильную лицензию для ${projectType}. Вы можете выбрать одну из нашего списка или использовать свою. Вы также можете оставить ссылку на свою лицензию; иначе, будет отображен текст лицензии.`,
        customLicenseDesc:
            "Введите корректный [SPDX идентификатор лицензии](https://spdx.org/licenses) в указанную область. Если ваша лицензия не имеет SPDX идентификатор (например, если вы создали лицензию сами или лицензия специфична для Cosmic Reach), просто поставьте галочку и введите название лицензии.",
        selectLicense: "Выберите лицензию",
        custom: "Своя",
        licenseName: "Название лицензии",
        licenseUrl: "URL Лицензии (необязательно)",
        spdxId: "SPDX идентификатор",
        doesntHaveSpdxId: "Лицензия не имеет SPDX идентификатор",
        // ? Use the projectType string instead of "Mod"
        tagsDesc: (_projectType) =>
            "Правильно выбранные теги помогут людям найти ваш мод. Убедитесь, что выбрали все подходящие теги.",
        featuredCategories: "Избранные категории",
        featuredCategoriesDesc: (count) => `Вы можете избрать до ${count} самых релевантных тегов.`,
        selectAtLeastOneCategory: "Выберите как минимум одну категорию, чтобы сделать ее избранной.",
        projectInfo: "Информация о проекте",
        clientSide: "Клиент",
        clientSideDesc: (projectType) => `Выберите, если ваш ${projectType} имеет функционал на клиенте.`,
        serverSide: "Сервер",
        serverSideDesc: (projectType) => `Выберите, если ваш ${projectType} имеет функционал на сервере.`,
        unknown: "Неизвестно",
        clientOrServer: "Клиент или сервер",
        clientAndServer: "Клиент и сервер",
        required: "Обязательно",
        optional: "Необязательно",
        unsupported: "Не поддерживается",
        visibilityDesc:
            "Публичные и архивированные проекты видны в поиске. Непубличные проекты доступны по ссылке, но не отображаются в поиске и профиле. Приватные проекты доступны только его участникам.",
        ifApproved: "Если одобрено модераторами:",
        visibleInSearch: "Отображается в поиске",
        visibleOnProfile: "Отображается в профиле",
        visibleViaUrl: "Доступен по ссылке",
        visibleToMembersOnly: "Только участники проекта смогут его просматривать",
        listed: "Публичный",
        private: "Приватный",
        unlisted: "По ссылке",
        archived: "Архивирован",
        deleteProject: "Удалить проект",
        deleteProjectDesc: (site) =>
            `Удалит ваш проект с серверов ${site}'s и поиска. Если вы нажмёте на эту кнопку, ваш проект будет удалён, так что будьте очень осторожны!`,
        sureToDeleteProject: "Вы уверены, что хотите удалить этот проект?",
        deleteProjectDesc2:
            "Если вы продолжите, все версии и любые другие данные будут удалены с наших серверов. Это может поломать другие проекты, так что будьте очень осторожны!.",
        typeToVerify: (projectName) => `Чтобы подтвердить, введите **${projectName}** ниже:`,
        typeHere: "Введите сюда...",
        manageMembers: "Управлять участниками",
        leftProjectTeam: "Вы покинули команду проекта",
        leaveOrg: "Покинуть организацию",
        leaveProject: "Покинуть проект",
        leaveOrgDesc: "Уберет вас из списка участников этой организации.",
        leaveProjectDesc: "Уберет вас из списка участников этого проекта.",
        sureToLeaveTeam: "Вы уверены, что хотите покинуть эту команду?",
        cantManageInvites: "У вас нет доступа к управлению приглашениями",
        inviteMember: "Пригласить участника",
        inviteProjectMemberDesc: "Введите имя пользователя, которого вы хотите пригласить в проект в качестве участника.",
        inviteOrgMemberDesc: "Введите имя пользователя, которого вы хотите пригласить в организацию в качестве участника.",
        invite: "Пригласить",
        memberUpdated: "Участник успешно обновлён",
        pending: "Ожидает",
        role: "Роль",
        roleDesc: "Название роли, которую этот участник играет в команде.",
        permissions: "Разрешения",
        perms: {
            upload_version: "Загружать версии",
            delete_version: "Удалять версии",
            edit_details: "Редактировать подробности",
            edit_description: "Редактировать описание",
            manage_invites: "Управлять приглашениями",
            remove_member: "Удалять участников",
            edit_member: "Редактировать участников",
            delete_project: "Удалять проект",
            view_analytics: "Просматривать аналитику",
            view_revenue: "Просматривать доход",
        },
        owner: "Владелец",
        removeMember: "Удалить участника",
        transferOwnership: "Передать роль владельца",
        overrideValues: "Переопределить значения",
        overrideValuesDesc:
            "Переопределите стандартные значения и назначьте специальные разрешения и роли для этого участника проекта.",
        projectNotManagedByOrg:
            "Этот проект не находится под управлением организации. If you are the member of any organizations, you can transfer management to one of them.",
        transferManagementToOrg: "Передать управление",
        selectOrg: "Выберите организацию",
        projectManagedByOrg: (orgName: string) =>
            `Этот проект находится под управлением организации ${orgName}. Стандартные разрешения установлены в настройках организации. Вы можете переопределить их ниже.`,
        removeFromOrg: "Удалить из организации",
        memberRemoved: "Участник успешно удалён",
        sureToRemoveMember: (memberName: string) => `Вы уверены, что хотите удалить ${memberName} из этой командны?`,
        ownershipTransfered: "Роль владельца успешно передана",
        sureToTransferOwnership: (memberName: string) =>
            `Вы уверены, что хотите передать роль владельца участнику ${memberName}?`,
    },

    organization: {
        orgDoesntHaveProjects: "Эта организация пока что не имеет никаких проектов.",
        manageProjects: "Управлять проектами",
        orgSettings: "Настройки организации",
        transferProjectsTip: "Вы можете перенести свои проекты в организацию через: Настройки проекта > Участники",
        noProjects_CreateOne: "Эта организация пока что не имеет никаких проектов. Нажмите на кнопку выше, чтобы создать новый.",
        orgInfo: "Информация об организации",
        deleteOrg: "Удалить организацию",
        deleteOrgDesc: "Удаление организации приведет к переносу всех проектов к её владельцу. Это действие нельзя отменить.",
        sureToDeleteOrg: "Вы уверены, что хотите удалить эту организацию?",
        deleteOrgNamed: (orgName: string) => `Удалить организацию ${orgName}`,
        deletionWarning: "Это действие удалит организацию навсегда (типо реально навсегда).",

        perms: {
            edit_details: "Редактировать подробности",
            manage_invites: "Управлять приглашениями",
            remove_member: "Удалять участников",
            edit_member: "Редактировать участников",
            add_project: "Создавать/добавлять проекты",
            remove_project: "Удалять проекты",
            delete_organization: "Удалять организацию",
            edit_member_default_permissions: "Редактировать стандартные разрешения участников",
        },
    },

    user: {
        admin: "Администратор",
        moderator: "Модератор",
        doesntHaveProjects: (user: string) => `У пользователя ${user} ещё нет проектов.`,
        isntPartOfAnyOrgs: (user: string) => `Пользователь ${user} не принадлежит ни одной организации.`,
        joined: (when: string) => `Присоединился ${when}`, // eg: Joined 2 months ago
    },

    footer: {
        resources: "Ресурсы",
        docs: "Документация",
        status: "Статус",
        support: "Поддержка",
        socials: "Контакты",
        about: "О нас",
        changeTheme: "Сменить тему",
        siteOfferedIn: (site: string) => `${site} доступен на следующих языках:`,
    },

    legal: {
        legal: "Документы",
        rulesTitle: "Контент",
        // contentRules: Rules,
        termsTitle: "Условия использования",
        // termsOfUse: TermsOfUse,
        copyrightPolicyTitle: "Политика авторских прав",
        // copyrightPolicy: CopyrightPolicy,
        securityNoticeTitle: "Безопасность",
        // securityNotice: SecurityNotice,
        privacyPolicyTitle: "Политика Конфиденциальности",
        // privacyPolicy: PrivacyPolicy,

        // About us page
        // aboutUs: AboutUs
    },

    moderation: {
        review: "Рассмотреть проекты",
        reports: "Жалобы",
        moderation: "Модерация",
        statistics: "Статистика",
        authors: "Авторы",
        projectsInQueue: (count: number) => {
            const lastDigit = count % 10;

            if (lastDigit === 1) return "1 проект ожидает одобрения.";
            if ([2, 3, 4].includes(lastDigit)) return `${count} проекта ожидают одобрения.`;
            return `${count} проектов ожидают одобрения.`;
        },
        // hours will either be 24 or 48
        projectsQueuedFor: (count: number, hours: number) => {
            const lastDigit = count % 10;

            if (lastDigit === 1) return `1 ожидает одобрения уже более ${hours} часов.`;
            if ([2, 3, 4].includes(lastDigit)) return `${count} проекта ожидают одобрения уже более ${hours} часов.`;
            return `${count} проектов ожидают одобрения уже более ${hours} часов.`;
        },
        submitted: (when: string) => `Отправлен на одобрение ${when}`, // eg: Created 4 hours ago, (the date string comes from the localized phrases defined at end of the file)
        viewProject: "Посмотреть проект",
        awaitingApproval: "Проект ожидает одобрения",
        draft: "Черновик",
        approve: "Одобрить",
        reject: "Отклонить",
        withhold: "Скрыть",
    },

    form: {
        login: "Войти",
        login_withSpace: "Войти",
        signup: "Регистрация",
        email: "Почта",
        username: "Имя пользователя",
        password: "Пароль",
        name: "Название",
        // ? New string
        // displayName: "Display name",
        icon: "Иконка",
        details: "Подробности",
        description: "Описание",
        id: "ID",
        url: "URL",
        projectType: "Тип проекта",
        visibility: "Видимость",
        summary: "Основное",
        title: "Название",
        ordering: "Упорядочивание",
        featured: "Лучшее",
        continue: "Продолжить",
        submit: "Отправить",
        remove: "Удалить",
        confirm: "Подтвердить",
        edit: "Изменить",
        delete: "Удалить",
        cancel: "Отмена",
        saveChanges: "Сохранить изменения",
        uploadIcon: "Загрузить иконку",
        removeIcon: "Удалить иконку",
        noFileChosen: "Файл не выбран",
        showAllVersions: "Показать все версии",
    },

    error: {
        sthWentWrong: "Ой! Что-то пошло не так",
        errorDesc: "Кажется, что-то сломалось. Пока мы пытаемся исправить проблему, попробуйте перезагрузить страницу.",
        refresh: "Перезагрузить",
        pageNotFound: "404 | Страница не найдена.",
        pageNotFoundDesc: "Извините, нам не удалось найти запрашиваемую Вами страницу.",
        projectNotFound: "Проект не найден",
        projectNotFoundDesc: (type: string, slug: string) => `${type} со slug/ID "${slug}" не существует.`,
    },

    editor: {
        heading1: "Заголовок 1",
        heading2: "Заголовок 2",
        heading3: "Заголовок 3",
        bold: "Жирный",
        italic: "Курсив",
        underline: "Подчеркнутый",
        strikethrough: "Зачеркнутый",
        code: "Код",
        spoiler: "Спойлер",
        bulletedList: "Непронумерованный список",
        numberedList: "Пронумерованный список",
        quote: "Цитата",
        insertLink: "Вставить ссылку",
        label: "Название",
        enterLabel: "Введите название",
        link: "Ссылка", // Noun
        enterUrl: "Введите ссылку",
        insertImage: "Вставить изображение",
        imgAlt: "Описание (альтернативный текст)",
        imgAltDesc: "Введите описание к изображению",
        enterImgUrl: "Введите ссылку на изображение",
        image: "Изображение",
        inserYtVideo: "Вставьте YouTube-видео",
        ytVideoUrl: "Ссылка на YouTube-видео",
        enterYtUrl: "Введите ссылку на YouTube-видео",
        video: "Видео",
        preview: "Предпросмотр",
        insert: "Вставить",
    },
} satisfies Locale;
