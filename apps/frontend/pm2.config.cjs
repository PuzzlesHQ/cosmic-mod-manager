const apps = [
    {
        name: "crmm-frontend",
        command: "bun run start",
        cwd: "/var/www/cosmic-mod-manager/current/apps/frontend",
        autorestart: true,
        watch: false,
    },
];

module.exports = {
    apps: apps
};