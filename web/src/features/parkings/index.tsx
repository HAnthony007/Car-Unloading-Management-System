import { Main } from "@/components/layout/main";
import { ParkingsAddButtons } from "./components/parkings-add-buttons";
import { ParkingsCardList } from "./components/parkings-card-list";

export default function Parkings() {
    return (
        <Main>
            <div className="sticky px-2 top-2 z-20 mb-2 flex flex-wrap items-center justify-between space-y-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/10 border-b border-border rounded-xl shadow-sm">
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
