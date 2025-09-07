// app/inspection/[id].tsx (Expo Mobile)
const InspectionScreen: React.FC = () => {
    const { id } = useLocalSearchParams();
    const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
    const [checkpoints, setCheckpoints] = useState<SurveyCheckpoint[]>([]);

    useEffect(() => {
        loadCheckpoints();
    }, [id]);

    const loadCheckpoints = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/surveys/${id}/checkpoints`
            );
            const data = await response.json();
            setCheckpoints(data);
        } catch (error) {
            Alert.alert(
                "Erreur",
                "Impossible de charger les points de contrôle"
            );
        }
    };

    const handleCheckpointResponse = async (response: CheckpointResponse) => {
        await saveCheckpointResponse(currentCheckpoint, response);

        if (currentCheckpoint < checkpoints.length - 1) {
            setCurrentCheckpoint(currentCheckpoint + 1);
        } else {
            await completeSurvey();
            router.push("/discharges");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <CheckpointView
                checkpoint={checkpoints[currentCheckpoint]}
                onResponse={handleCheckpointResponse}
            />
        </SafeAreaView>
    );
};
