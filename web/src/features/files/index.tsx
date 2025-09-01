import FollowupFilesClient from "./FollowupFilesClient";

export default async function Files() {
    // Fetch on the client to forward browser cookies (Sanctum) and CSRF headers
    return <FollowupFilesClient />;
}
