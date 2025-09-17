import PortCallEditClient from "../../../../../../src/features/portcall/components/PortCallEditClient";

interface Props {
    params: { id: string };
}

export default function Page({ params }: Props) {
    const id = Number(params.id);
    return <PortCallEditClient id={id} />;
}
