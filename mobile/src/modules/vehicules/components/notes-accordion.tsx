import { Input } from "@/src/components/ui/input";
import { NotebookPen, Plus } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AgentNote } from "../../scanner/stores/scanner-store";

interface Props {
    open: boolean;
    toggle: () => void;
    notes: AgentNote[];
    handleAddNote: (title: string, content: string, reset: () => void) => void;
}

export const NotesAccordion = ({
    open,
    toggle,
    notes,
    handleAddNote,
}: Props) => {
    const [adding, setAdding] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const reset = () => {
        setTitle("");
        setContent("");
        setAdding(false);
    };

    return (
        <View className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
            <TouchableOpacity
                onPress={toggle}
                className="px-6 py-4 flex-row items-center justify-between"
                activeOpacity={0.7}
            >
                <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-green-100 rounded-lg items-center justify-center mr-3">
                        <NotebookPen size={16} color="#10b981" />
                    </View>
                    <View>
                        <Text className="text-slate-900 text-base font-bold">
                            Notes Agent
                        </Text>
                        <Text className="text-slate-600 text-sm">
                            {notes.length} note{notes.length > 1 ? "s" : ""}
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
                    {notes.length === 0 ? (
                        <View className="bg-slate-50 rounded-xl p-6 items-center">
                            <NotebookPen size={32} color="#94a3b8" />
                            <Text className="text-slate-500 text-sm font-medium mt-2">
                                Aucune note
                            </Text>
                            <Text className="text-slate-400 text-xs text-center mt-1">
                                Ajoutez des notes pour documenter les
                                observations
                            </Text>
                        </View>
                    ) : (
                        <View className="space-y-3">
                            {notes.map((n) => (
                                <View
                                    key={n.id}
                                    className="p-4 rounded-xl border border-slate-200 bg-slate-50"
                                >
                                    <Text
                                        className="text-sm font-semibold text-slate-900 mb-1"
                                        numberOfLines={1}
                                    >
                                        {n.title}
                                    </Text>
                                    <Text className="text-xs text-slate-500 mb-2">
                                        {new Date(n.createdAt).toLocaleString(
                                            "fr-FR"
                                        )}
                                    </Text>
                                    <Text
                                        className="text-sm text-slate-600"
                                        numberOfLines={3}
                                    >
                                        {n.content}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {adding ? (
                        <View className="mt-4 space-y-4">
                            <View className="bg-slate-50 rounded-xl p-4">
                                <Text className="text-slate-600 text-sm font-medium mb-3">
                                    Nouvelle Note
                                </Text>
                                <View className="space-y-3">
                                    <Input
                                        label="Titre"
                                        value={title}
                                        onChangeText={setTitle}
                                        placeholder="Ex: Vérification carrosserie"
                                    />
                                    <Input
                                        label="Contenu"
                                        value={content}
                                        onChangeText={setContent}
                                        multiline
                                        placeholder="Détails de l'observation..."
                                    />
                                </View>
                            </View>
                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    onPress={() =>
                                        handleAddNote(title, content, reset)
                                    }
                                    className="flex-1 h-12 rounded-xl bg-emerald-500 items-center justify-center"
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-white text-sm font-semibold">
                                        Enregistrer
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setAdding(false)}
                                    className="flex-1 h-12 rounded-xl bg-slate-200 items-center justify-center"
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-slate-700 text-sm font-semibold">
                                        Annuler
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={() => setAdding(true)}
                            className="mt-4 flex-row items-center justify-center px-4 py-3 rounded-xl bg-emerald-500"
                            activeOpacity={0.8}
                        >
                            <Plus size={16} color="#fff" />
                            <Text className="text-white text-sm font-semibold ml-2">
                                Ajouter une note
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};
