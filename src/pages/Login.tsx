import React, { useState } from 'react';
import { 
  IonButton,
  IonContent, 
  IonHeader, 
  IonInput,
  IonItem,
  IonLabel,
  IonPage, 
  IonTitle, 
  IonToolbar, 
  useIonRouter
} from '@ionic/react';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const doLogin = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((user: any) => user.username === username && user.password === password);

    if (user) {
      navigation.push('/it35-lab/app', 'forward', 'replace');
    } else {
      setError('Invalid username or password');
    }
  }

  const navigateToRegister = () => {
    navigation.push('/it35-lab/register', 'forward', 'replace');
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <IonButton onClick={doLogin} expand="full">
          Login
        </IonButton>
        <IonButton onClick={navigateToRegister} expand="full" color="secondary" style={{ marginTop: '1rem' }}>
          Register
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;