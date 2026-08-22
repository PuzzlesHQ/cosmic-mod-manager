await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./build",
    target: "bun",
});
