import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import logo from "../../assets/logo_la_plage.png";
import api from "../../services/api";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [gerente, setGerente] = useState({});

    const login = async () => {
        const response = await api.post('/login-gerente', {
            email: email,
            password: password
        })
            .then(function (response) {
                if (response.data.data != null) {
                    navigation.navigate("Principal", {
                        gerente: response.data.data
                    });
                } else {
                    Alert.alert("Iiiiih!", "Algo deu errado, revise os dados inseridos!");
                }
            })
            .catch(function (error) {
                Alert.alert("Ops!", "Tem algo de errado aí, revise o e-mail e a senha.");
            });
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={logo} resizeMode="contain" style={styles.logo} />
            </View>
            <Text style={styles.textLogin}>Login</Text>
            <View>
                <TextInput style={styles.textInput} placeholder='E-mail' keyboardType="email-address" onChangeText={(text) => setEmail(text)} />
                <TextInput style={styles.textInput} placeholder='Senha' secureTextEntry={true} onChangeText={(text) => setPassword(text)} />
            </View>
            <View>
                <TouchableOpacity onPress={()=>navigation.navigate("RecuperarSenha")}><Text style={styles.textEsqCad} >Recuperar senha</Text></TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={styles.entrarButton} onPress={() => { login(); }}>
                    <Text>Entrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: '2%',
        paddingBottom: '2%',
        borderRadius: 10,
        justifyContent: 'center',
    },
    textLogin: {
        fontSize: Dimensions.get('window').width / 20,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    textInput: {
        width: '85%',
        height: Dimensions.get('window').height / 15,
        backgroundColor: "#FFFFFF",
        marginTop: '7%',
        borderRadius: 10,
        alignSelf: 'center',
        paddingLeft: '6%',
        paddingRight: '5%',
        elevation: 5,
    },
    textEsqCad: {
        alignSelf: 'center',
        color: 'grey',
        fontWeight: 'bold',
        fontStyle: 'italic',
        margin: '7%',

    },
    entrarButton: {
        width: Dimensions.get("screen").height*0.2,
        height: Dimensions.get("screen").height*0.07,
        backgroundColor: '#FDB981',
        borderRadius: 10,
        paddingLeft: '5%',
        paddingRight: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        elevation: 5,
        marginTop: '1%',
    },
    logoContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 5,
        alignContent: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: '80%',
        alignSelf: 'center',
    },
});