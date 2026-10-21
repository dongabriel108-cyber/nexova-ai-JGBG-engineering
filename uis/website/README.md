# Sitio web público de Nexova

## Propósito

Esta aplicación contiene el sitio web público de Nexova para el Hito 1 de 4Geeks Academy. Su alcance corresponde a Marketing y Comunicaciones, liderado por Carmen Ruiz: presentar la empresa y sus servicios, y permitir que profesionales interesados en oportunidades laborales se registren mediante un formulario.

La aplicación no implementa herramientas internas de Recursos Humanos, backend ni almacenamiento de datos del formulario.

## Archivos y funcionalidades implementadas

- `index.html`: landing corporativa con las secciones del briefing, navegación, llamadas a la acción, metadatos SEO y marcado JSON-LD de Schema.org.
- `application.html`: formulario separado de registro de talento, con 11 campos y diseño responsive basado en Tailwind CSS.
- `validation.js`: lógica de validación durante la interacción y al enviar, mensajes de error, estados ARIA, contador de comentarios, limpieza del formulario y simulación de envío en el navegador.
- `src/input.css`: archivo de entrada de Tailwind CSS 4.
- `dist/styles.css`: hoja de estilos compilada y enlazada desde las páginas HTML.
- `package.json` y `package-lock.json`: dependencias locales y scripts de npm para Tailwind CSS.
- `.gitignore`: excluye `node_modules/`.

El idioma base de la experiencia es español. El formulario no transmite ni guarda los datos: al completarlo correctamente, muestra el mensaje de éxito definido en el briefing.

## Instalación y desarrollo

Ejecuta estos comandos desde esta carpeta (`uis/website/`), no desde la raíz del monorepo. Se requiere Node.js y npm.

```bash
npm ci
npm run build
```

`npm run build` compila `src/input.css` con Tailwind CSS 4 y genera `dist/styles.css`. Para recompilar automáticamente mientras desarrollas:

```bash
npm run watch
```

## Ejecución local y Codespaces

Desde `uis/website/`, inicia un servidor estático:

```bash
npx --yes http-server . -a 0.0.0.0 -p 8000
```

En Codespaces, abre la vista **Ports**, reenvía el puerto `8000` si aún no aparece y cambia su visibilidad a **Public** para obtener una URL accesible. La disponibilidad pública depende de las políticas del Codespace y de la organización. El servidor sirve archivos estáticos; el envío del formulario es simulado y no usa backend.

## Estado de las pruebas

La presencia de una funcionalidad en el código no significa que haya superado pruebas funcionales o de usuario. Antes de dar el hito por verificado, se deben ejecutar y registrar las comprobaciones pertinentes, incluyendo:

- Pruebas funcionales de los 11 campos, sus reglas, mensajes de error, corrección de errores, limpieza y envío simulado.
- Revisión en navegador de la presentación responsive y del flujo del formulario.
- Comprobaciones de accesibilidad con teclado y herramientas apropiadas.
- Auditoría Lighthouse o PageSpeed, incluyendo la puntuación obtenida. No se afirma aquí que se haya alcanzado una puntuación mínima.
- Prueba de acceso a la URL pública de Codespaces.

El script `npm test` de `package.json` sigue siendo un placeholder: no ejecuta una suite de pruebas automatizadas reales.
