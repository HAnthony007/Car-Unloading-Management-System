import { Download, FilePlus2, FolderOpen } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { DocumentItem } from "../../scanner/stores/scanner-store";
import { formatRelative } from "../lib/format-relative";

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
    <View className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
        <TouchableOpacity
            onPress={toggle}
            className="px-6 py-4 flex-row items-center justify-between"
            activeOpacity={0.7}
        >
            <View className="flex-row items-center">
                <View className="w-8 h-8 bg-blue-100 rounded-lg items-center justify-center mr-3">
                    <FolderOpen size={16} color="#3b82f6" />
                </View>
                <View>
                    <Text className="text-slate-900 text-base font-bold">
                        Documentation
                    </Text>
                    <Text className="text-slate-600 text-sm">
                        {documents.length} document
                        {documents.length > 1 ? "s" : ""}
                    </Text>
                </View>
            </View>
            <View className="w-6 h-6 bg-slate-100 rounded-full items-center justify-center">
                <Text className="text-slate-600 text-sm font-bold">
                    {open ? "−" : "+"}
                </Text>
            </View>
        </TouchableOpacity>

        {open && (
            <View className="px-6 pb-6">
                <View className="h-px bg-slate-100 mb-4" />
                {documents.length === 0 ? (
                    <View className="bg-slate-50 rounded-xl p-6 items-center">
                        <FolderOpen size={32} color="#94a3b8" />
                        <Text className="text-slate-500 text-sm font-medium mt-2">
                            Aucun document
                        </Text>
                        <Text className="text-slate-400 text-xs text-center mt-1">
                            Ajoutez des documents pour commencer
                        </Text>
                    </View>
                ) : (
                    <View className="space-y-3">
                        {documents.map((d) => (
                            <TouchableOpacity
                                key={d.id}
                                activeOpacity={0.7}
                                onPress={() => onDownload(d.id)}
                                className="flex-row items-center p-4 rounded-xl border border-slate-200 bg-slate-50"
                            >
                                <View className="w-12 h-12 rounded-xl bg-emerald-100 items-center justify-center mr-4">
                                    <FolderOpen size={20} color="#10b981" />
                                </View>
                                <View className="flex-1 mr-3">
                                    <Text
                                        className="text-sm font-semibold text-slate-900"
                                        numberOfLines={1}
                                    >
                                        {d.name}
                                    </Text>
                                    <Text
                                        className="text-xs text-slate-500 mt-1"
                                        numberOfLines={1}
                                    >
                                        {d.type} •{" "}
                                        {formatRelative(d.uploadedAt)}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => onDownload(d.id)}
                                    className="px-3 py-2 rounded-lg bg-emerald-500 flex-row items-center"
                                    activeOpacity={0.8}
                                >
                                    <Download size={14} color="#fff" />
                                    <Text className="ml-1 text-xs font-semibold text-white">
                                        Télécharger
                                    </Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <TouchableOpacity
                    onPress={() =>
                        addDocument({
                            name: `Document ${documents.length + 1}`,
                            type: "Général",
                        })
                    }
                    className="mt-4 flex-row items-center justify-center px-4 py-3 rounded-xl bg-emerald-500"
                    activeOpacity={0.8}
                >
                    <FilePlus2 size={16} color="#fff" />
                    <Text className="text-white text-sm font-semibold ml-2">
                        Ajouter un document
                    </Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
);
