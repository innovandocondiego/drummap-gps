let map;
let currentMarker = null;
let puntos = [];
let rutas = [];
let emergenciaActiva = false;

// Espera a que el DOM cargue completamente
window.onload = () => {
  initMap();

  document.getElementById("addPoint").onclick = agregarPuntoDesdeUbicacion;
  document.getElementById("searchPoint").onclick = buscarPunto;
  document.getElementById("drawRoute").onclick = trazarRuta;
  document.getElementById("activateEmergency").onclick = activarEmergencia;
};

// Inicializa el mapa centrado en la ubicación del usuario
function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        map = new google.maps.Map(document.getElementById("map"), {
          center: userLocation,
          zoom: 12,
        });

        new google.maps.Marker({
          position: userLocation,
          map,
          title: "Tu ubicación actual",
        });
      },
      () => {
        alert("No se pudo obtener tu ubicación.");
      }
    );
  } else {
    alert("Tu navegador no soporta la geolocalización.");
  }
}

// 1️⃣ Agregar punto desde ubicación actual
function agregarPuntoDesdeUbicacion() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const location = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      const marker = new google.maps.Marker({
        position: location,
        map,
        title: `Punto ${puntos.length + 1}`,
      });

      puntos.push(marker);
      map.setCenter(location);
    });
  } else {
    alert("No se puede acceder a la ubicación.");
  }
}

// 2️⃣ Buscar punto por nombre (ejemplo básico)
function buscarPunto() {
  const nombre = prompt("Ingresa el nombre del lugar (ej: Bogotá):");
  if (!nombre) return;

  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: nombre }, (results, status) => {
    if (status === "OK") {
      const ubicacion = results[0].geometry.location;
      map.setCenter(ubicacion);
      const marcador = new google.maps.Marker({
        map: map,
        position: ubicacion,
        title: nombre,
      });
      puntos.push(marcador);
    } else {
      alert("Lugar no encontrado: " + status);
    }
  });
}

// 3️⃣ Trazar ruta entre los dos últimos puntos agregados
function trazarRuta() {
  if (puntos.length < 2) {
    alert("Agrega al menos dos puntos para trazar una ruta.");
    return;
  }

  const origen = puntos[puntos.length - 2].getPosition();
  const destino = puntos[puntos.length - 1].getPosition();

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  directionsService.route(
    {
      origin: origen,
      destination: destino,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
        rutas.push(directionsRenderer);
      } else {
        alert("No se pudo trazar la ruta: " + status);
      }
    }
  );
}

// 4️⃣ Activar emergencia (marcador especial rojo)
function activarEmergencia() {
  if (emergenciaActiva) {
    alert("Ya hay una emergencia activa.");
    return;
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const ubicacion = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      const marker = new google.maps.Marker({
        position: ubicacion,
        map: map,
        title: "🚨 Emergencia",
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        },
      });

      map.setCenter(ubicacion);
      emergenciaActiva = true;
      alert("¡Emergencia activada y notificada!");

      // Aquí puedes integrar Firebase o email (como n8n o correo Gmail)
      // simulación de notificación
      console.log("Correo enviado a: reportecamionesturno1.dltd@gmail.com");
    });
  }
}