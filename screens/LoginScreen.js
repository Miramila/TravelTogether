
import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, Pressable } from 'react-native';
import { signIn, signUp } from '../AuthManager';

function SigninBox({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    return (
      <View style={styles.loginContainer}>
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Email: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              placeholder='enter email address' 
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setEmail(text)}
              value={email}
            />
          </View>
        </View>
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Password: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              placeholder='enter password' 
              autoCapitalize='none'
              spellCheck={false}
              secureTextEntry={true}
              onChangeText={text=>setPassword(text)}
              value={password}
            />
          </View>
        </View>
        <View style={styles.loginRow}>
          <Pressable
          style={styles.redButton}
            onPress={ async () => {
              await signIn(email, password);
              navigation.navigate("Home");
            }}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>  
        </View>
      </View>
    );
}

function SignupBox({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
  
    return (
      <View style={styles.loginContainer}>
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Display Name: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              placeholder='enter display name' 
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setDisplayName(text)}
              value={displayName}
            />
          </View>
        </View>
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Email: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              placeholder='enter email address' 
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setEmail(text)}
              value={email}
            />
          </View>
        </View>
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Password: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              placeholder='enter password' 
              autoCapitalize='none'
              spellCheck={false}
              secureTextEntry={true}
              onChangeText={text=>setPassword(text)}
              value={password}
            />
          </View>
        </View>
        <View style={styles.loginRow}>
          <Pressable
          style={styles.redButton}
            onPress={async () => {
              try {
                await signUp(displayName, email, password);
                navigation.navigate("Home");
              } catch(error) {
                Alert.alert("Sign Up Error", error.message, [{ text: "OK" }])
              }
            }}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>  
        </View>
      </View>
    );
}



function LoginScreen({navigation}) {
    const [loginMode, setLoginMode] = useState(true);
  return (
    <View style={styles.container}>
        <Image 
        source={require('../assets/TravelLogo.jpg')} 
        style={styles.image}
      />

      <View style={styles.titleContainer}>
      </View>


      <View style={styles.bodyContainer}>
        
{loginMode?
          <SigninBox navigation={navigation}/>
        :
          <SignupBox navigation={navigation}/>
        }
        </View>
      <View styles={styles.modeSwitchContainer}>
        { loginMode ? 
          <Text>New user? 
            <Text 
              onPress={()=>{setLoginMode(!loginMode)}} 
              style={{color: 'blue'}}> Sign up </Text> 
            instead!
          </Text>
        :
          <Text>Returning user? 
            <Text 
              onPress={()=>{setLoginMode(!loginMode)}} 
              style={{color: 'blue'}}> Sign in </Text> 
            instead!
          </Text>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleContainer:{
      marginLeft: 50  
    },
    image: {
        width: 400, 
        height: 250, 
        resizeMode: 'contain', 
    },
    bodyContainer: {
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      paddingBottom: '10%',
    },
    loginHeader: {
      width: '100%',
      padding: '3%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginHeaderText: {
      fontSize: 24,
      color: 'black',
      paddingBottom: '5%'
    },
    loginRow: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      padding: '3%'
    },
    loginLabelContainer: {
      flex: 0.3,
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    loginLabelText: {
      fontSize: 18
    },
    loginInputContainer: {
      flex: 0.5,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      width: '100%'
    },
    loginInputBox: {
      width: '100%',
      borderColor: 'lightgray',
      borderWidth: 1,
      borderRadius: 6,
      fontSize: 18,
      padding: '2%'
    },
    modeSwitchContainer:{
      flex: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      backgroundColor: 'pink'
    },
    loginButtonRow: {
      width: '100%',
      justifyContent: 'center', 
      alignItems: 'center'
    },
    redButton: {
        backgroundColor: '#984447', 
        borderRadius: 20,         
        paddingVertical: 10,      
        paddingHorizontal: 20,    
      },
      buttonText:{
        color:"#ffffff",    
        fontSize: 20
      },
    listContainer: {
      flex: 0.7, 
      backgroundColor: '#ccc',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%', 
    },
  });


export default LoginScreen;