import {Tabs} from "expo-router";
import {View, StyleSheet} from "react-native";
import Home from "@/assets/home.svg"
import SearchLogo from "@/assets/searchlogo.svg";
import Profile from "@/assets/profile.svg";
import Email from "@/assets/email.svg";
import Order from "@/assets/order.svg";
import colors from "@/styles/colors";


export default function TabsLayout() {

    return (
        <Tabs
            backBehavior={'history'}
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: styles.tabBar,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Index",
                    headerShown: false,
                    tabBarIcon: ({focused}) => (
                        <View style={styles.iconContainer}>
                            <Home  height={focused ? 26 : 22}
                                   width={focused ? 26 : 22}
                                   color={focused ? colors.primaryGreen : colors.gray}/>
                        </View>
                    ),
                }}
            /><Tabs.Screen
                name="messages"
                options={{
                    title: "Messages",
                    headerShown: false,
                    tabBarIcon: ({focused}) => (
                        <View style={styles.iconContainer}>
                            <Email  height={focused ? 26 : 22}
                                    width={focused ? 26 : 22}
                                    color={focused ? colors.primaryGreen : colors.gray}/>
                        </View>
                    ),
                }}
            /><Tabs.Screen
            name="search"
            options={{
                title: "Search",
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <View style={styles.iconContainer}>
                        <SearchLogo   height={focused ? 46 : 42}
                                      width={focused ? 46 : 42}
                                     color={focused ? colors.primaryGreen : colors.gray}/>
                    </View>
                ),
            }}
        />
            <Tabs.Screen
            name="feed"
            options={{
                title: "Feed",
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <View style={styles.iconContainer}>
                        <Order  height={focused ? 26 : 22}
                                width={focused ? 26 : 22}
                                color={focused ? colors.primaryGreen : colors.gray}/>
                    </View>
                ),
            }}
        />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({focused}) => (
                        <View style={styles.iconContainer}>
                            <Profile  height={focused ? 26 : 22}
                                      width={focused ? 26 : 22}
                                      color={focused ? colors.primaryGreen : colors.gray}/>
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabBar: {
        backgroundColor: colors.white,
        height: 75,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderTopWidth: 0,
        position: 'absolute',
        paddingHorizontal: 20,
    },

    iconContainer: {
        marginTop: 5,
        marginBottom: -5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerIcon: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 50,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.15,
        shadowRadius: 11,
        elevation: 5,
    },
});
