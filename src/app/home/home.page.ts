import { Component, inject, signal } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonFab, IonFabButton, IonIcon 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { camera, images } from 'ionicons/icons';

// Importamos el servicio que acabamos de crear y su interfaz
import { PhotoService, Photo } from '../services/photo';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonFab, IonFabButton, IonIcon
  ],
})
export class HomePage {
  
  private photoService = inject(PhotoService);
  photos = signal<Photo[]>([]);
  errorMessage = signal<string>('');
  isCapturing = signal<boolean>(false);

  constructor() {
    // Registro de íconos para el HTML
    addIcons({ camera, images });
  }

  // ==========================================
  // LÓGICA DE LA VISTA
  // ==========================================
  async takePicture() {
    this.isCapturing.set(true);
    this.errorMessage.set('');

    try {
      // Llamamos a Capacitor a través de nuestro servicio
      const newPhoto = await this.photoService.takePhoto();
      
      // Actualizamos la galería agregando la foto nueva al inicio
      this.photos.update(currentPhotos => [newPhoto, ...currentPhotos]);
    } catch (error) {
      console.error('Error al capturar la foto:', error);
      this.errorMessage.set('No se pudo capturar la fotografía. Inténtalo de nuevo.');
    } finally {
      this.isCapturing.set(false);
    }
  }

  // Formateador de fecha para tu etiqueta <figcaption>
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}