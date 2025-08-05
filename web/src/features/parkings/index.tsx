import { Main } from "@/components/layout/main";
import { ParkingsAddButtons } from "./components/parkings-add-buttons";
import { ParkingsCardList } from "./components/parkings-card-list";

export default function Parkings() {
    return (
        <Main>
            <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Parkings list{" "}
                    </h2>
                    <p className="text-muted-foreground">
                        Manage your parkings here.
                    </p>
                </div>
                <ParkingsAddButtons />
            </div>
            <div className="space-y-4">
                <ParkingsCardList />
            </div>
        </Main>
    );
}
