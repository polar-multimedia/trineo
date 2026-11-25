/**
 * Trineo · Aviso de envío
 * Revisa los correos enviados de quien lo instala y, cuando encuentra una liga de Trineo,
 * anota en el panel que esa cotización ya fue enviada (fecha, hora y quién la envió).
 *
 * Instalación (una vez por persona):
 *   1. Ejecutar la función  instalar  y aceptar los permisos.
 *   2. Listo: revisa los enviados cada 15 minutos.
 * Para dejar de usarlo: ejecutar  desinstalar.
 */

var BASE = 'https://polaradminhub-default-rtdb.firebaseio.com/trineo/seguimiento/';
var LIGA = /polar-multimedia\.github\.io\/trineo\/([a-z0-9-]+)\/\?c=([a-z0-9-]+)/gi;
var IGNORAR_CODIGOS = ['prueba'];
var IGNORAR_CARPETAS = ['panel', 'shared', 'scripts'];

function instalar() {
  desinstalar();
  ScriptApp.newTrigger('revisarEnviados').timeBased().everyMinutes(15).create();
  revisarEnviados();
  Logger.log('Aviso de envío instalado para ' + Session.getActiveUser().getEmail());
}

function desinstalar() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'revisarEnviados') ScriptApp.deleteTrigger(t);
  });
}

function revisarEnviados() {
  var yo = Session.getActiveUser().getEmail();
  var props = PropertiesService.getUserProperties();
  var vistos = JSON.parse(props.getProperty('vistos') || '[]');
  var hilos = GmailApp.search('in:sent newer_than:3d "polar-multimedia.github.io/trineo"', 0, 30);

  hilos.forEach(function (hilo) {
    hilo.getMessages().forEach(function (m) {
      if (m.isDraft() || vistos.indexOf(m.getId()) !== -1) return;
      if (m.getFrom().toLowerCase().indexOf(yo.toLowerCase()) === -1) return;
      var cuerpo = m.getBody();
      var carpetas = {};
      var r;
      LIGA.lastIndex = 0;
      while ((r = LIGA.exec(cuerpo)) !== null) {
        var carpeta = r[1].toLowerCase(), codigo = r[2].toLowerCase();
        if (IGNORAR_CARPETAS.indexOf(carpeta) !== -1 || IGNORAR_CODIGOS.indexOf(codigo) !== -1) continue;
        carpetas[carpeta] = true;
      }
      Object.keys(carpetas).forEach(function (carpeta) { anotarEnvio(carpeta, m, yo); });
      vistos.push(m.getId());
    });
  });
  props.setProperty('vistos', JSON.stringify(vistos.slice(-300)));
}

function anotarEnvio(carpeta, mensaje, yo) {
  var url = BASE + encodeURIComponent(carpeta) + '.json';
  var cab = { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() };
  var resp = UrlFetchApp.fetch(url, { headers: cab, muteHttpExceptions: true });
  if (resp.getResponseCode() !== 200) {
    Logger.log('No se pudo leer ' + carpeta + ': ' + resp.getResponseCode() + ' ' + resp.getContentText());
    return;
  }
  var actual = JSON.parse(resp.getContentText() || 'null') || {};
  var fecha = mensaje.getDate();
  var cambios = {};
  // No pisa lo que ya se haya llenado a mano en el panel.
  if (!actual.envio) cambios.envio = Utilities.formatDate(fecha, 'America/Mexico_City', 'yyyy-MM-dd');
  if (!actual.estatus || actual.estatus === 'Borrador') cambios.estatus = 'Enviada';
  if (!actual.enviadoTs) {
    cambios.enviadoTs = fecha.getTime();
    cambios.enviadoPor = yo.split('@')[0];
    cambios.enviadoAsunto = mensaje.getSubject().slice(0, 120);
  }
  if (!Object.keys(cambios).length) return;
  var out = UrlFetchApp.fetch(url, {
    method: 'patch', contentType: 'application/json', headers: cab,
    payload: JSON.stringify(cambios), muteHttpExceptions: true
  });
  Logger.log(carpeta + ' → ' + out.getResponseCode() + ' ' + JSON.stringify(cambios));
}
