import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location  from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';






export default function App() {
   // Background task
    const LOCATION_TASK_NAME = 'background-location-task';
    TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
      if (error) {
        // Error occurred - check `error.message` for more details.
        return;
      }
      if (data) {
        const { locations } = data;
        // do something with the locations captured in the background
        console.log(locations);
       
      }
    });

    // Get location
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);



    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
     

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        // Background location
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 1000,
          distanceInterval: 0,
        });
      })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    }
 


    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
        <StatusBar style="auto" />
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
      text: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
      },

    
    
    });
