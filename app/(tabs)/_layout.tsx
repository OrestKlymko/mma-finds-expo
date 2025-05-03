import {Tabs} from "expo-router";
import {Image, Text, View} from "react-native";


function TabIcon({focused, icon, title}: any) {
    if (focused) {
        return (
                <Text>
                    {title}
                </Text>
        );
    }

    return (
        <View>
            <Image source={icon}/>
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                },
                tabBarStyle: {
                    backgroundColor: "#0F0D23",
                    borderRadius: 50,
                    marginHorizontal: 20,
                    marginBottom: 36,
                    height: 52,
                    position: "absolute",
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "#0F0D23",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "index",
                    headerShown: false,
                    tabBarIcon: ({focused}) => (
                        <Text>A</Text>
                        // <TabIcon focused={focused} icon={icons.home} title="Home"/>
                    ),
                }}
            />

            {/*<Tabs.Screen*/}
            {/*    name="messages"*/}
            {/*    options={{*/}
            {/*        title: "Messages",*/}
            {/*        headerShown: false,*/}
            {/*        tabBarIcon: ({focused}) => (*/}
            {/*            <Text>D</Text>*/}
            {/*            // <TabIcon focused={focused} icon={icons.search} title="Search"/>*/}
            {/*        ),*/}
            {/*    }}*/}
            {/*/>*/}

            {/*<Tabs.Screen*/}
            {/*    name="search"*/}
            {/*    options={{*/}
            {/*        title: "Search",*/}
            {/*        headerShown: false,*/}
            {/*        tabBarIcon: ({focused}) => (*/}
            {/*            <Text>C</Text>*/}
            {/*            // <TabIcon focused={focused} icon={icons.save} title="Save"/>*/}
            {/*        ),*/}
            {/*    }}*/}
            {/*/>*/}

            {/*<Tabs.Screen*/}
            {/*    name="feed"*/}
            {/*    options={{*/}
            {/*        title: "Feed",*/}
            {/*        headerShown: false,*/}
            {/*        tabBarIcon: ({focused}) => (*/}
            {/*            <Text>A</Text>*/}
            {/*            // <TabIcon focused={focused} icon={icons.person} title="Profile"/>*/}
            {/*        ),*/}
            {/*    }}*/}
            {/*/>*/}
            {/*<Tabs.Screen*/}
            {/*    name="profile"*/}
            {/*    options={{*/}
            {/*        title: "Profile",*/}
            {/*        headerShown: false,*/}
            {/*        tabBarIcon: ({focused}) => (*/}
            {/*            <Text>A</Text>*/}
            {/*            // <TabIcon focused={focused} icon={icons.person} title="Profile"/>*/}
            {/*        ),*/}
            {/*    }}*/}
            {/*/>*/}
        </Tabs>
    );
}


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     tabBar: {
//         backgroundColor: colors.white,
//         height: 75,
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         shadowColor: '#000',
//         shadowOffset: {width: 0, height: -3},
//         shadowOpacity: 0.1,
//         shadowRadius: 10,
//         elevation: 5,
//         borderTopWidth: 0,
//         position: 'absolute',
//         paddingHorizontal: 20,
//     },
//
//     iconContainer: {
//         marginTop: 5,
//         marginBottom: -5,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     centerIcon: {
//         backgroundColor: colors.primaryGreen,
//         borderRadius: 50,
//         width: 40,
//         height: 40,
//         alignItems: 'center',
//         justifyContent: 'center',
//         shadowColor: '#000',
//         shadowOffset: {width: 0, height: 3},
//         shadowOpacity: 0.15,
//         shadowRadius: 11,
//         elevation: 5,
//     },
// });
