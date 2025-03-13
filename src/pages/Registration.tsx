import React, { useState } from 'react';
import { 
  IonButton,
  IonButtons,
  IonContent, 
  IonHeader, 
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  useIonRouter
} from '@ionic/react';

const Registration: React.FC = () => {
  const navigation = useIonRouter();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const doRegister = () => {
    if (!username || !password || !email) {
      setError('All fields are required.');
      return;
    }

    // Here you can add additional logic to handle user registration
    // For example, sending the data to an API or saving it locally

    setError('');
    setSuccess('User registered successfully.');

    // Navigate back to login after successful registration
    setTimeout(() => {
      navigation.push('/it35-lab', 'back', 'replace');
    }, 1500);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Registration</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonItem>
          <IonLabel position="floating">Username</IonLabel>
          <IonInput 
            value={username} 
            onIonChange={e => setUsername(e.detail.value!)} 
            clearInput
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput 
            type="password" 
            value={password} 
            onIonChange={e => setPassword(e.detail.value!)} 
            clearOnEdit
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput 
            type="email" 
            value={email} 
            onIonChange={e => setEmail(e.detail.value!)} 
            clearOnEdit
          ></IonInput>
        </IonItem>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <IonButton onClick={doRegister} expand="full">
          Register
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Registration;