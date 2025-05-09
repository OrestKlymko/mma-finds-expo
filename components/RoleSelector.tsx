// import React from 'react';
// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   ViewStyle,
//   TextStyle,
//   View,
// } from 'react-native';
// import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
// import colors from '@/styles/colors';
//
// /**
//  * Configuration for a single role
//  */
// export interface RoleItem {
//   id: string;
//   label: string;
//   icon?: React.ComponentProps<typeof Icon>['name'];
// }
//
// interface Props {
//   selected: string | null;
//   roles: RoleItem[];
//   onSelect(roleId: 'MANAGER' | 'PROMOTION' | 'PROMOTION_EMPLOYEE'): void;
//   style?: ViewStyle;
//   pillStyle?: ViewStyle;
//   labelStyle?: TextStyle;
// }
//
// const roles = [
//   { value: 'MANAGER', label: 'Manager', icon: 'account-tie' },
//   { value: 'PROMOTION', label: 'Promotion', icon: 'office-building' },
//   { value: 'PROMOTION_EMPLOYEE', label: 'Employee', icon: 'account-group' },
// ];
//
// export const RoleSelector: React.FC<Props> = ({
//                                                 selected,
//                                                 onSelect,
//                                                 style,
//                                                 pillStyle,
//                                                 labelStyle,
//                                               }) => {
//   return (
//       <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={[styles.wrapper, style]}
//       >
//         {roles.map(({ id, label, icon }) => {
//           const active = id === selected;
//           return (
//               <TouchableOpacity
//                   key={id}
//                   activeOpacity={0.8}
//                   style={[styles.pill, pillStyle, active && styles.pillActive]}
//                   onPress={() => onSelect(id)}
//               >
//                 {icon && (
//                     <Icon
//                         name={icon}
//                         size={18}
//                         color={active ? colors.white : colors.primaryGreen}
//                     />
//                 )}
//                 <Text
//                     style={[styles.label, labelStyle, active && styles.labelActive]}
//                 >
//                   {label}
//                 </Text>
//                 {active && (
//                     <Icon
//                         name="check-circle"
//                         size={16}
//                         color={colors.white}
//                         style={styles.check}
//                     />
//                 )}
//               </TouchableOpacity>
//           );
//         })}
//       </ScrollView>
//   );
// };
//
// const styles = StyleSheet.create({
//   wrapper: {
//     flexDirection: 'row',
//     backgroundColor: colors.white,
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 40,
//     borderWidth: 1,
//     borderColor: colors.primaryGreen,
//     marginBottom: 24,
//   },
//   pill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     marginHorizontal: 4,
//     borderRadius: 30,
//     minWidth: 100,
//   },
//   pillActive: {
//     backgroundColor: colors.primaryGreen,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOpacity: 0.12,
//     shadowRadius: 3,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   label: {
//     marginLeft: 6,
//     color: colors.primaryGreen,
//     fontSize: 14,
//     fontWeight: '500',
//     textTransform: 'capitalize',
//   },
//   labelActive: {
//     color: colors.white,
//   },
//   check: {
//     marginLeft: 4,
//   },
// });
