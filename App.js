import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk';

const App = () => {
  const [token, setToken] = useState(null);

  return (
    <View style={styles.container}>
      <LoginButton
        onLoginFinished={(error, result) => {
          if (error) {
            console.log("login has error: " + result.error);
          } else if (result.isCancelled) {
            console.log("login is cancelled.");
          } else {
            AccessToken.getCurrentAccessToken().then(data => {
              setToken(data.accessToken.toString());
            })
          }
        }}
        onLogoutFinished={() => setToken(null)}
      />
      {token ? <Text style={{ textAlign: 'center' }}>{`Token: ${token}`}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default App;