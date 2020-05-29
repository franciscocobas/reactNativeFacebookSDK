# React Native Facebook SDK integration

In order to integrate the Facebook SDK we are going to use the Facebook Login Button to authenticate through Facebook in our Android and iOS App. 

We start the process by creating a new react native app. Open your terminal and run:

`npx react-native init facebookAuth`

After a while the app is created, so we need to jump into the main directory by running: 

`cd ./facebookAuth`

Then we need to install the React Native Facebook SDK

`npm i --save react-native-fbsdk`

Since in React Native version 0.59 linking is done automatically, so we don’t need to touch anything around the pod files. All we need to do is run the pod install command.

`cd ./ios && pod install && cd ..`

**At this point in time we have the package installed on Android and iOS.**

In order to make use of the Facebook SDK we need to create (or use if you already have one) a developer account in Facebook. Go to the following url: https://developers.facebook.com/

Once the developer account has been created, we need to create an application within the account. 

Click on the Create App button.

![Screenshot of creating Facebook Developer App](https://i.ibb.co/CK9LCXV/Screen-Shot-2020-05-28-at-18-00-50.png "Create Facebook Developer App")

Complete the Display Name and entener a valid contact email address. 

![Screenshot of creating Facebook Developer App form](https://i.ibb.co/mzsXRDk/Screen-Shot-2020-05-29-at-10-09-13.png "Create new App ID")

Once the application is created we need to grab the APP ID

![Application ID](https://i.ibb.co/VvSPcYr/Screen-Shot-2020-05-29-at-10-12-39.png "APP ID")

In my case the APP ID is `637433896868373`

- React Native App is created ✅
- Facebook Developer Account is created ✅
- Let's dive into the Android and iOS specific configuration 👇🏼

### Android Configuration

#### Step 1
Open your `android/app/res/values/strings.xml` file and add your recently created APP ID

```xml
<resources>
    <string name="app_name">facebookAuth</string>
    <string name="facebook_app_id">637433896868373</string> <!-- Add this with your APP ID -->
</resources>
```

#### Step 2
Next we need to add user permissions. Open the `android/app/src/main/AndroidManifest.xml` file and add the ApplicationId meta-data tag.

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.facebookauth">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:theme="@style/AppTheme">

      <!-- Add this line below -->
      <meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>
      <!-- Add this line above -->

      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
        android:launchMode="singleTask"
        android:windowSoftInputMode="adjustResize">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
      </activity>
      <activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />
    </application>

</manifest>
```

### Step 3 

Go to the following URL: https://developers.facebook.com/quickstarts/?platform=android

1. In the input select the app you generated. 
2. In the section `Tell us about your Android project` complete as follows: 
You can find the Package name and the Activity Class Name in the file `/android/app/src/main/AndroidManifest.xml`
![Setup Facebook Android Step 2](https://i.ibb.co/hdMxrZV/Screen-Shot-2020-05-29-at-13-48-47.png "Facebook Android Setup")
1. Next Click on the Use this package name button 
![Setup Facebook Android Step 3](https://i.ibb.co/0YJfNKY/Screen-Shot-2020-05-29-at-13-48-55.png "Facebook Android Setup step 3")
4. Follow the instructions to complete the Key Hashes
![Setup Facebook Android Step 4](https://i.ibb.co/y68sKNc/Screen-Shot-2020-05-29-at-13-49-55.png "Facebook Android Setup step 4")

### iOS Configuration

#### Step 1

Open the `xcworkspace` file on Xcode.

Then open the `AppDelegate.m` file. Augment your file with the following code: 

```objective-c

#import <FBSDKCoreKit/FBSDKCoreKit.h>

- (BOOL)application:(UIApplication *)application 
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  
  [[FBSDKApplicationDelegate sharedInstance] application:application
    didFinishLaunchingWithOptions:launchOptions];
  // Add any custom logic here.
  return YES;
}

// This method should be within the AppDelegate implementation
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
    openURL:url
    sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
    annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
  ];
  // Add any custom logic here.
  return handled;
}

```

#### Step 2

On Xcode right click on the `info.plist` file. Open As > Source Code. 

Add the following code
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
  <key>CFBundleURLSchemes</key>
  <array>
    <string>fb637433896868373</string> <!-- Add fb[APP_ID] -->
  </array>
  </dict>
</array>
<key>FacebookAppID</key>
<string>637433896868373</string> <!-- Change to your APP Id -->
<key>FacebookDisplayName</key>
<string>exampleApp</string> <!-- Add your Facebook Developer App name -->
```


- React Native App is created ✅
- Facebook Developer Account is created ✅
- Android configuration completed ✅
- iOS configuration completed ✅

### Create Login with Facebook Button

Edit your `App.js` file and add the Login with Facebook button:

```javascript
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
```

## Test your App

#### Test in Android

You need to open the project on Android Studio in order to run the app.
Then run this command:

`react-native run-android`

#### Test in iOS

`react-native run-ios`