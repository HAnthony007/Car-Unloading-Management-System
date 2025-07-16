import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from "react";
import { User } from "../data/schema";

type UsersDialogType = "add" | "edit" | "delete";

export interface UsersContextProps {
    open: UsersDialogType | null;
    setOpen: (str: UsersDialogType | null) => void;
    currentRow: User | null;
    setCurrentRow: Dispatch<SetStateAction<User | null>>;
}

const UsersContext = createContext<UsersContextProps | null>(null);

interface Props {
    children: ReactNode;
}

export default function UsersContextProvider({ children }: Props) {
    const [open, setOpen] = useState<UsersDialogType | null>(null);
    const [currentRow, setCurrentRow] = useState<User | null>(null);

    return (
        <UsersContext
            value={{
                open,
                setOpen,
                currentRow,
                setCurrentRow,
            }}
        >
            {children}
        </UsersContext>
    );
}

export const useUsers = () => {
    const context = useContext(UsersContext);
    if (!context) {
        throw new Error("useUsers must be used within a UsersContextProvider");
    }
    return context;
};
