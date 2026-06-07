let isDeploying = false;
let needsRedeployment = false;

async function handleWebhook(req: Request): Promise<Response> {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
        console.error("GITHUB_WEBHOOK_SECRET is not set");
        return new Response(null, { status: 500 });
    }

    const hasher = new Bun.CryptoHasher("sha256", secret);
    const reqText = await req.text();
    hasher.update(reqText);
    const hash = `sha256=${hasher.digest("hex")}`;
    if (req.headers.get("X-Hub-Signature-256") !== hash) {
        return new Response(null, { status: 403 });
    }

    const json = JSON.parse(reqText);
    if (json.ref !== "refs/heads/deploy") {
        console.log("Push to non-deploy branch, ignoring");
        return new Response(null, { status: 200 });
    }

    if (isDeploying) {
        needsRedeployment = true;
        console.log("Deployment already in progress, scheduling a redeployment");
    } else {
        needsRedeployment = false;
        redeploy();
    }

    return new Response(null, { status: 200 });
}

Bun.serve({
    port: 5507,
    fetch: handleWebhook,
});

async function redeploy(recursion = 0) {
    // Prevent infinite recursion
    if (recursion > 10) {
        console.error("Too many redeployment attempts, aborting");
        return;
    }

    isDeploying = true;
    console.log("Valid webhook received, pulling latest code and redeploying...");
    await Bun.$`chmod +x ./scripts/deploy.sh && ./scripts/deploy.sh`;
    isDeploying = false;

    if (needsRedeployment) {
        needsRedeployment = false;
        await redeploy(recursion + 1);
    }
}
