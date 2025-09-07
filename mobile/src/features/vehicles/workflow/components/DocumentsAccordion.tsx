import { Accordion } from "@/components/ui/accordion";
import { DocumentItem } from "@/lib/store";
import { Download, FilePlus2, FolderOpen } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { formatRelative } from "../lib/format";

interface Props {
    open: boolean;
    toggle: () => void;
    documents: DocumentItem[];
    addDocument: (d: { name: string; type: string }) => void;
    onDownload: (id: string) => void;
}

export const DocumentsAccordion = ({
    open,
    toggle,
    documents,
    addDocument,
    onDownload,
}: Props) => (
    <Accordion
        title={`Documentation (${documents.length})`}
        open={open}
        toggle={toggle}
    >
        {documents.length === 0 ? (
            <Text className="text-[11px] text-gray-400">Aucun document.</Text>
        ) : (
            <View className="space-y-3">
                {documents.map((d) => (
                    <TouchableOpacity
                        key={d.id}
                        activeOpacity={0.85}
                        onPress={() => onDownload(d.id)}
                        className="flex-row items-center p-3 rounded-xl border border-gray-200 bg-white"
                    >
                        <View className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 items-center justify-center mr-3">
                            <FolderOpen size={18} color="#059669" />
                        </View>
                        <View className="flex-1 mr-3">
                            <Text
                                className="text-xs font-semibold text-slate-900"
                                numberOfLines={1}
                            >
                                {d.name}
                            </Text>
                            <Text
                                className="text-[10px] text-gray-500"
                                numberOfLines={1}
                            >
                                {d.type} • {formatRelative(d.uploadedAt)}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => onDownload(d.id)}
                            className="px-2 h-8 rounded-lg bg-emerald-600 flex-row items-center"
                        >
                            <Download size={14} color="#fff" />
                            <Text className="ml-1 text-[10px] font-semibold text-white">
                                DL
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </View>
        )}
        <TouchableOpacity
            onPress={() =>
                addDocument({
                    name: `Doc ${documents.length + 1}`,
                    type: "Général",
                })
            }
            className="mt-3 flex-row items-center self-start px-3 h-9 rounded-lg bg-emerald-600"
        >
            <FilePlus2 size={16} color="#fff" />
            <Text className="text-white text-xs font-semibold ml-2">
                Ajouter
            </Text>
        </TouchableOpacity>
    </Accordion>
);
