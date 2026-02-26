import type { Locale } from "~/locales/types";
// import { AboutUs } from "./about";
// import { CopyrightPolicy } from "./legal/copyright";
// import { PrivacyPolicy } from "./legal/privacy";
// import { SecurityNotice } from "./legal/security";
import { Rules } from "./legal/rules";
import tags from "./tags";

function Pluralize(count: number, singular: string, plural: string) {
    return count === 1 ? singular : plural;
}

export default {
    common: {
        settings: "Ajustes",
        success: "Éxito",
        error: "Error",
        home: "Inicio",
        somethingWentWrong: "¡Algo salió mal!",
        redirecting: "Redirigiendo...",
        accept: "Aceptar",
        decline: "Rechazar",
        download: "Descargar",
        report: "Reportar",
        copyId: "Copiar ID",
        all: "Todo",
        noResults: "Sin resultados",
        more: "Más",
    },

    count: {
        downloads: (count, formattedCount) => {
            const downloads = Pluralize(count, "descarga", "descargas");
            return [formattedCount, " ", downloads];
        },
        followers: (count, formattedCount) => {
            const followers = Pluralize(count, "seguidor", "seguidores");
            return [formattedCount, " ", followers];
        },
        projects: (count, formattedCount) => {
            const projects = Pluralize(count, "proyecto", "proyectos");
            return [formattedCount, " ", projects];
        },
        members: (count, formattedCount) => {
            const members = Pluralize(count, "miembro", "miembros");
            return [formattedCount, " ", members];
        },
    },

    navbar: {
        mod: "mod",
        mods: "mods",
        datamod: "datamod",
        datamods: "datamods",
        "resource-pack": "paquete de recursos",
        "resource-packs": "paquetes de recursos",
        shader: "shader",
        shaders: "shaders",
        modpack: "paquete de mods",
        modpacks: "paquetes de mods",
        plugin: "plugin",
        plugins: "plugins",
        world: "mundo",
        worlds: "mundos",
        signout: "Cerrar sesión",
        profile: "Perfil",
        skipToMainContent: "Ir al contenido principal",
    },

    homePage: {
        title: (projectType: string) => ["El lugar para ", projectType, " de Cosmic\u00A0Reach"],
        desc: "El mejor lugar para tus mods de Cosmic Reach. Descubre, juega y crea contenido, todo en un solo sitio.",
        exploreMods: "Explorar mods",
    },

    auth: {
        email: "Correo electrónico",
        password: "Contraseña",
        changePassword: "Cambiar contraseña",
        loginUsing: "Inicia sesión usando:",
        dontHaveAccount: (signup) => ["¿No tienes una cuenta? ", signup],
        alreadyHaveAccount: (login) => ["¿Ya tienes una cuenta? ", login],
        forgotPassword: (changePassword) => ["¿Olvidaste tu contraseña? ", changePassword],
        signupWithProviders: "Regístrate usando cualquiera de los proveedores de autenticación:",
        agreement: (terms, privacyPolicy) => [
            "Al crear una cuenta, aceptas nuestros ",
            terms,
            " y ",
            privacyPolicy,
            ".",
        ],
        invalidCode: "Código inválido o expirado",
        didntRequest: "¿No solicitaste esto?",
        checkSessions: "Revisar sesiones iniciadas",
        confirmNewPass: "Confirmar nueva contraseña",
        confirmNewPassDesc:
            "Recientemente se añadió una nueva contraseña a tu cuenta y está pendiente de confirmación. Confirma abajo si fuiste tú.",
        newPass: "Nueva contraseña",
        newPass_label: "Ingresa tu nueva contraseña",
        confirmPass: "Confirmar contraseña",
        confirmPass_label: "Vuelve a ingresar tu contraseña",
        deleteAccount: "Eliminar cuenta",
        deleteAccountDesc:
            "Al eliminar tu cuenta, se borrarán todos tus datos de nuestra base de datos. Este proceso es irreversible.",
        enterEmail: "Ingresa tu dirección de correo electrónico",
    },

    settings: {
        account: "Cuenta",
        preferences: "Preferencias",
        publicProfile: "Perfil público",
        accountAndSecurity: "Cuenta y seguridad",
        sessions: "Sesiones",
        toggleFeatures: "Activar o desactivar funciones",
        enableOrDisableFeatures: "Activa o desactiva ciertas funciones en este dispositivo.",
        viewTransitions: "Ver transiciones",
        viewTransitionsDesc: "Activa transiciones (morph) al navegar entre páginas.",
        accountSecurity: "Seguridad de la cuenta",
        changePassTitle: "Cambiar la contraseña de tu cuenta",
        addPassDesc: "Añadir una contraseña para utilizar el inicio de sesión con credenciales",
        manageAuthProviders: "Gestionar proveedores de autenticación",
        manageProvidersDesc: "Añade o elimina métodos de inicio de sesión de tu cuenta.",
        removePass: "Eliminar contraseña",
        removePassTitle: "Eliminar la contraseña de tu cuenta",
        removePassDesc:
            "Después de eliminar tu contraseña, no podrás usar credenciales para iniciar sesión en tu cuenta",
        enterCurrentPass: "Ingresa tu contraseña actual",
        addPass: "Añadir contraseña",
        addPassDialogDesc: "Podrás usar esta contraseña para iniciar sesión en tu cuenta",
        manageProviders: "Gestionar proveedores",
        linkedProviders: "Proveedores de autenticación vinculados",
        linkProvider: (provider: string) => `Vincular ${provider} a tu cuenta`,
        link: "Vincular", // Verb
        sureToDeleteAccount: "¿Estás seguro de que quieres eliminar tu cuenta?",
        profileInfo: "Información del perfil",
        profileInfoDesc: (site: string) => `Tu información de perfil es visible públicamente en ${site}.`,
        profilePic: "Foto de perfil",
        bio: "Biografía",
        bioDesc: "Una breve descripción para contarle a todos un poco sobre ti.",
        visitYourProfile: "Visitar tu perfil",
        showIpAddr: "Mostrar direcciones IP",
        sessionsDesc:
            "Estos dispositivos están actualmente conectados a tu cuenta. Puedes revocar cualquier sesión en cualquier momento. Si ves algo que no reconoces, revoca la sesión inmediatamente y cambia la contraseña del proveedor de autenticación asociado.",
        ipHidden: "IP oculta",
        lastAccessed: (when: string) => `Último acceso ${when}`,
        created: (when: string) => `Creado ${when}`, // eg: Created a month ago
        sessionCreatedUsing: (providerName: string) => `Sesión creada usando ${providerName}`,
        currSession: "Sesión actual",
        revokeSession: "Revocar sesión",
    },

    dashboard: {
        dashboard: "Panel de control",
        overview: "Vista general",
        notifications: "Notificaciones",
        activeReports: "Reportes activos",
        analytics: "Análisis",
        projects: "Proyectos",
        organizations: "Organizaciones",
        collections: "Colecciones",
        collection: "Colección",
        revenue: "Ingresos",
        manage: "Gestionar",
        seeAll: "Ver todo",
        viewNotifHistory: "Ver historial de notificaciones",
        noUnreadNotifs: "No tienes notificaciones no leídas.",
        totalDownloads: "Descargas totales",
        fromProjects: (count: number) => {
            const projects = Pluralize(count, "proyecto", "proyectos");
            return `de ${count} ${projects}`;
        },
        totalFollowers: "Seguidores totales",
        viewHistory: "Ver historial",
        markAllRead: "Marcar todo como leído",
        markRead: "Marcar como leído",
        deleteNotif: "Eliminar notificación",
        received: "Recibido",
        history: "Historial",
        notifHistory: "Historial de notificaciones",
        createProjectInfo: "No tienes proyectos. Haz clic en el botón de arriba para crear uno.",
        type: "Tipo",
        status: "Estado",
        createProject: "Crear un proyecto",
        creatingProject: "Creando un proyecto",
        chooseProjectType: "Elige el tipo de proyecto",
        projectTypeDesc: "Selecciona el tipo adecuado para tu proyecto",
        createOrg: "Crear una organización",
        creatingOrg: "Creando una organización",
        enterOrgName: "Ingresa el nombre de la organización",
        enterOrgDescription: "Ingresa una breve descripción de tu organización",
        creatingACollection: "Creando una colección",
        enterCollectionName: "Ingresa el nombre de la colección",
        createCollection: "Crear una colección",
    },

    search: {
        // Search labels
        project: "Buscar proyectos",
        mod: "Buscar mods",
        "resource-pack": "Buscar paquetes de recursos",
        shader: "Buscar shaders",
        plugin: "Buscar plugins",
        modpack: "Buscar paquetes de mods",
        datamod: "Buscar datamods",
        world: "Buscar mundos",

        // Sorting methods
        showPerPage: "Mostrar por página",
        sortBy: "Ordenar por",
        relevance: "Relevancia",
        // ? New string
        // trending: "Trending",
        downloads: "Descargas",
        follow_count: "Seguidores",
        recently_updated: "Actualizado recientemente",
        recently_published: "Publicado recientemente",

        // View types
        view: {
            gallery: "Vista de galería",
            list: "Vista de lista",
        },

        filters: "Filtros",
        searchFilters: "Filtros de búsqueda",
        loaders: "Cargadores",
        gameVersions: "Versiones del juego",
        channels: "Canales",
        environment: "Entorno",
        category: "Categorías", // The key is kept singular just for ease of acess, the string is plural
        feature: "Características", // __
        resolution: "Resoluciones", // __
        performance_impact: "Impacto en el rendimiento",
        license: "Licencia",
        openSourceOnly: "Solo código abierto",
        clearFilters: "Limpiar todos los filtros",

        tags: tags,
        searchItemAuthor: (project, author) => [project, " por ", author],
    },

    project: {
        compatibility: "Compatibilidad",
        environments: "Entornos",
        reportIssues: "Informar problemas",
        viewSource: "Ver código fuente",
        visitWiki: "Visitar wiki",
        joinDiscord: "Unirse al servidor de Discord",
        featuredVersions: "Versiones destacadas",
        creators: "Creadores",
        organization: "Organización",
        project: "Proyecto",
        details: "Detalles",
        licensed: (license) => ["Con licencia ", license],
        updatedAt: (when) => `Actualizado ${when}`, // eg: Updated 3 days ago
        publishedAt: (when) => `Publicado ${when}`, // eg: Published 3 days ago
        gallery: "Galería",
        changelog: "Registro de cambios",
        versions: "Versiones",
        noProjectDesc: "No se proporcionó una descripción del proyecto",
        uploadNewImg: "Subir una nueva imagen a la galería",
        uploadImg: "Subir imagen a la galería",
        galleryOrderingDesc: "Las imágenes con un orden más alto se mostrarán primero.",
        featuredGalleryImgDesc:
            "Solo se puede destacar una imagen de la galería, la cual aparecerá tanto en los resultados de búsqueda como en la tarjeta del proyecto.",
        addGalleryImg: "Añadir imagen a la galería",
        featureImg: "Destacar imagen",
        unfeatureImg: "Quitar imagen destacada",
        sureToDeleteImg: "¿Estás seguro de que quieres eliminar esta imagen de la galería?",
        deleteImgDesc: "Esto eliminará esta imagen de la galería para siempre (de verdad, para siempre).",
        editGalleryImg: "Editar imagen de la galería",
        currImage: "Imagen actual",

        // Version
        uploadVersion: "Subir una versión",
        uploadNewVersion: "Subir una nueva versión del proyecto",
        showDevVersions: "Mostrar versiones en desarrollo",
        noProjectVersions: "No se encontraron versiones del proyecto",
        stats: "Estadísticas",
        published: "Publicado", // Used for table headers
        downloads: "Descargas", // Used for table headers
        openInNewTab: "Abrir en una nueva pestaña",
        copyLink: "Copiar enlace",
        doesNotSupport: (project: string, version: string, loader: string) => {
            return `${project} no es compatible con la versión ${version} de ${loader}`;
        },
        downloadItem: (project: string) => `Descargar ${project}`,
        gameVersion: (version) => ["Versión del juego: ", version],
        selectGameVersion: "Seleccionar versión del juego",
        platform: (loader) => ["Plataforma: ", loader],
        selectPlatform: "Seleccionar plataforma",
        onlyAvailableFor: (project: string, platform: string) => `${project} solo está disponible para ${platform}`,
        noVersionsAvailableFor: (gameVersion: string, loader: string) =>
            `No hay versiones disponibles para la ${gameVersion} en ${loader}`,
        declinedInvitation: "Invitación rechazada",
        teamInvitationTitle: (teamType: string) => `Invitación para unirse a un equipo (${teamType})`, // teamType = organization | project
        teamInviteDesc: (teamType: string, role: string) =>
            `Te invitaron a ser miembro de este equipo (${teamType}) con el rol de '${role}'.`,

        browse: {
            mod: "Explorar mods",
            datamod: "Explorar datamods",
            "resource-pack": "Explorar paquetes de recursos",
            shader: "Explorar shaders",
            modpack: "Explorar paquetes de mods",
            plugin: "Explorar plugins",
            world: "Explorar mundos",
        },

        rejected: "Rechazado",
        withheld: "Suspendido",
        archivedMessage: (project: string) =>
            `${project} ha sido archivado. No recibirá más actualizaciones a menos que el autor decida desarchivarlo.`,
        publishingChecklist: {
            required: "Requerido",
            suggestion: "Sugerencia",
            review: "Revisión",
            progress: "Progreso:",
            title: "Guía de publicación",
            uploadVersion: "Subir una versión",
            uploadVersionDesc: "Se requiere al menos una versión para enviar un proyecto a revisión.",
            addDescription: "Añadir una descripción",
            addDescriptionDesc:
                "Se requiere una descripción que explique claramente el propósito y la función del proyecto.",
            addIcon: "Añadir un icono",
            addIconDesc: "Tu proyecto merece un icono llamativo que lo distinga al instante.",
            featureGalleryImg: "Destacar una imagen en la galería",
            featureGalleryImgDesc:
                "Las imágenes destacadas en la galería pueden ser la primera impresión para muchos usuarios.",
            selectTags: "Seleccionar etiquetas",
            selectTagsDesc: "Selecciona todas las etiquetas que correspondan a tu proyecto.",
            addExtLinks: "Añadir enlaces externos",
            addExtLinksDesc:
                "Añade enlaces relevantes, como fuentes, un sitio web para rastrear errores o una invitación de Discord.",
            selectLicense: "Seleccionar licencia",
            selectLicenseDesc: (projectType: string) =>
                `Selecciona la licencia bajo la cual se distribuye tu ${projectType}.`,
            selectEnv: "Seleccionar entornos compatibles",
            selectEnvDesc: (projectType: string) =>
                `Selecciona si el ${projectType} funciona en el lado del cliente o del servidor.`,
            requiredStepsDesc: "Todo lo que está marcado con un asterisco (*) es obligatorio",
            submitForReview: "Enviar para revisión",
            submitForReviewDesc:
                "Tu proyecto solo es visible para los miembros del proyecto. Debe ser revisado por moderadores para ser publicado.",
            resubmitForReview: "Volver a enviar para revisión",
            resubmit_ApprovalRejected:
                "Tu proyecto ha sido rechazado por nuestro moderador. En la mayoría de los casos, puedes volver a enviarlo para revisión después de atender el mensaje del moderador.",
            resubmit_ProjectWithheld:
                "Tu proyecto ha sido suspendido por nuestro moderador. En la mayoría de los casos, puedes volver a enviarlo para revisión después de atender el mensaje del moderador.",
            visit: {
                versionsPage: "Visitar la página de versiones",
                descriptionSettings: "Visitar los ajustes de descripción",
                generalSettings: "Visitar los ajustes generales",
                galleryPage: "Visitar la página de galería",
                tagSettings: "Visitar los ajustes de etiquetas",
                linksSettings: "Visitar los ajustes de enlaces",
                licenseSettings: "Visitar los ajustes de licencia",
                moderationPage: "Visitar la página de moderación",
            },
        },
    },

    version: {
        deleteVersion: "Eliminar versión",
        sureToDelete: "¿Estás seguro de que quieres eliminar esta versión?",
        deleteDesc: "Esto eliminará esta versión para siempre (de verdad, para siempre).",
        enterVersionTitle: "Ingresa el título de la versión...",
        feature: "Destacar versión",
        unfeature: "Quitar versión destacada",
        featured: "Destacada",
        releaseChannel: "Canal de lanzamiento",
        versionNumber: "Número de versión",
        selectLoaders: "Seleccionar cargadores",
        selectVersions: "Seleccionar versiones",
        cantAddCurrProject: "No puedes añadir el proyecto actual como dependencia",
        cantAddDuplicateDep: "No puedes añadir la misma dependencia dos veces",
        addDep: "Añadir dependencia",
        enterProjectId: "Ingresa el ID/Slug del proyecto",
        enterVersionId: "Ingresa el ID/Slug de la versión",
        dependencies: "Dependencias",
        files: "Archivos",

        depencency: {
            required: "Requerida",
            optional: "Opcional",
            incompatible: "Incompatible",
            embedded: "Incorporada",
            required_desc: (version: string) => `La versión ${version} es requerida`,
            optional_desc: (version: string) => `La versión ${version} es opcional`,
            incompatible_desc: (version: string) => `La versión ${version} es incompatible`,
            embedded_desc: (version: string) => `La versión ${version} está incorporada`,
        },

        primary: "Principal",
        noPrimaryFile: "No se ha elegido un archivo principal",
        chooseFile: "Elegir archivo",
        replaceFile: "Reemplazar archivo",
        uploadExtraFiles: "Subir archivos adicionales",
        uploadExtraFilesDesc: "Usado para archivos adicionales como fuentes, documentación, etc.",
        selectFiles: "Seleccionar archivos",
        primaryFileRequired: "Se requiere un archivo principal",
        metadata: "Metadatos",
        devReleasesNote:
            "NOTA: Las versiones en desarrollo antiguas serán eliminadas automáticamente después de que se publique una nueva versión en desarrollo.",
        publicationDate: "Fecha de publicación",
        publisher: "Editor",
        versionID: "ID de versión",
        copySha1: "Copiar hash SHA-1",
        copySha512: "Copiar hash SHA-512",
        copyFileUrl: "Copiar URL del archivo",

        publishedBy: (version, author, publish_date) => [version, " por ", author, " el ", publish_date],
    },

    projectSettings: {
        settings: "Ajustes del proyecto",
        general: "General",
        tags: "Etiquetas",
        links: "Enlaces",
        members: "Miembros",
        view: "Ver",
        upload: "Subir",
        externalLinks: "Enlaces externos",
        issueTracker: "Rastreador de problemas",
        issueTrackerDesc:
            "Un sitio donde los usuarios puedan informar sobre errores o discutir temas relacionados con tu proyecto.",
        sourceCode: "Código fuente",
        sourceCodeDesc: "Una página o repositorio que contiene el código fuente de tu proyecto.",
        wikiPage: "Página wiki",
        wikiPageDesc: "Una página que contiene información, documentación y ayuda para el proyecto.",
        discordInvite: "Invitación a Discord",
        discordInviteDesc: "Un enlace de invitación a tu servidor de Discord.",
        licenseDesc: (projectType: string) =>
            `Es muy importante elegir una licencia adecuada para tu ${projectType}. Puedes elegir una de nuestra lista o proporcionar una licencia personalizada. También puedes proporcionar una URL personalizada para tu licencia elegida; de lo contrario, se mostrará el texto de la licencia.`,
        customLicenseDesc:
            "Ingresa un [identificador de licencia SPDX](https://spdx.org/licenses) válido en el lugar indicado. Si tu licencia no tiene un identificador SPDX (por ejemplo, si creaste la licencia tú mismo o es específica de Cosmic Reach), simplemente marca la casilla e ingresa el nombre de la licencia.",
        selectLicense: "Seleccionar licencia",
        custom: "Personalizada",
        licenseName: "Nombre de la licencia",
        licenseUrl: "URL de la licencia (opcional)",
        spdxId: "Identificador SPDX",
        doesntHaveSpdxId: "La licencia no tiene un identificador SPDX",
        tagsDesc: (projectType: string) =>
            `Es importante etiquetar correctamente para ayudar a las personas a encontrar tu ${projectType}. Asegúrate de seleccionar todas las etiquetas que correspondan.`,
        featuredCategories: "Categorías destacadas",
        featuredCategoriesDesc: (count: number) => `Puedes destacar hasta ${count} de tus etiquetas más relevantes.`,
        selectAtLeastOneCategory: "Selecciona al menos una categoría para destacar.",
        projectInfo: "Información del proyecto",
        clientSide: "Del lado del cliente",
        clientSideDesc: (projectType: string) =>
            `Selecciona si tu ${projectType} tiene funcionalidad en el lado del cliente.`,
        serverSide: "Del lado del servidor",
        serverSideDesc: (projectType: string) =>
            `Selecciona si tu ${projectType} tiene funcionalidad en el servidor lógico.`,
        unknown: "Desconocido",
        clientOrServer: "Cliente o servidor",
        clientAndServer: "Cliente y servidor",
        required: "Requerido",
        optional: "Opcional",
        unsupported: "No compatible",
        visibilityDesc:
            "Los proyectos listados y archivados son visibles en la búsqueda. Los proyectos no listados están publicados, pero no visibles en la búsqueda ni en los perfiles de los usuarios. Los proyectos privados solo son accesibles por los miembros del proyecto.",
        ifApproved: "Si es aprobado por los moderadores:",
        visibleInSearch: "Visible en la búsqueda",
        visibleOnProfile: "Visible en el perfil",
        visibleViaUrl: "Visible a través de la URL",
        visibleToMembersOnly: "Solo los miembros podrán ver el proyecto",
        listed: "Listado",
        private: "Privado",
        public: "Público",
        unlisted: "No listado",
        archived: "Archivado",
        deleteProject: "Eliminar proyecto",
        deleteProjectDesc: (site: string) =>
            `Elimina tu proyecto de los servidores de ${site} y de la búsqueda. ¡Al hacer clic aquí, eliminarás tu proyecto, así que ten mucho cuidado!`,
        sureToDeleteProject: "¿Estás seguro de que quieres eliminar tu proyecto?",
        deleteProjectDesc2:
            "Si procedes, todas las versiones y los datos adjuntos se eliminarán de nuestros servidores. Esto podría afectar a otros proyectos, así que ten cuidado.",
        typeToVerify: (projectName: string) => `Para verificar, escribe **${projectName}** abajo:`,
        typeHere: "Escribe aquí...",
        manageMembers: "Gestionar miembros",
        leftProjectTeam: "Has salido del equipo",
        leaveOrg: "Salir de la organización",
        leaveProject: "Salir del proyecto",
        leaveOrgDesc: "Eliminarte como miembro de esta organización.",
        leaveProjectDesc: "Eliminarte como miembro de este proyecto.",
        sureToLeaveTeam: "¿Estás seguro de que quieres salir de este equipo?",
        cantManageInvites: "No tienes acceso para gestionar las invitaciones de miembros",
        inviteMember: "Invitar a un miembro",
        inviteProjectMemberDesc:
            "Ingresa el nombre de usuario de la persona que deseas invitar a ser miembro de este proyecto.",
        inviteOrgMemberDesc:
            "Ingresa el nombre de usuario de la persona que deseas invitar a ser miembro de esta organización.",
        invite: "Invitar",
        memberUpdated: "Miembro actualizado con éxito",
        pending: "Pendiente",
        role: "Rol",
        roleDesc: "El título del rol que este miembro desempeña para este equipo.",
        permissions: "Permisos",
        perms: {
            upload_version: "Subir versión",
            delete_version: "Eliminar versión",
            edit_details: "Editar detalles",
            edit_description: "Editar descripción",
            manage_invites: "Gestionar invitaciones",
            remove_member: "Eliminar miembro",
            edit_member: "Editar miembro",
            delete_project: "Eliminar proyecto",
            view_analytics: "Ver análisis",
            view_revenue: "Ver ingresos",
        },
        owner: "Propietario",
        removeMember: "Eliminar miembro",
        transferOwnership: "Transferir propiedad",
        overrideValues: "Sobrescribir valores",
        overrideValuesDesc:
            "Sobrescribe los valores predeterminados de la organización y asigna permisos y roles personalizados a este usuario en el proyecto.",
        projectNotManagedByOrg:
            "Este proyecto no está gestionado por una organización. Si eres miembro de alguna organización, puedes transferir la gestión a una de ellas.",
        transferManagementToOrg: "Transferir gestión",
        selectOrg: "Seleccionar organización",
        projectManagedByOrg: (orgName: string) =>
            `Este proyecto está gestionado por ${orgName}. Los valores predeterminados para los permisos de los miembros se establecen en los ajustes de la organización. Puedes sobrescribirlos a continuación.`,
        removeFromOrg: "Eliminar de la organización",
        memberRemoved: "Miembro eliminado con éxito",
        sureToRemoveMember: (memberName: string) =>
            `¿Estás seguro de que quieres eliminar a ${memberName} de este equipo?`,
        ownershipTransfered: "Propiedad transferida con éxito",
        sureToTransferOwnership: (memberName: string) =>
            `¿Estás seguro de que quieres transferir la propiedad a ${memberName}?`,
    },

    organization: {
        orgDoesntHaveProjects: "Esta organización no tiene proyectos aún.",
        manageProjects: "Gestionar proyectos",
        orgSettings: "Ajustes de la organización",
        transferProjectsTip:
            "Puedes transferir tus proyectos existentes a esta organización desde: Ajustes del proyecto > Miembros",
        noProjects_CreateOne: "Esta organización no tiene proyectos. Haz clic en el botón de arriba para crear uno.",
        orgInfo: "Información de la organización",
        deleteOrg: "Eliminar organización",
        deleteOrgDesc:
            "Eliminar tu organización transferirá todos sus proyectos al propietario de la organización. Este proceso es irreversible.",
        sureToDeleteOrg: "¿Estás seguro de que quieres eliminar esta organización?",
        deleteOrgNamed: (orgName: string) => `Eliminar organización ${orgName}`,
        deletionWarning: "Esto eliminará esta organización para siempre (de verdad, para siempre).",

        perms: {
            edit_details: "Editar detalles",
            manage_invites: "Gestionar invitaciones",
            remove_member: "Eliminar miembro",
            edit_member: "Editar miembro",
            add_project: "Añadir proyecto",
            remove_project: "Eliminar proyecto",
            delete_organization: "Eliminar organización",
            edit_member_default_permissions: "Editar permisos predeterminados de miembro",
        },
    },

    user: {
        admin: "Administrador",
        moderator: "Moderador",
        doesntHaveProjects: (user: string) => `${user} no tiene proyectos aún.`,
        isntPartOfAnyOrgs: (user: string) => `${user} no es miembro de ninguna organización.`,
        joined: (when: string) => `Se unió ${when}`, // eg: Joined 2 months ago
    },

    collection: {
        curatedBy: "Hecha por",
        searchCollections: "Buscar colecciones",
        editingCollection: "Editando colección",
        deleteCollection: "Eliminar colección",
        sureToDeleteCollection: "¿Estás seguro de que quieres eliminar esta colección?",
        followedProjects: "Proyectos seguidos",
        followedProjectsDesc: "Colección generada automáticamente con todos los proyectos que sigues.",
    },

    footer: {
        resources: "Recursos",
        docs: "Documentación",
        status: "Estado",
        support: "Soporte",
        socials: "Redes sociales",
        about: "Acerca de",
        changeTheme: "Cambiar tema",
        siteOfferedIn: (site: string) => `${site} ofrecido en:`,
    },

    legal: {
        legal: "Legal",
        rulesTitle: "Reglas de contenido",
        contentRules: Rules,
        termsTitle: "Términos de uso",
        // termsOfUse: TermsOfUse,
        copyrightPolicyTitle: "Política de derechos de autor",
        // copyrightPolicy: CopyrightPolicy,
        securityNoticeTitle: "Aviso de seguridad",
        // securityNotice: SecurityNotice,
        privacyPolicyTitle: "Política de privacidad",
        // privacyPolicy: PrivacyPolicy,

        // About us page
        // aboutUs: AboutUs
    },

    moderation: {
        review: "Revisar proyectos",
        reports: "Reportes",
        moderation: "Moderación",
        statistics: "Estadísticas",
        authors: "Autores",
        projectsInQueue: (count: number) => {
            if (count === 1) return "Hay 1 proyecto en la cola.";
            return `Hay ${count} proyectos en la cola.`;
        },
        // hours will either be 24 or 48
        projectsQueuedFor: (count: number, hours: number) => {
            if (count === 1) return `1 proyecto ha estado en la cola por más de ${hours} horas.`;
            return `${count} proyectos han estado en la cola por más de ${hours} horas.`;
        },
        submitted: (when: string) => `Enviado ${when}`, // eg: Submitted 4 hours ago, (the date string comes from the localized phrases defined at end of the file)
        viewProject: "Ver proyecto",
        awaitingApproval: "El proyecto está en la cola para aprobación",
        draft: "Borrador",
        approve: "Aprobar",
        reject: "Rechazar",
        withhold: "Suspender",
    },

    form: {
        login: "Iniciar sesión",
        login_withSpace: "Inicia sesión",
        signup: "Registrarse",
        email: "Correo electrónico",
        username: "Nombre de usuario",
        password: "Contraseña",
        name: "Nombre",
        displayName: "Nombre visible",
        icon: "Icono",
        details: "Detalles",
        description: "Descripción",
        id: "ID",
        url: "URL",
        projectType: "Tipo de proyecto",
        visibility: "Visibilidad",
        summary: "Resumen",
        title: "Título",
        ordering: "Orden",
        featured: "Destacado",
        continue: "Continuar",
        submit: "Enviar",
        remove: "Eliminar",
        confirm: "Confirmar",
        edit: "Editar",
        delete: "Eliminar",
        cancel: "Cancelar",
        saveChanges: "Guardar cambios",
        uploadIcon: "Subir icono",
        removeIcon: "Eliminar icono",
        noFileChosen: "No se ha elegido ningún archivo",
        showAllVersions: "Mostrar todas las versiones",
        createNew: "Crear nuevo",
    },

    error: {
        sthWentWrong: "¡Ups! Algo salió mal",
        errorDesc: "Algo falló. Mientras solucionamos el problema, intenta recargar la página.",
        refresh: "Recargar",
        pageNotFound: "404 | Página no encontrada.",
        pageNotFoundDesc: "Lo sentimos, no pudimos encontrar la página que estás buscando.",
        projectNotFound: "Proyecto no encontrado",
        projectNotFoundDesc: (type: string, slug: string) => `El ${type} con el slug/ID "${slug}" no existe.`,
    },

    editor: {
        heading1: "Encabezado 1",
        heading2: "Encabezado 2",
        heading3: "Encabezado 3",
        bold: "Negrita",
        italic: "Cursiva",
        underline: "Subrayado",
        strikethrough: "Tachado",
        code: "Código",
        spoiler: "Spoiler",
        bulletedList: "Lista con viñetas",
        numberedList: "Lista numerada",
        quote: "Cita",
        insertLink: "Insertar enlace",
        label: "Etiqueta",
        enterLabel: "Insertar etiqueta",
        link: "Enlace", // Noun
        enterUrl: "Ingresa la URL del enlace",
        insertImage: "Insertar imagen",
        imgAlt: "Descripción (texto alternativo)",
        imgAltDesc: "Escribe una descripción para la imagen",
        enterImgUrl: "Ingresa la URL de la imagen",
        image: "Imagen",
        inserYtVideo: "Insertar video de YouTube",
        ytVideoUrl: "URL del video de YouTube",
        enterYtUrl: "Ingresa la URL del video de YouTube",
        video: "Video",
        preview: "Vista previa",
        insert: "Insertar",
        supportsMarkdown: (markdownPageUrl: string) => `Puedes usar el formato [Markdown](${markdownPageUrl}) aquí.`,
        keyboardShortcuts: "Atajos de teclado",
        action: "Acción",
        shortcut: "Atajo",
        toggleLineWrap: "Activar/desactivar ajuste de línea",
    },
} satisfies Locale;
