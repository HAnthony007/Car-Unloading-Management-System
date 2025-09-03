import PortCallDetailClient from "@/features/portcall/components/PortCallDetailClient";

interface Props {
    params: { id: string };
}

export default function Page({ params }: Props) {
    const id = parseInt(params.id, 10);
    return <PortCallDetailClient id={id} />;
}
