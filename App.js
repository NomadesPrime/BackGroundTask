import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location  from 'expo-location';
import * as TaskManager from 'expo-task-manager';


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
 
    // Schedule a notification
    const [notification, setNotification] = useState(false);
    const [notificationResponse, setNotificationResponse] = useState(null);

    useEffect(() => {
      const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
        setNotificationResponse(response);
      });

      const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
      
      return () => {
        backgroundSubscription.remove();
        foregroundSubscription.remove();
      };
    }, []);

    useEffect(() => {
      (async () => {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here' },
          },
          trigger: { seconds: 2 },
        });
      })();
    }, []);

    
    

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
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


});
