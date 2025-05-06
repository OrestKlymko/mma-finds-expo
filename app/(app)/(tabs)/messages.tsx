import {Text, View} from "react-native";

export default function Messages(){
    return <View>
    <Text>Asadsdas</Text>
    </View>
}

// import React, {useRef, useState} from 'react';
// import {Alert, Animated, Modal, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
// import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import {SwipeListView} from 'react-native-swipe-list-view';
// import {firestore} from '@/firebase/firebase';
// import {useAuth} from '@/context/AuthContext';
// import {getMessageInfo} from '@/service/service';
// import FilterIcon from '@/assets/filterblack.svg';
// import BlockedIcon from '@/assets/message/blocked.svg';
// import DeleteIcon from '@/assets/message/delete.svg';
// import MarkUnreadIcon from '@/assets/message/unread.svg';
// import ReadIcon from '@/assets/message/read.svg';
// import colors from '@/styles/colors';
// import {useNotification} from "@/context/NotificationContext";
// import {Image} from "expo-image";
// import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
// import MessageOption from "@/components/message/MessageOption";
//
// export type Conversation = {
//     id: string;
//     conversationId: string;
//     participants: string[];
//     lastMessage: string;
//     lastTimestamp: any; // Firestore Timestamp
//     unreadCount?: number;
//     // При необхідності можна додати додаткові поля, наприклад, archived або isBlocked
//     archived?: boolean;
//     isBlocked?: boolean;
//     avatar: string;
//     sender: string;
// };
//
// export default function Messages() {
//     const {entityId} = useAuth();
//     const navigation = useNavigation();
//     const [conversations, setConversations] = useState<Conversation[]>([]);
//     const [filter, setFilter] = useState('All'); // "All", "Unread", "Archive", "Block"
//     const [isFilterVisible, setFilterVisible] = useState(false);
//     const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [isModalVisible, setModalVisible] = useState(false);
//     const animatedValue = useRef(new Animated.Value(0)).current;
//     const {setUnreadCount} = useNotification();
//
//
//     useFocusEffect(
//         React.useCallback(() => {
//             setUnreadCount(0);
//         }, [])
//     )
//     const getReceiverIdFromConversationId = (conversationId: string[]) => {
//         if (!conversationId || !entityId) return;
//         let result = [];
//         conversationId.forEach(conv => {
//             result.push(conv.split('_').find(id => id === entityId));
//         });
//         return result;
//     };
//     // Функція для конвертації Firestore Timestamp
//     const convertNanoSecondAndSecondToTimeViewOrDayOfWeek = (
//         nanoSecond: number,
//         second: number,
//     ) => {
//         // Перетворення: секунди * 1000 + наносекунди / 1e6
//         const date = new Date(second * 1000 + nanoSecond / 1000000);
//         const currentDate = new Date();
//
//         if (
//             date.getFullYear() === currentDate.getFullYear() &&
//             date.getMonth() === currentDate.getMonth() &&
//             date.getDate() === currentDate.getDate()
//         ) {
//             return date.toLocaleTimeString('en-US', {
//                 hour: '2-digit',
//                 minute: '2-digit',
//             });
//         }
//
//         const yesterday = new Date(currentDate);
//         yesterday.setDate(currentDate.getDate() - 1);
//         if (
//             date.getFullYear() === yesterday.getFullYear() &&
//             date.getMonth() === yesterday.getMonth() &&
//             date.getDate() === yesterday.getDate()
//         ) {
//             return 'Yesterday';
//         }
//
//         const day = ('0' + date.getDate()).slice(-2);
//         const month = ('0' + (date.getMonth() + 1)).slice(-2);
//         const year = date.getFullYear();
//         return `${day}.${month}.${year}`;
//     };
//
//     // Завантаження розмов з Firestore
//     useFocusEffect(
//         React.useCallback(() => {
//             if (!entityId) return;
//
//             const q = query(
//                 collection(firestore, 'conversations'),
//                 where('participants', 'array-contains', entityId),
//                 where('theme', '==', 'private'),
//                 orderBy('lastTimestamp', 'desc'),
//             );
//
//             const unsubscribe = onSnapshot(q, async snapshot => {
//                 const results: Conversation[] = [];
//
//                 const promises = snapshot.docs.map(async docSnap => {
//                     const data = docSnap.data();
//                     const otherUserId = data.participants.find((id: string) => id !== entityId);
//                     const res = await getMessageInfo(otherUserId);
//
//                     results.push({
//                         id: docSnap.id,
//                         conversationId: data.conversationId,
//                         participants: data.participants,
//                         lastMessage: data.lastMessage,
//                         lastTimestamp: data.lastTimestamp,
//                         unreadCount: data.unreadCounts?.[entityId] ?? 0,
//                         avatar: res.profileImage,
//                         sender: res.name,
//                         archived: data.archived,
//                         isBlocked: data.isBlocked,
//                     });
//                 });
//
//                 await Promise.all(promises);
//                 setConversations(results);
//             });
//
//             return () => unsubscribe();
//         }, [entityId]),
//     );
//
//     // Фільтрація розмов
//     const filteredConversations = conversations.filter(conv => {
//         if (filter === 'All') return true;
//         if (filter === 'Unread') return conv.unreadCount && conv.unreadCount > 0;
//         if (filter === 'Block') return conv.isBlocked;
//         return true;
//     });
//
//     const markConversationAsUnread = async (
//         conversationId: string,
//         rowMap: any,
//     ) => {
//
//         try {
//             await firestore()
//                 .collection('conversations')
//                 .doc(conversationId)
//                 .update({
//                     [`unreadCounts.${entityId}`]: 1,
//                 });
//         } catch (error) {
//             console.error('Error marking as unread:', error);
//             Alert.alert('Error', 'Failed to mark conversation as unread.');
//         }finally {
//             rowMap[conversationId]?.closeRow();
//         }
//     };
//
//     const deleteConversation = async (conversationId: string, rowMap: any) => {
//         Alert.alert(
//             'Delete',
//             'Are you sure you want to delete this conversation?',
//             [
//                 {
//                     text: 'Cancel',
//                     style: 'cancel',
//                 },
//                 {
//                     text: 'Delete',
//                     style: 'destructive',
//                     onPress: async () => {
//                         try {
//                             await firestore().runTransaction(async transaction => {
//                                 const convRef = firestore()
//                                     .collection('conversations')
//                                     .doc(conversationId);
//                                 const messagesSnap = await convRef
//                                     .collection('messages')
//                                     .get({source: 'server'});
//                                 messagesSnap.forEach(doc => transaction.delete(doc.ref));
//                                 transaction.delete(convRef);
//                             });
//                         } catch (error) {
//                             console.error('Error deleting conversation:', error);
//                             Alert.alert('Error', 'Failed to delete conversation.');
//                         }
//                         finally {
//                             rowMap[conversationId]?.closeRow();
//                         }
//                     },
//                 },
//             ],
//             {cancelable: true},
//         );
//     };
//
//
//     // Рендер елемента списку (front row)
//     const renderItem = (data: {item: Conversation}) => {
//         const isSelected = selectedMessages.includes(data.item.id); // Check if the item is selected
//
//         return (
//             <Pressable
//                 style={[styles.rowFront]} // Apply selected style
//                 onPress={() => {
//                     if (isEditMode) {
//                         setSelectedMessages(prev =>
//                             prev.includes(data.item.id)
//                                 ? prev.filter(id => id !== data.item.id)
//                                 : [...prev, data.item.id],
//                         );
//                     } else {
//                         navigation.navigate('OpenChat', {
//                             receiverUserId: data.item.participants.filter(p => p !== entityId)[0],
//                             avatar: data.item.avatar,
//                             senderName: data.item.sender,
//                         });
//                     }
//                 }}>
//                 <View style={styles.avatarContainer}>
//                     {isEditMode && (
//                         <View
//                             style={[
//                                 isSelected ? styles.selectionDotFilled : styles.selectionDot,
//                             ]}
//                         />
//                     )}
//                     <Image source={{uri: data.item.avatar}} style={styles.avatar} />
//                 </View>
//                 <View style={styles.messageContent}>
//                     <Text
//                         style={[
//                             styles.sender,
//                             data.item.unreadCount > 0 && styles.unreadSender,
//                         ]}>
//                         {data.item.sender}
//                     </Text>
//                     <Text
//                         style={[
//                             styles.messageText,
//                             data.item.unreadCount > 0 && styles.unreadMessageText,
//                         ]}
//                         numberOfLines={1}>
//                         {data.item.lastMessage}
//                     </Text>
//                 </View>
//                 <Text
//                     style={[
//                         styles.time,
//                         data.item.unreadCount > 0 && {fontWeight: 'bold'},
//                     ]}>
//                     {convertNanoSecondAndSecondToTimeViewOrDayOfWeek(
//                         data.item.lastTimestamp.nanoseconds,
//                         data.item.lastTimestamp.seconds,
//                     )}
//                 </Text>
//             </Pressable>
//         );
//     };
//
//     // Рендер прихованого елемента (hidden row) для свайпу праворуч
//     const renderHiddenItem = (data: {item: Conversation},rowMap:any) => (
//         <View style={styles.rowBack}>
//             {/*<TouchableOpacity*/}
//             {/*  style={[styles.backRightBtn, styles.backRightBtnLeft]}*/}
//             {/*  onPress={() => archiveConversation(data.item.conversationId)}>*/}
//             {/*  <Text style={styles.backTextWhite}>Archive</Text>*/}
//             {/*</TouchableOpacity>*/}
//             <TouchableOpacity
//                 style={[styles.backRightBtn, styles.backRightBtnCenter]}
//                 onPress={() => markConversationAsUnread(data.item.id,rowMap)}>
//                 <MarkUnreadIcon color="white" />
//                 <Text style={styles.backTextWhite}>Unread</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//                 style={[styles.backRightBtn, styles.backRightBtnRight]}
//                 onPress={() => deleteConversation(data.item.id,rowMap)}>
//                 <DeleteIcon color="white" />
//                 <Text style={styles.backTextWhite}>Delete</Text>
//             </TouchableOpacity>
//         </View>
//     );
//
//     // Рендер модального вікна фільтрів
//     const renderFilterModal = () => (
//         <Modal
//             visible={isFilterVisible}
//             transparent
//             animationType="fade"
//             onRequestClose={() => setFilterVisible(false)}>
//             <TouchableOpacity
//                 style={styles.modalOverlay}
//                 activeOpacity={1}
//                 onPress={() => setFilterVisible(false)}>
//                 <View style={styles.optionsModal}>
//                     <Text style={[styles.recieverTitle, {paddingHorizontal: 56}]}>
//                         Filter
//                     </Text>
//                     <TouchableOpacity
//                         style={styles.optionItem}
//                         onPress={() => {
//                             setFilter('All');
//                             setFilterVisible(false);
//                         }}>
//                         <ReadIcon />
//                         <Text style={styles.optionText}>All</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         style={styles.optionItem}
//                         onPress={() => {
//                             setFilter('Unread');
//                             setFilterVisible(false);
//                         }}>
//                         <MarkUnreadIcon color={colors.primaryBlack} />
//                         <Text style={styles.optionText}>Unread</Text>
//                     </TouchableOpacity>
//                     {/*<TouchableOpacity style={styles.optionItem} onPress={() => { setFilter('Archive'); setFilterVisible(false); }}>*/}
//                     {/*  <ArchiveIcon />*/}
//                     {/*  <Text style={styles.optionText}>Archive</Text>*/}
//                     {/*</TouchableOpacity>*/}
//                     <TouchableOpacity
//                         style={styles.optionItem}
//                         onPress={() => {
//                             setFilter('Block');
//                             setFilterVisible(false);
//                         }}>
//                         <BlockedIcon />
//                         <Text style={styles.optionText}>Block</Text>
//                     </TouchableOpacity>
//                 </View>
//             </TouchableOpacity>
//         </Modal>
//     );
//
//     // Функція для перемикання режиму редагування
//     const toggleEditMode = () => {
//         setIsEditMode(!isEditMode);
//         if (isEditMode) {
//             navigation.setOptions({
//                 tabBarStyle: {
//                     backgroundColor: colors.white,
//                     height: 75,
//                     borderTopLeftRadius: 20,
//                     borderTopRightRadius: 20,
//                     shadowColor: '#000',
//                     shadowOffset: {width: 0, height: -3},
//                     shadowOpacity: 0.1,
//                     shadowRadius: 10,
//                     elevation: 5,
//                     borderTopWidth: 0,
//                     position: 'absolute',
//                     paddingHorizontal: 20,
//                 },
//             });
//             setSelectedMessages([]);
//         } else {
//             navigation.setOptions({
//                 tabBarStyle: {display: 'none'},
//             });
//         }
//         Animated.timing(animatedValue, {
//             toValue: isEditMode ? 0 : 1,
//             duration: 300,
//             useNativeDriver: true,
//         }).start();
//     };
//
//     return (
//         <SafeAreaView style={styles.safeArea}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={toggleEditMode}>
//                     <Text style={styles.doneText}>{isEditMode ? 'Done' : 'Edit'}</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Messages</Text>
//                 <TouchableOpacity onPress={() => setFilterVisible(true)}>
//                     <FilterIcon />
//                 </TouchableOpacity>
//             </View>
//             {isFilterVisible && renderFilterModal()}
//             <View style={styles.selectedCountContainer}>
//                 {isEditMode && selectedMessages.length > 0 && (
//                     <Text style={styles.selectedCount}>
//                         {selectedMessages.length} Selected
//                     </Text>
//                 )}
//             </View>
//             <SwipeListView
//                 data={filteredConversations}
//                 keyExtractor={item => item.id}
//                 renderItem={renderItem}
//                 renderHiddenItem={renderHiddenItem}
//                 rightOpenValue={-150}
//                 disableRightSwipe
//                 keyboardShouldPersistTaps="handled"
//                 contentContainerStyle={styles.messageList}
//             />
//             {isEditMode && (
//                 <View style={styles.actionBar}>
//                     <TouchableOpacity
//                         style={styles.actionItem}
//                         onPress={() => {
//                             // Позначення вибраних розмов як непрочитаних
//                             if (selectedMessages.length === 0) return;
//                             selectedMessages.forEach(async convId => {
//                                 try {
//                                     await firestore()
//                                         .collection('conversations')
//                                         .doc(convId)
//                                         .update({
//                                             [`unreadCounts.${entityId}`]: 1,
//                                         });
//                                 } catch (error) {
//                                     console.error('Error marking conversation as unread:', error);
//                                 }
//                             });
//                             setSelectedMessages([]);
//                             setIsEditMode(false);
//                             navigation.setOptions({
//                                 tabBarStyle: {
//                                     backgroundColor: colors.white,
//                                     height: 75,
//                                     borderTopLeftRadius: 20,
//                                     borderTopRightRadius: 20,
//                                     shadowColor: '#000',
//                                     shadowOffset: {width: 0, height: -3},
//                                     shadowOpacity: 0.1,
//                                     shadowRadius: 10,
//                                     elevation: 5,
//                                     borderTopWidth: 0,
//                                     position: 'absolute',
//                                     paddingHorizontal: 20,
//                                 },
//                             });
//                         }}>
//                         <Text style={styles.actionText}>Mark Unread</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         style={styles.actionItem}
//                         onPress={() => setModalVisible(true)}>
//                         <Text style={styles.actionText}>More</Text>
//                     </TouchableOpacity>
//                 </View>
//             )}
//
//
//             {/* Додаткове модальне вікно для MessageOption */}
//             <MessageOption
//                 conversationId={conversations.map(c => c.id)}
//                 isModalVisible={isModalVisible}
//                 setModalVisible={state => {
//                     setModalVisible(state);
//                     setSelectedMessages([]);
//                     setIsEditMode(false);
//                     navigation.setOptions({
//                         tabBarStyle: {
//                             backgroundColor: colors.white,
//                             height: 75,
//                             borderTopLeftRadius: 20,
//                             borderTopRightRadius: 20,
//                             shadowColor: '#000',
//                             shadowOffset: {width: 0, height: -3},
//                             shadowOpacity: 0.1,
//                             shadowRadius: 10,
//                             elevation: 5,
//                             borderTopWidth: 0,
//                             position: 'absolute',
//                             paddingHorizontal: 20,
//                         },
//                     });
//                 }}
//                 senderName={'Actions'}
//                 receiverId={getReceiverIdFromConversationId(selectedMessages)}
//             />
//         </SafeAreaView>
//     );
// };
//
//
// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: colors.white,
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 32,
//         paddingVertical: 12,
//     },
//     doneText: {
//         fontSize: 16,
//         fontWeight: '500',
//         fontFamily: 'Roboto',
//         color: colors.primaryGreen,
//     },
//     headerTitle: {
//         fontSize: 25,
//         fontWeight: '500',
//         color: colors.primaryBlack,
//     },
//     recieverTitle: {
//         paddingHorizontal: 36,
//         marginBottom: 16,
//         marginTop: 16,
//         fontSize: 13,
//         fontWeight: '700',
//         color: colors.primaryBlack,
//     },
//     selectedCount: {
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         fontWeight: '500',
//         fontSize: 16,
//         color: colors.primaryBlack,
//     },
//     messageList: {
//         paddingHorizontal: 16,
//     },
//     messageContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 12,
//         borderBottomWidth: 1,
//         borderBottomColor: colors.lightGray,
//     },
//     checkboxContainer: {
//         width: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     checkbox: {
//         width: 12,
//         height: 12,
//         borderRadius: 10,
//         borderWidth: 1,
//         borderColor: '#707070',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     checkboxSelected: {
//         width: 12,
//         height: 12,
//         borderRadius: 10,
//         backgroundColor: colors.primaryGreen,
//     },
//     avatarContainer: {
//         marginRight: 12,
//         position: 'relative',
//         alignItems: 'center',
//         flexDirection: 'row',
//     },
//     avatar: {
//         width: 50,
//         height: 50,
//         borderRadius: 60,
//     },
//     messageContent: {
//         flex: 1,
//     },
//     sender: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: colors.primaryBlack,
//     },
//     unreadSender: {
//         fontWeight: 'bold',
//     },
//     messageText: {
//         fontSize: 12,
//         color: colors.gray,
//     },
//     unreadMessageText: {
//         fontWeight: 'bold',
//     },
//     time: {
//         fontSize: 12,
//         color: colors.gray,
//     },
//     actionBar: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         alignItems: 'center',
//         paddingVertical: 12,
//         borderTopWidth: 1,
//         paddingHorizontal: 16,
//         borderTopColor: colors.lightGray,
//         backgroundColor: colors.white,
//     },
//     actionItem: {
//         alignItems: 'center',
//     },
//     actionText: {
//         fontSize: 16,
//         fontWeight: '500',
//         color: colors.primaryGreen,
//     },
//     modalOverlay: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     optionsModal: {
//         backgroundColor: colors.white,
//         paddingVertical: 20,
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         paddingHorizontal: 16,
//         paddingBottom: 66,
//     },
//     optionItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 15,
//         paddingHorizontal: 26,
//         borderBottomWidth: 1,
//         borderBottomColor: colors.lightGray,
//     },
//     optionText: {
//         fontSize: 13,
//         marginLeft: 22,
//         fontWeight: '400',
//         fontFamily: 'Roboto',
//         lineHeight: 15,
//         color: colors.secondaryBlack,
//     },
//     rowFront: {
//         backgroundColor: colors.white,
//         borderBottomColor: colors.lightGray,
//         borderBottomWidth: 1,
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     rowBack: {
//         alignItems: 'center',
//         flex: 1,
//         flexDirection: 'row',
//         justifyContent: 'flex-end',
//         paddingRight: 15,
//     },
//     backRightBtn: {
//         alignItems: 'center',
//         bottom: 0,
//         justifyContent: 'center',
//         position: 'absolute',
//         top: 0,
//         width: 75,
//         paddingHorizontal: 20,
//     },
//     backRightBtnLeft: {
//         backgroundColor: colors.primaryGreen,
//         right: 100,
//     },
//     backRightBtnCenter: {
//         backgroundColor: colors.gray,
//         right: 75,
//     },
//     backRightBtnRight: {
//         backgroundColor: colors.darkError,
//         right: 0,
//     },
//     backTextWhite: {
//         marginTop: 6,
//         color: '#FFF',
//         fontSize: 8,
//         fontWeight: '400',
//     },
//     selectedCountContainer: {
//         height: 32,
//         justifyContent: 'center',
//         paddingHorizontal: 16,
//         backgroundColor: colors.white,
//     },
//     selectionContainer: {
//         width: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     selectionDot: {
//         width: 13,
//         height: 13,
//         borderRadius: 9,
//         borderWidth: 1,
//         marginRight: 10,
//         borderColor: '#707070',
//         backgroundColor: 'transparent',
//     },
//     selectionDotFilled: {
//         width: 13,
//         height: 13,
//         borderRadius: 9,
//         borderWidth: 1,
//         marginRight: 10,
//         borderColor: colors.primaryGreen,
//         backgroundColor: colors.primaryGreen, // Зелений при виборі
//     },
// });
