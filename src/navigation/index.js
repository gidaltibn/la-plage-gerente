import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Principal from "../screens/Principal";
import Categorias from "../screens/Categorias";
import Produtos from "../screens/Produtos";
import Vendas from "../screens/Vendas";
import Usuarios from "../screens/Usuarios";
import DetalhesProduto from "../screens/DetalhesProduto";
import DetalhesUsuario from "../screens/DetalhesUsuario";
import Cadastro from "../screens/Cadastro";
import Gerentes from "../screens/Gerentes";
import DetalhesGerente from "../screens/DetalhesGerente";
import RecuperarSenha from "../screens/RecuperarSenha";
import Perfil from "../screens/Perfil";

const Stack = createNativeStackNavigator();

export default function Navigation(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="RecuperarSenha"
                component={RecuperarSenha}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Principal"
                component={Principal}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Categorias"
                component={Categorias}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Produtos"
                component={Produtos}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Vendas"
                component={Vendas}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Usuarios"
                component={Usuarios}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Cadastro"
                component={Cadastro}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Gerentes"
                component={Gerentes}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="DetalhesProduto"
                component={DetalhesProduto}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="DetalhesUsuario"
                component={DetalhesUsuario}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="DetalhesGerente"
                component={DetalhesGerente}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Perfil"
                component={Perfil}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
}