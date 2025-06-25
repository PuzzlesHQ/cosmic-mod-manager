export default function HomePage() {
    const ctx = useRouteLoaderData("root") as RootOutletData;

    return (
        <div>
            <h1>Home Page</h1>

            <pre>{JSON.stringify(ctx?.gameVersions, null, 4)}</pre>
        </div>
    );
}
