import React, { useState, useEffect } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonButton, IonInput, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonList, IonFooter } from '@ionic/react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { usePhotoGallery } from '../../src/hooks/usePhotoGallery';
import axios from 'axios';

import './Page.css';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { name } = useParams<{ name: string; }>();
  const history = useHistory();

  const [empid, setUsername] = useState<string>('');
  const [mpin, setPassword] = useState<string>('');
  const [MobileNumber, setMobileNumber] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<any>(null);

  const { photos, takePhoto } = usePhotoGallery();

  useEffect(() => {
    // Load data from local storage when the component mounts
    const storedData = localStorage.getItem('isLoggedIn');
    if (storedData === "true") {
      setIsLoggedIn(storedData);
      history.push('/pages/Dashboard');
    }
  }, [history]);

  const saveToStorage = () => {
    // Save data to local storage
    localStorage.setItem('isLoggedIn', "true");
    // Update state
    setIsLoggedIn("true");
  };

  async function loginApi(formData) {
    try {
      alert(formData);
      const response = await axios.post('https://guard.ghamasaana.com/guard_new_api/login.php', formData);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  const handleLogin = async () => {
    try {
      // await takePhoto();
      const formData = new FormData();
      formData.append('empid', empid);
      formData.append('mpin', mpin);
      formData.append('mobile', MobileNumber);
      formData.append('action', "login");

      const response = await loginApi(formData);

      if (response) {

        if (response.success) {
          saveToStorage();

          // if (!photos || !photos.filepath) {
          //   await takePhoto();
          // }

          // if (photos && photos.filepath) {
            
            localStorage.setItem('loggedInUser', JSON.stringify(response.employee_data));
            localStorage.setItem('token', response.token);
            history.push('/pages/Dashboard');
          // } else {
          //   alert('Please click a photo before logging in');
          // }
        } else {
          alert(response.message || 'Wrong User Name or Password');
        }
      } else {
        alert('Wrong User Name or Password');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonImg className='header-image' src="./assets/imgs/logo.jpg" alt="header" style={{ display: 'flex', height: '100px', width: '100%', margin: '7px' }} />
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonTitle>{name}</IonTitle>
        </IonHeader>
        <IonCard className='ion-text-center ion-margin'>
          <IonCardHeader>
            <IonCardTitle color={'dark'}>{t('LogIn')}</IonCardTitle>
            <IonCardSubtitle color={'dark'}>{t('WelcomeGaurd')}</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <IonList>
              <IonItem className='ion-margin-bottom ion-margin-top'>
                <IonInput
                  type="text"
                  value={empid}
                  placeholder={t('Employee ID')}
                  onIonChange={(e) => setUsername(e.detail.value!)}
                />
              </IonItem>
              <IonItem className='ion-margin-bottom'>
                <IonInput
                  type="password"
                  value={mpin}
                  placeholder={t('Employee Password')}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                />
              </IonItem>
              <IonItem className='ion-margin-bottom'>
                <IonInput
                  type="number"
                  value={MobileNumber}
                  placeholder={t('Mobile Number')}
                  onIonChange={(e) => setMobileNumber(e.detail.value!)}
                />
              </IonItem>
              <IonItem className='ion-margin-bottom'>
                <IonButton expand="block" color="secondary" size="default" onClick={handleLogin}>{t('Login')}</IonButton>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
        <div className='footer'>
          <IonTitle className='footer ion-text-center'>{t('Helpline')} | +91 90999 XXXXX</IonTitle>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
