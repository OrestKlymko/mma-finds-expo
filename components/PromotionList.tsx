import {PromotionResponse} from '@/service/response';
import {FlatList} from 'react-native';
import {PromotionCard} from "@/components/PromotionCard";

type PromotionListProps = {
    promotions: PromotionResponse[];
};

export const PromotionList = ({promotions}: PromotionListProps) => {
    return (
        <FlatList
            data={promotions}
            renderItem={item => <PromotionCard item={item.item} />}
            keyExtractor={item => item.promotionId}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        />
    );
};
