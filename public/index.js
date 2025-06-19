// Mantener pantalla encendida (Wake Lock)
let wakeLock = null;
async function activarWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('Wake Lock activado');
  } catch (err) {
    console.error(`No se pudo activar Wake Lock: ${err}`);
  }
}
document.addEventListener("visibilitychange", () => {
  if (wakeLock !== null && document.visibilityState === "visible") {
    activarWakeLock();
  }
});
activarWakeLock();