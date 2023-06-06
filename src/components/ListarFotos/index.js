import React from "react";
import { View, StyleSheet , Text, Dimensions } from "react-native";

export default function ListaFotos(params) {
    console.log(params.foto.id);
    const nomeFoto = params.foto.nome;

    return (
        <View style={styles.container}>
            <Text style={styles.texto}>{nomeFoto}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        width: Dimensions.get("window").width*0.8,
        height: Dimensions.get("window").width*0.07,
        justifyContent: 'center',
        alignContent: 'center',
        paddingLeft: '5%',
    },
    texto: {
        fontSize: Dimensions.get("window").width/25,
    },
});