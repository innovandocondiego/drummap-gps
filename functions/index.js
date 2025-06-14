const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'reportes.drummap@gmail.com',
    pass: 'TU_PASSWORD'
  }
});

exports.onPointCreated = functions.firestore
  .document('points/{pointId}')
  .onCreate((snap, context) => {
    const pointData = snap.data();
    return transporter.sendMail({
      from: 'DRUMMAP <no-reply@drummap.com>',
      to: 'reportecamionesturno1.dltd@gmail.com',
      subject: `Nuevo punto creado en ${pointData.mine}`,
      html: `<h2>Nuevo punto registrado</h2>
             <p><strong>Tipo:</strong> ${pointData.type}</p>
             <p><a href="https://maps.google.com/?q=${pointData.location.latitude},${pointData.location.longitude}">Ver ubicación</a></p>`
    });
  });