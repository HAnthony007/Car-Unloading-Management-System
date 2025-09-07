import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
    CreditCard as Edit3,
    Eye,
    MoveVertical as MoreVertical,
    Trash2,
} from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import {
    getCustomsStatusColor,
    getCustomsStatusText,
    getStatusColor,
    getStatusText,
} from "../lib/format";
import { Vehicle } from "../types";

interface Props {
    item: Vehicle;
    onPressView: (v: Vehicle) => void;
    onPressEdit: (v: Vehicle) => void;
    onPressDelete: (id: string) => void;
}

export const VehicleCard = ({
    item,
    onPressView,
    onPressEdit,
    onPressDelete,
}: Props) => {
    return (
        <Card className="mb-3">
            <View className="flex-row justify-between items-center mb-3">
                <View className="flex-1">
                    <Text className="text-base font-semibold text-slate-900 mb-1">
                        {item.brand} {item.model}
                    </Text>
                    <Text className="text-sm text-gray-500">
                        {item.chassisNumber}
                    </Text>
                </View>
                <View className="flex-row items-center space-x-2">
                    <Badge
                        label={getStatusText(item.status)}
                        variant={getStatusColor(item.status)}
                        size="small"
                    />
                    <TouchableOpacity className="p-1">
                        <MoreVertical color="#6B7280" size={16} />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="mb-4">
                <View className="flex-row mb-2">
                    <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">
                            Couleur
                        </Text>
                        <Text className="text-sm font-medium text-slate-900">
                            {item.color}
                        </Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">
                            Origine
                        </Text>
                        <Text className="text-sm font-medium text-slate-900">
                            {item.origin}
                        </Text>
                    </View>
                </View>

                <View className="flex-row mb-2">
                    <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">
                            Armateur
                        </Text>
                        <Text className="text-sm font-medium text-slate-900">
                            {item.shipowner}
                        </Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">Zone</Text>
                        <Text className="text-sm font-medium text-slate-900">
                            {item.zone}
                        </Text>
                    </View>
                </View>

                <View className="flex-row mb-2">
                    <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">
                            Douane
                        </Text>
                        <Badge
                            label={getCustomsStatusText(
                                item.customsStatus || "pending"
                            )}
                            variant={getCustomsStatusColor(
                                item.customsStatus || "pending"
                            )}
                            size="small"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">
                            Arrivée
                        </Text>
                        <Text className="text-sm font-medium text-slate-900">
                            {new Date(item.arrivalDate).toLocaleDateString(
                                "fr-FR"
                            )}
                        </Text>
                    </View>
                </View>
            </View>

            <View className="flex-row space-x-2">
                <Button
                    title="Voir"
                    onPress={() => onPressView(item)}
                    variant="outline"
                    size="small"
                    icon={<Eye color="#059669" size={16} />}
                    className="flex-1"
                />
                <Button
                    title="Modifier"
                    onPress={() => onPressEdit(item)}
                    variant="outline"
                    size="small"
                    icon={<Edit3 color="#059669" size={16} />}
                    className="flex-1"
                />
                <Button
                    title="Supprimer"
                    onPress={() => onPressDelete(item.id)}
                    variant="outline"
                    size="small"
                    icon={<Trash2 color="#DC2626" size={16} />}
                    className="flex-1 border border-red-100"
                />
            </View>
        </Card>
    );
};
