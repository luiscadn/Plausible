export type SimSlotProps = {
  active: boolean; // true cuando su sección está en pantalla
  reducedMotion: boolean;
  onCaptureKeys?: (capturing: boolean) => void;
};
