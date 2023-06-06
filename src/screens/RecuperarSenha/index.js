import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import logo from "../../assets/logo_la_plage.png";
import api from "../../services/api";


export default function RecuperarSenha() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [perguntaSecreta, setPerguntaSecreta] = useState('');
    const [respostaSecreta, setRespostaSecreta] = useState('');
    const [respostaSecretaRegistrada, setRespostaSecretaRegistrada] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [etapa, setEtapa] = useState(1);
    const [id, setId] = useState();

    const handleVerificarEmail = async () => {
        const response = await api.post("/gerente/email", {email: email});
        setRespostaSecretaRegistrada(response.data.respostaPerguntaSecreta);

        if (email === response.data.email) {
            setPerguntaSecreta(response.data.perguntaSecreta);
            setId(response.data.id);
            setEtapa(2);
        } else {
            Alert.alert("Ops!", "Esse e-mail não está cadastrado!");
        }
    };

    const handleVerificarRespostaSecreta = () => {
        if (respostaSecreta.toLocaleLowerCase() === respostaSecretaRegistrada.toLocaleLowerCase()) {
            setEtapa(3);
        } else {
            Alert.alert("Ops!", "Essa resposta está errada!");
        }
    };

    const handleRedefinirSenha = () => {
        if (novaSenha === confirmarSenha) {
            alterarSenha();
        } else {
            Alert.alert("Ops!", "As senhas não batem, dá uma conferida aí!");
        }
    };

    const alterarSenha = async () =>{
        const response = await api.post("/gerente/editar-gerente", {id: id,password: novaSenha, status: true});
        await console.log(response.status);
        if (response.status === 200){
            Alert.alert("Tudo certo!", "Sua senha foi alterada com sucesso!");
            navigation.goBack();
        }else{
            Alert.alert("Ops!", "Deu algum probleminha. Tente novamente ou entre em contato com o suporte.");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={logo} resizeMode="contain" style={styles.logo} />
            </View>
            {etapa === 1 && (
                <>
                    <Text style={styles.label}>Digite seu e-mail cadastrado:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        onChangeText={setEmail}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleVerificarEmail}>
                        <Text style={styles.buttonText}>Verificar E-mail</Text>
                    </TouchableOpacity>
                </>
            )}
            {etapa === 2 && (
                <>
                    <Text style={styles.label}>Responda à pergunta secreta:</Text>
                    <Text style={styles.perguntaSecreta}>{perguntaSecreta}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Resposta secreta"
                        value={respostaSecreta}
                        onChangeText={setRespostaSecreta}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleVerificarRespostaSecreta}>
                        <Text style={styles.buttonText}>Verificar Resposta</Text>
                    </TouchableOpacity>
                </>
            )}

            {etapa === 3 && (
                <>
                    <Text style={styles.label}>Digite a nova senha:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nova senha"
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar nova senha"
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.button} onPress={handleRedefinirSenha}>
                        <Text style={styles.buttonText}>Redefinir Senha</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
    },
    logoContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 5,
        alignContent: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: '60%',
        alignSelf: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    perguntaSecreta: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        width: '85%',
        height: Dimensions.get('window').height / 20,
        backgroundColor: "#FFFFFF",
        marginTop: '7%',
        borderRadius: 10,
        alignSelf: 'center',
        paddingLeft: '6%',
        paddingRight: '5%',
        elevation: 5,
    },
    button: {
        width: Dimensions.get("screen").height*0.2,
        height: Dimensions.get("screen").height*0.05,
        backgroundColor: '#FDB981',
        borderRadius: 10,
        paddingLeft: '5%',
        paddingRight: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        elevation: 5,
        marginTop: '2%',
    },
    buttonText: {
    },

}
