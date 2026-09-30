import { Component, signal } from '@angular/core';
import { Camera } from '@capacitor/camera';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon } from '@ionic/angular';
import { addIcons} from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon],
})
export class HomePage {
  photos = signal<string[]>([]);
  photosBase64 = signal<string[]>([]);

  constructor() {
    addIcons({ add });
  }

  async takePicture() {
    try {
      // API moderna: takePhoto reemplaza por completo a getPhoto y CameraSource
      const image = await Camera.takePhoto({
        quality: 90,
        saveToGallery: true
      });

      if (image.webPath) {
        // 1. Mostramos la imagen en el HTML (rápido y eficiente en memoria)
        this.photos.update(current => [image.webPath!, ...current]);
        
        // 2. Ejecutamos el método si necesitas subir la foto a un servidor
        const base64String = await this.webPathToBase64(image.webPath);
        this.photosBase64.update(current => [base64String, ...current]);
      }
    } catch (error) {
      console.error('Error al tomar la foto', error);
    }
  }

  // Método reintegrado para convertir el webPath nativo a un formato transmisible por red
  async webPathToBase64(webPath: string): Promise<string> {
    const response = await fetch(webPath);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }
}