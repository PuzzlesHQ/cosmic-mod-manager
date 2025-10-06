// github webhook on push event

async function handleWebhook(req: Request): Promise<Response> {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
        console.error("GITHUB_WEBHOOK_SECRET is not set");
        return new Response("Server Misconfiguration", { status: 500 });
    }

    const hasher = new Bun.CryptoHasher("sha256", secret);
    const reqText = await req.text();
    hasher.update(reqText);
    const hash = `sha256=${hasher.digest("hex")}`;
    if (req.headers.get("X-Hub-Signature-256") !== hash) {
        return new Response("Forbidden", { status: 403 });
    }

    const json = JSON.parse(reqText);
    if (json.ref !== "refs/heads/main") {
        console.log("Push to non-main branch, ignoring");
        return new Response("Not a push to main branch", { status: 200 });
    }

    console.log("Valid webhook received, pulling latest code and redeploying...");
    await Bun.$`chmod +x ./scripts/deploy.sh && ./scripts/deploy.sh`;

    return new Response("Webhook received", { status: 200 });
}

Bun.serve({
    port: 5507,
    fetch: handleWebhook,
});
