import { fetchFollowupFiles } from "./data/followup";
import FollowupFilesClient from "./FollowupFilesClient";

export default async function Files() {
    const files = await fetchFollowupFiles();
    return <FollowupFilesClient initialData={files} />;
}
