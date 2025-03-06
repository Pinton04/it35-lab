import { 
    IonButtons,
      IonContent, 
      IonHeader, 
      IonMenuButton, 
      IonPage, 
      IonTitle, 
      IonToolbar 
  } from '@ionic/react';
import SearchContainer from '../../components/SearchContainer';
  
  const Contact: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot='start'>
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Contact</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
         <SearchContainer/>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Contact;