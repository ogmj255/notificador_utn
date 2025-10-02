import { onRequest as __crear_contenido_js_onRequest } from "C:\\Users\\omarm\\Desktop\\Ingenieria\\paginas\\seguimiento_univ\\functions\\crear-contenido.js"
import { onRequest as __enviar_notificacion_js_onRequest } from "C:\\Users\\omarm\\Desktop\\Ingenieria\\paginas\\seguimiento_univ\\functions\\enviar-notificacion.js"
import { onRequest as __recordatorio_js_onRequest } from "C:\\Users\\omarm\\Desktop\\Ingenieria\\paginas\\seguimiento_univ\\functions\\recordatorio.js"
import { onRequest as __test_js_onRequest } from "C:\\Users\\omarm\\Desktop\\Ingenieria\\paginas\\seguimiento_univ\\functions\\test.js"
import { onRequest as __webhook_js_onRequest } from "C:\\Users\\omarm\\Desktop\\Ingenieria\\paginas\\seguimiento_univ\\functions\\webhook.js"

export const routes = [
    {
      routePath: "/crear-contenido",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__crear_contenido_js_onRequest],
    },
  {
      routePath: "/enviar-notificacion",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__enviar_notificacion_js_onRequest],
    },
  {
      routePath: "/recordatorio",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__recordatorio_js_onRequest],
    },
  {
      routePath: "/test",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__test_js_onRequest],
    },
  {
      routePath: "/webhook",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__webhook_js_onRequest],
    },
  ]