import { BarChart } from "@/components/ui/BarChart";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LinearGradient } from "expo-linear-gradient";
import {
    Activity,
    ChartBar as BarChart3,
    Car,
    Clock,
    Download,
    Filter,
    Ship,
    TrendingDown,
    TrendingUp,
} from "lucide-react-native";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnalyticsScreen() {
    const [selectedPeriod, setSelectedPeriod] = useState("week");
    const [selectedMetric, setSelectedMetric] = useState("vehicles");

    const periods = [
        { key: "day", label: "Aujourd'hui" },
        { key: "week", label: "Cette semaine" },
        { key: "month", label: "Ce mois" },
        { key: "year", label: "Cette année" },
    ];

    const metrics = [
        { key: "vehicles", label: "Véhicules", icon: Car },
        { key: "ships", label: "Navires", icon: Ship },
        { key: "efficiency", label: "Efficacité", icon: Activity },
        { key: "time", label: "Temps", icon: Clock },
    ];

    const kpiData = [
        {
            title: "Véhicules débarqués",
            value: "1,247",
            change: "+12.5%",
            trend: "up",
            period: "vs mois dernier",
        },
        {
            title: "Temps moyen de traitement",
            value: "2.3h",
            change: "-8.2%",
            trend: "down",
            period: "vs mois dernier",
        },
        {
            title: "Taux d'occupation",
            value: "87%",
            change: "+5.1%",
            trend: "up",
            period: "vs mois dernier",
        },
        {
            title: "Navires traités",
            value: "42",
            change: "+15.8%",
            trend: "up",
            period: "vs mois dernier",
        },
    ];

    const chartData = [
        { label: "Lun", value: 45, color: "#059669" },
        { label: "Mar", value: 52, color: "#059669" },
        { label: "Mer", value: 38, color: "#059669" },
        { label: "Jeu", value: 61, color: "#059669" },
        { label: "Ven", value: 55, color: "#059669" },
        { label: "Sam", value: 28, color: "#10B981" },
        { label: "Dim", value: 22, color: "#10B981" },
    ];

    const topPerformers = [
        { name: "Zone A", value: 342, percentage: 28 },
        { name: "Zone B", value: 298, percentage: 24 },
        { name: "Zone C", value: 256, percentage: 21 },
        { name: "Zone D", value: 189, percentage: 15 },
        { name: "Zone E", value: 145, percentage: 12 },
    ];

    const recentAlerts = [
        {
            id: 1,
            type: "warning",
            message: "Zone A - Capacité à 95%",
            time: "10:30",
            severity: "medium",
        },
        {
            id: 2,
            type: "info",
            message: "Nouveau navire MSC LUCIA prévu à 14:00",
            time: "09:45",
            severity: "low",
        },
        {
            id: 3,
            type: "error",
            message: "Équipement Zone C - Maintenance requise",
            time: "08:20",
            severity: "high",
        },
    ];

    const renderKPICard = (kpi: any, index: number) => (
        <Card key={index} style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
                <Text style={styles.kpiTitle}>{kpi.title}</Text>
                <View
                    style={[
                        styles.trendBadge,
                        kpi.trend === "up" ? styles.trendUp : styles.trendDown,
                    ]}
                >
                    {kpi.trend === "up" ? (
                        <TrendingUp
                            size={12}
                            color={kpi.trend === "up" ? "#059669" : "#DC2626"}
                        />
                    ) : (
                        <TrendingDown
                            size={12}
                            color={kpi.trend === "up" ? "#059669" : "#DC2626"}
                        />
                    )}
                    <Text
                        style={[
                            styles.trendText,
                            kpi.trend === "up"
                                ? styles.trendUpText
                                : styles.trendDownText,
                        ]}
                    >
                        {kpi.change}
                    </Text>
                </View>
            </View>
            <Text style={styles.kpiValue}>{kpi.value}</Text>
            <Text style={styles.kpiPeriod}>{kpi.period}</Text>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <LinearGradient
                    colors={["#059669", "#10B981"]}
                    style={styles.header}
                >
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.headerTitle}>
                                Analyses & Rapports
                            </Text>
                            <Text style={styles.headerSubtitle}>
                                Tableau de bord analytique
                            </Text>
                        </View>
                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.headerButton}>
                                <Filter color="#FFFFFF" size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerButton}>
                                <Download color="#FFFFFF" size={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>

                {/* Period Selector */}
                <View style={styles.periodSelector}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {periods.map((period) => (
                            <TouchableOpacity
                                key={period.key}
                                style={[
                                    styles.periodButton,
                                    selectedPeriod === period.key &&
                                        styles.periodButtonActive,
                                ]}
                                onPress={() => setSelectedPeriod(period.key)}
                            >
                                <Text
                                    style={[
                                        styles.periodButtonText,
                                        selectedPeriod === period.key &&
                                            styles.periodButtonTextActive,
                                    ]}
                                >
                                    {period.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* KPI Cards */}
                <View style={styles.kpiContainer}>
                    {kpiData.map((kpi, index) => renderKPICard(kpi, index))}
                </View>

                {/* Chart Section */}
                <Card style={styles.chartSection}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>
                            Débarquements par jour
                        </Text>
                        <TouchableOpacity style={styles.chartToggle}>
                            <BarChart3 color="#059669" size={20} />
                        </TouchableOpacity>
                    </View>
                    <BarChart data={chartData} height={200} />
                </Card>

                {/* Performance Section */}
                <Card style={styles.performanceSection}>
                    <Text style={styles.sectionTitle}>
                        Top Zones de Performance
                    </Text>
                    {topPerformers.map((performer, index) => (
                        <View key={index} style={styles.performerItem}>
                            <View style={styles.performerInfo}>
                                <Text style={styles.performerName}>
                                    {performer.name}
                                </Text>
                                <Text style={styles.performerValue}>
                                    {performer.value} véhicules
                                </Text>
                            </View>
                            <View style={styles.performerProgress}>
                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${performer.percentage}%`,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.performerPercentage}>
                                    {performer.percentage}%
                                </Text>
                            </View>
                        </View>
                    ))}
                </Card>

                {/* Alerts Section */}
                <Card style={styles.alertsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            Alertes Récentes
                        </Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>Voir tout</Text>
                        </TouchableOpacity>
                    </View>
                    {recentAlerts.map((alert) => (
                        <View key={alert.id} style={styles.alertItem}>
                            <View
                                style={[
                                    styles.alertIndicator,
                                    alert.severity === "high"
                                        ? styles.alertHigh
                                        : alert.severity === "medium"
                                          ? styles.alertMedium
                                          : styles.alertLow,
                                ]}
                            />
                            <View style={styles.alertContent}>
                                <Text style={styles.alertMessage}>
                                    {alert.message}
                                </Text>
                                <Text style={styles.alertTime}>
                                    {alert.time}
                                </Text>
                            </View>
                        </View>
                    ))}
                </Card>

                {/* Export Section */}
                <Card style={styles.exportSection}>
                    <Text style={styles.sectionTitle}>
                        Exporter les données
                    </Text>
                    <View style={styles.exportButtons}>
                        <Button
                            title="Rapport PDF"
                            onPress={() => {}}
                            variant="outline"
                            size="medium"
                            icon={<Download color="#059669" size={16} />}
                            style={styles.exportButton}
                        />
                        <Button
                            title="Données Excel"
                            onPress={() => {}}
                            variant="outline"
                            size="medium"
                            icon={<Download color="#059669" size={16} />}
                            style={styles.exportButton}
                        />
                    </View>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 24,
        paddingTop: 16,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: "Inter-Bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        fontFamily: "Inter-Regular",
        color: "rgba(255, 255, 255, 0.8)",
    },
    headerActions: {
        flexDirection: "row",
        gap: 8,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    periodSelector: {
        padding: 16,
    },
    periodButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        marginRight: 8,
    },
    periodButtonActive: {
        backgroundColor: "#059669",
    },
    periodButtonText: {
        fontSize: 14,
        fontFamily: "Inter-Medium",
        color: "#6B7280",
    },
    periodButtonTextActive: {
        color: "#FFFFFF",
    },
    kpiContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 16,
        gap: 12,
    },
    kpiCard: {
        flex: 1,
        minWidth: "45%",
    },
    kpiHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    kpiTitle: {
        fontSize: 12,
        fontFamily: "Inter-Regular",
        color: "#6B7280",
        flex: 1,
    },
    trendBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
        gap: 2,
    },
    trendUp: {
        backgroundColor: "#DCFCE7",
    },
    trendDown: {
        backgroundColor: "#FEE2E2",
    },
    trendText: {
        fontSize: 10,
        fontFamily: "Inter-SemiBold",
    },
    trendUpText: {
        color: "#059669",
    },
    trendDownText: {
        color: "#DC2626",
    },
    kpiValue: {
        fontSize: 24,
        fontFamily: "Inter-Bold",
        color: "#111827",
        marginBottom: 4,
    },
    kpiPeriod: {
        fontSize: 12,
        fontFamily: "Inter-Regular",
        color: "#6B7280",
    },
    chartSection: {
        margin: 16,
        marginTop: 0,
    },
    chartHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontFamily: "Inter-SemiBold",
        color: "#111827",
    },
    chartToggle: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#F0FDF4",
    },
    performanceSection: {
        margin: 16,
        marginTop: 0,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: "Inter-SemiBold",
        color: "#111827",
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    seeAllText: {
        fontSize: 14,
        fontFamily: "Inter-Medium",
        color: "#059669",
    },
    performerItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    performerInfo: {
        flex: 1,
    },
    performerName: {
        fontSize: 14,
        fontFamily: "Inter-SemiBold",
        color: "#111827",
        marginBottom: 2,
    },
    performerValue: {
        fontSize: 12,
        fontFamily: "Inter-Regular",
        color: "#6B7280",
    },
    performerProgress: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    progressBar: {
        width: 60,
        height: 4,
        backgroundColor: "#F3F4F6",
        borderRadius: 2,
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#059669",
        borderRadius: 2,
    },
    performerPercentage: {
        fontSize: 12,
        fontFamily: "Inter-SemiBold",
        color: "#059669",
        minWidth: 30,
    },
    alertsSection: {
        margin: 16,
        marginTop: 0,
    },
    alertItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    alertIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 12,
    },
    alertHigh: {
        backgroundColor: "#DC2626",
    },
    alertMedium: {
        backgroundColor: "#F59E0B",
    },
    alertLow: {
        backgroundColor: "#10B981",
    },
    alertContent: {
        flex: 1,
    },
    alertMessage: {
        fontSize: 14,
        fontFamily: "Inter-Regular",
        color: "#111827",
        marginBottom: 2,
    },
    alertTime: {
        fontSize: 12,
        fontFamily: "Inter-Regular",
        color: "#6B7280",
    },
    exportSection: {
        margin: 16,
        marginTop: 0,
        marginBottom: 32,
    },
    exportButtons: {
        flexDirection: "row",
        gap: 12,
    },
    exportButton: {
        flex: 1,
    },
});
