import {
  Injectable,
  OnDestroy,
  computed,
  effect,
  linkedSignal,
  signal,
} from "@angular/core";
import { Cropt } from "cropt";

@Injectable()
export class CroptService implements OnDestroy {
  error = signal<Option<unknown>>(null);

  private element = signal<Option<HTMLElement>>(null);
  private image = signal<Option<File>>(null);
  private cropSize = signal<{ width: number; height: number }>({
    width: 240,
    height: 320,
  });
  private cropImageType = signal("image/jpeg");
  private cropImageQuality = signal(0.8);

  configure(
    options: Partial<{
      cropSize: { width: number; height: number };
      cropImageType: string;
      cropImageQuality: number;
    }>,
  ) {
    const { cropSize, cropImageType, cropImageQuality } = options;

    if (cropSize) {
      this.cropSize.set(cropSize);
    }
    if (cropImageType) {
      this.cropImageType.set(cropImageType);
    }
    if (cropImageQuality) {
      this.cropImageQuality.set(cropImageQuality);
    }
  }

  setImage(
    /**
     * Element where the crop UI should be rendered.
     */
    element: Option<HTMLElement>,

    /**
     * Image to crop.
     */
    file: Option<File>,
  ) {
    this.element.set(element);
    this.image.set(file);
    this.error.set(null);
  }

  async getCroppedImage(): Promise<Option<File>> {
    const cropt = this.cropt();
    if (!cropt) {
      return null;
    }

    const filename =
      // Replace any non-JPEG extension with ".jpg"
      this.image()?.name?.replace(/\.[a-z]{3,4}$/i, ".jpg") ?? "avatar.jpg";
    const size = Math.max(this.cropSize().width, this.cropSize().height);
    const blob = await cropt.toBlob(
      size,
      this.cropImageType(),
      this.cropImageQuality(),
    );
    return new File([blob], filename, {
      type: this.cropImageType(),
    });
  }

  private croptOptions = computed(() => ({
    viewport: this.cropSize(),
  }));
  private cropt = linkedSignal<Option<HTMLElement>, Option<Cropt>>({
    source: this.element,
    computation: (element, previous) => {
      previous?.value?.destroy();

      if (!element) return null;

      return new Cropt(element, this.croptOptions());
    },
  });

  constructor() {
    effect(() => {
      const image = this.image();
      if (!image) return;

      const objectUrl = URL.createObjectURL(image);
      void (async () => {
        try {
          await this.cropt()?.bind(objectUrl);
        } catch (error) {
          console.error("Error binding image for cropping", error);
          this.error.set(error);
        }
      })();
    });
  }

  ngOnDestroy(): void {
    this.cropt()?.destroy();
  }
}
