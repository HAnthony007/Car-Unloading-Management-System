import { Main } from "@/components/layout/main";
import { DocksCardList } from "./components/docks-card-list";

export default function Dock() {
    return (
        <Main>
            <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Dock </h2>
                    <p className="text-muted-foreground">
                        Manage your dock here.
                    </p>
                </div>
            </div>
            <div className="space-y-4">
                <DocksCardList />
            </div>
        </Main>
    );
}
