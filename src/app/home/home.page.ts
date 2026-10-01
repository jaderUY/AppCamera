import { Component, OnInit, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { camera, images } from 'ionicons/icons';

interface PhotoItem {
  name: string;
  source: string;
  createdAt: number;
}

const photoDirectory = 'photos';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon],
})
export class HomePage implements OnInit {
  photos = signal<PhotoItem[]>([]);
  isCapturing = signal(false);
  errorMessage = signal('');

  constructor() {
    addIcons({ camera, images });
  }

  async ngOnInit() {
    await this.loadPhotos();
  }

  async takePicture(): Promise<void> {
    if (this.isCapturing()) return;

    this.isCapturing.set(true);
    this.errorMessage.set('');

    try {
      const image = await Camera.takePhoto({
        quality: 90,
        saveToGallery: false,
      });
      const source = image.webPath ?? (image.uri ? Capacitor.convertFileSrc(image.uri) : null);

      if (!source) throw new Error('La cámara no devolvió una imagen válida.');

      const response = await fetch(source);
      if (!response.ok) throw new Error('No se pudo leer la fotografía capturada.');

      const imageData = await this.blobToBase64(await response.blob());
      const fileName = `photo-${Date.now()}.jpg`;
      await Filesystem.writeFile({
        path: `${photoDirectory}/${fileName}`,
        data: imageData,
        directory: Directory.Data,
        recursive: true,
      });

      await this.loadPhotos();
    } catch (error) {
      console.error('Error al tomar la foto', error);
      this.errorMessage.set('No se pudo guardar la foto. Inténtalo de nuevo.');
    } finally {
      this.isCapturing.set(false);
    }
  }

  private async loadPhotos(): Promise<void> {
    try {
      await Filesystem.mkdir({
        path: photoDirectory,
        directory: Directory.Data,
        recursive: true,
      });
      const { files } = await Filesystem.readdir({
        path: photoDirectory,
        directory: Directory.Data,
      });

      const savedPhotos = await Promise.all(
        files
          .filter(file => file.type === 'file' && file.name.toLowerCase().endsWith('.jpg'))
          .map(async file => {
            const { uri } = await Filesystem.getUri({
              path: `${photoDirectory}/${file.name}`,
              directory: Directory.Data,
            });

            let source: string;
            if (Capacitor.isNativePlatform()) {
              source = Capacitor.convertFileSrc(uri);
            } else {
              const { data } = await Filesystem.readFile({
                path: `${photoDirectory}/${file.name}`,
                directory: Directory.Data,
              });
              source = data instanceof Blob
                ? URL.createObjectURL(data)
                : `data:image/jpeg;base64,${data}`;
            }

            return { name: file.name, source, createdAt: file.mtime };
          }),
      );

      savedPhotos.sort((first, second) => second.createdAt - first.createdAt);
      this.photos.set(savedPhotos);
    } catch (error) {
      this.photos.set([]);
      if (Capacitor.isNativePlatform()) {
        console.error('Error al cargar la galería', error);
        this.errorMessage.set('No se pudo cargar la galería de fotos.');
      }
    }
  }

  formatDate(timestamp: number): string {
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== 'string') {
          reject(new Error('No se pudo procesar la fotografía.'));
          return;
        }
        resolve(result.split(',')[1]);
      };
      reader.readAsDataURL(blob);
    });
  }
}