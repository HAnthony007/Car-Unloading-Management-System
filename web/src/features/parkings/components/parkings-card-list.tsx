import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MapPinIcon } from "lucide-react";

export const ParkingsCardList = () => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div>
                            <CardTitle className="flex items-center space-x-2">
                                <span>Parking 1</span>
                                <Badge variant="destructive">
                                    <span>Busy</span>
                                </Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center space-x-4">
                                <span className="flex items-center space-x-1">
                                    <MapPinIcon className="h-3 w-3" />
                                    <span>hello asdd ajks</span>
                                </span>
                                <span>123.12312.123.13123</span>
                            </CardDescription>
                        </div>
                    </div>
                    {/* i need to write percentage of the parking */}
                    <div className="flex items-center space-x-2 flex-col">
                        <span className="text-sm font-medium">
                            {Math.floor(Math.random() * 100)}%
                        </span>
                        Occupation
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 mb-4 w-full">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Occupied places
                            </span>
                            <span className="text-sm font-medium">24/200</span>
                        </div>
                        <Progress className="h-2.5 w-full" value={10} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
