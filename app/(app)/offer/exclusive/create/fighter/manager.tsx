import React, {useEffect, useMemo, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import colors from "@/styles/colors";
import GoBackButton from "@/components/GoBackButton";
import {getShortInfoFighters, getAllManagers} from "@/service/service";
import {ShortInfoFighter} from "@/service/response";
import FighterCard from "@/components/FighterCard";
import {ManagerCard} from "@/components/fighter/ManagerCard";
import {setFightersChosen} from "@/store/createExclusiveOfferSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";

export default function PromotionAllFighterPickerScreen() {
    const TABS = ["Fighters", "Managers"] as const;
    const {fightersChosen} = useSelector(
        (state: RootState) => state.createExclusiveOffer,
    );
    const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Fighters");
    const [search, setSearch] = useState("");
    const [fighters, setFighters] = useState<ShortInfoFighter[]>([]);
    const [managers, setManagers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const [selectedFighters, setSelectedFighters] = useState<Set<string>>(new Set());
    const [selectedManagers, setSelectedManagers] = useState<Set<string>>(new Set());

    useEffect(() => {
        (async () => {
            try {
                const [f, m] = await Promise.all([getShortInfoFighters(), getAllManagers()]);
                setFighters(f);
                setManagers(m);
                if (fightersChosen && fightersChosen.length > 0) {
                    const fightersSet = new Set<string>();
                    const managersSet = new Set<string>();
                    fightersChosen.forEach((item) => {
                        if (item.fighterId) {
                            fightersSet.add(item.fighterId);
                        }
                        if (item.managerId) {
                            managersSet.add(item.managerId);
                        }
                    });
                    setSelectedFighters(fightersSet);
                    setSelectedManagers(managersSet);
                }
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filteredFighters = useMemo(() => {
        if (!search.trim()) return fighters;
        const q = search.toLowerCase();
        return fighters.filter((f) => f.name.toLowerCase().includes(q));
    }, [fighters, search]);

    const filteredManagers = useMemo(() => {
        if (!search.trim()) return managers;
        const q = search.toLowerCase();
        return managers.filter((m) => m.name?.toLowerCase().includes(q));
    }, [managers, search]);

    const toggleFighter = (id: string) => {
        const next = new Set(selectedFighters);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelectedFighters(next);
    };
    const toggleManager = (id: string) => {
        const next = new Set(selectedManagers);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelectedManagers(next);
    };

    const confirm = () => {
        const payload: Array<{ managerId: string; fighterId?: string }> = [];
        selectedManagers.forEach((m) => payload.push({managerId: m}));
        selectedFighters.forEach((f) => {
            const filter = fighters.find(fighter => fighter.id === f);
            payload.push({managerId: filter?.managerId || "", fighterId: f})
        });

        dispatch(setFightersChosen(payload));
    };

    const renderFighter = ({item}: { item: ShortInfoFighter }) => {
        return (
            <Pressable
                onPress={() => toggleFighter(item.id)}
                style={[styles.rowWrap]}
            >
                <View style={{flex: 1}}>
                    <FighterCard fighter={item} onPress={() => toggleFighter(item.id)}
                                 selectedInList={selectedFighters.has(item.id)}/>
                </View>
            </Pressable>
        );
    };

    const renderManager = ({item}: { item: any }) => {
        return (
            <Pressable
                onPress={() => toggleManager(item.managerId)}
                style={[styles.rowWrap]}
            >
                <View style={{flex: 1}}>
                    <ManagerCard item={item} handleChooseFighter={() => toggleManager(item.managerId)}
                                 selectedInList={selectedManagers.has(item.managerId)}/>
                </View>
            </Pressable>
        );
    };

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.primaryGreen}/>
            </View>
        );
    }

    return (
        <View style={[styles.root]}>
            <GoBackButton onPress={() => confirm()}/>
            <View style={styles.container}>
                <Text style={styles.title}>Search {activeTab}</Text>

                <View style={styles.tabsRow}>
                    {TABS.map((tab, i) => (
                        <Pressable
                            key={tab}
                            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive, i === 0 ? styles.tabLeft : styles.tabRight]}
                            onPress={() => {
                                setActiveTab(tab);
                                setSearch("");
                            }}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                        </Pressable>
                    ))}
                </View>

                <TextInput
                    placeholder={`Search ${activeTab.toLowerCase()}…`}
                    value={search}
                    onChangeText={setSearch}
                    style={styles.search}
                    placeholderTextColor={colors.gray}
                />

                {activeTab === "Fighters" ? (
                    <FlatList data={filteredFighters} keyExtractor={(i) => i.id} renderItem={renderFighter}/>
                ) : (
                    <FlatList data={filteredManagers} keyExtractor={(i) => i.managerId} renderItem={renderManager}/>
                )}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    root: {flex: 1, backgroundColor: colors.white},
    container: {flex: 1, paddingHorizontal: 16},
    loading: {flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.white},
    title: {fontSize: 24, fontWeight: "600", textAlign: "center", color: colors.primaryBlack, marginVertical: 12},
    tabsRow: {flexDirection: "row", alignSelf: "center", marginBottom: 12},
    tabBtn: {flex: 1, paddingVertical: 16, backgroundColor: colors.lightGray, alignItems: "center"},
    tabLeft: {borderTopLeftRadius: 8, borderBottomLeftRadius: 8},
    tabRight: {borderTopRightRadius: 8, borderBottomRightRadius: 8},
    tabBtnActive: {backgroundColor: colors.primaryGreen},
    tabText: {fontSize: 16, color: colors.primaryBlack},
    tabTextActive: {color: colors.white, fontWeight: "600"},
    search: {
        marginBottom: 8,
        height: 56,
        borderRadius: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.grayBackground,
        fontSize: 16,
        color: colors.primaryBlack,
    },
    rowWrap: {flexDirection: "row", alignItems: "center", borderRadius: 8},
});
