import {StyleSheet, Text, View} from "react-native";
import {MaterialCommunityIcons as Icon} from "@expo/vector-icons";
import colors from "@/styles/colors";
import React from "react";
import {renderBenefitList} from "@/utils/utils";

type Props = {
    benefits: any;
}

export const BenefitRenderComponent = ({benefits}: Props) => {
    return <>{benefits && renderBenefitList(benefits).length > 0 && (
        <>
            <View style={styles.greenSectionHeader}>
                <Text style={styles.greenSectionHeaderText}>Benefits</Text>
            </View>
            <View style={styles.benefitsContainer}>
                {renderBenefitList(benefits).map((item, index) => (
                    <View key={index} style={styles.benefitItem}>
                        <Icon
                            name="check-circle-outline"
                            size={18}
                            color={colors.primaryGreen}
                            style={{marginRight: 8}}
                        />
                        <Text style={styles.benefitText}>{item}</Text>
                    </View>
                ))}
            </View>
        </>
    )}</>;
};

const styles = StyleSheet.create({
    greenSectionHeader: {
        paddingVertical: 10,
        borderRadius: 8,
    },
    greenSectionHeaderText: {
        fontSize: 14,
        fontWeight: '600',
    },
    benefitsContainer: {
        borderRadius: 8,
        backgroundColor: colors.white,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 8,
    },
    benefitText: {
        fontSize: 13,
        color: colors.primaryBlack,
    },
})
