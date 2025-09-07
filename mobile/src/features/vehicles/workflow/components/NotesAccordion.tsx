import { Accordion } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { AgentNote } from "@/lib/store";
import { NotebookPen } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
        <Accordion
            title={`Notes Agent (${notes.length})`}
            open={open}
            toggle={toggle}
        >
            {notes.length === 0 ? (
                <Text className="text-[11px] text-gray-400">Aucune note.</Text>
            ) : (
                <View className="space-y-3">
                    {notes.map((n) => (
                        <View
                            key={n.id}
                            className="p-3 rounded-lg border border-gray-200 bg-white"
                        >
                            <Text
                                className="text-xs font-semibold text-slate-900"
                                numberOfLines={1}
                            >
                                {n.title}
                            </Text>
                            <Text className="text-[10px] text-gray-500 mb-1">
                                {new Date(n.createdAt).toLocaleString("fr-FR")}
                            </Text>
                            <Text
                                className="text-[11px] text-gray-600"
                                numberOfLines={3}
                            >
                                {n.content}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
            {adding ? (
                <View className="mt-4 space-y-3">
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
                        placeholder="Détails..."
                    />
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={() => handleAddNote(title, content, reset)}
                            className="flex-1 h-10 rounded-lg bg-emerald-600 items-center justify-center"
                        >
                            <Text className="text-white text-xs font-semibold">
                                Enregistrer
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setAdding(false)}
                            className="flex-1 h-10 rounded-lg bg-gray-200 items-center justify-center"
                        >
                            <Text className="text-gray-700 text-xs font-semibold">
                                Annuler
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <TouchableOpacity
                    onPress={() => setAdding(true)}
                    className="mt-3 flex-row items-center self-start px-3 h-9 rounded-lg bg-emerald-600"
                >
                    <NotebookPen size={16} color="#fff" />
                    <Text className="text-white text-xs font-semibold ml-2">
                        Ajouter note
                    </Text>
                </TouchableOpacity>
            )}
        </Accordion>
    );
};
