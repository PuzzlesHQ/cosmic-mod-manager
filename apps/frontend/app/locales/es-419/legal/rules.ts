import type { RulesProps } from "~/locales/en-US/legal/rules";

export const Rules = (props: RulesProps) => `
# ${props.title}

Si encuentras alguna violación de estas reglas en nuestro sitio web, te pedimos que nos lo hagas saber. Puedes usar el botón reportar en cualquier proyecto, versión o página de usuario, o enviarnos un correo electrónico a [${props.supportEmail}](mailto:${props.supportEmail}).

## 1. Contenido prohibido

El contenido debe cumplir en su totalidad con todas las leyes y regulaciones federales, estatales, locales e internacionales aplicables. Sin limitar lo anterior, el contenido no debe:

1. Contener material que sea difamatorio, obsceno, indecente, abusivo, ofensivo, acosador, violento, odioso, provocador, dañino, perjudicial, disruptivo, contradictorio o de otra manera objetable.
2. Promover material sexualmente explícito o pornográfico, violencia o discriminación basada en etnia, sexo, género, religión, nacionalidad, discapacidad, orientación sexual o edad.
3. Infringir patentes, marcas registradas, secretos comerciales, derechos de autor u otros derechos de propiedad intelectual o derechos de cualquier otra persona.
4. Violar los derechos legales (incluidos los derechos de publicidad y privacidad) de otros o contener material que pueda dar lugar a responsabilidad civil o penal bajo las leyes o regulaciones aplicables, o que de otro modo pueda estar en conflicto con nuestros [Términos de Uso](${props.termsPageUrl}) o [Política de Privacidad](${props.privacyPageUrl}).
5. Promover actividades ilegales o defender, promover o facilitar cualquier acto ilícito, incluyendo drogas reales o sustancias ilícitas.
6. Provocar ansiedad innecesaria, o ser susceptible de molestar, avergonzar, alarmar, dañar o engañar a otras personas.
7. Suplantar a cualquier persona o tergiversar tu identidad o afiliación con cualquier persona u organización.
8. Dar la impresión de que proviene de nosotros o cuenta con nuestro respaldo, o el de cualquier otra persona o entidad, si no es el caso.
9. Cargar datos a un servidor remoto sin una divulgación clara dentro del juego.

## 2. Función clara y honesta

Los proyectos, como forma de contenido, deben intentar describir de manera clara y honesta su propósito en las áreas designadas en la página del proyecto. La información necesaria no debe estar oculta de ninguna manera. Usar lenguaje confuso o jerga técnica innecesaria constituye una violación.

### 2.1. Expectativas generales

A partir de la descripción de un proyecto, los usuarios deben poder entender qué hace el proyecto y cómo usarlo. Las descripciones de los proyectos deben intentar abordar los siguientes tres puntos:

a. Qué hace o añade específicamente el proyecto
b. Por qué alguien debería querer descargar el proyecto
c. Cualquier otra información crítica que el usuario deba conocer antes de descargar

### 2.2. Accesibilidad

Las descripciones de los proyectos deben ser accesibles y poder leerse en diversos formatos. Todas las descripciones deben contar con una versión en texto plano, aunque se puede dar prioridad a imágenes, videos y otro contenido si así se desea. Los encabezados no deben usarse en el cuerpo del texto.

Las descripciones de los proyectos deben tener una traducción al inglés, a menos que estén destinadas exclusivamente para su uso en un idioma específico, como paquetes de traducción. Si se desea, las descripciones pueden incluir traducciones a otros idiomas.

## 3. Trampas y hacks

Los proyectos no pueden contener ni descargar «trampas», que definimos como modificaciones del cliente que:

1. Se publicite como un «truco», un «hack» o un «cliente hackeado».
2. Contenga cualquiera de las siguientes funciones sin requerir una aceptación del lado del servidor:
    a. Ocultación activa del lado del cliente de modificaciones de terceros que tengan desactivación del lado del servidor
    b. Envío innecesario de paquetes a un servidor
    c. Daños a los dispositivos de otros usuarios

## 4. Derechos de autor y resubidas

Debes ser propietario o contar con las licencias, derechos, consentimientos y permisos necesarios para almacenar, compartir y distribuir el contenido que subas con tu cuenta de CRMM.

El contenido no puede ser resubido directamente desde otra fuente sin el permiso explícito del autor original. Si se ha otorgado permiso explícito o si se trata de un «fork» que cumple con las licencias, esta restricción no se aplica.

## 5. Varios

Existen ciertos aspectos menores relacionados con la creación de proyectos que todos los autores deben intentar cumplir. Estos aspectos no siempre serán estrictamente aplicados, pero seguirlos permitirá una revisión más rápida y con menos problemas potenciales.

1. Todos los metadatos, incluida la licencia, la información cliente/servidor, las etiquetas, etc., están correctamente completados y son consistentes con la información encontrada en otros lugares.
2. Los títulos de los proyectos solo incluyen el nombre del proyecto, sin datos de relleno innecesarios.
3. Los resúmenes de los proyectos contienen un breve resumen sin formato y sin repetir el título del proyecto.
4. Todos los enlaces externos conducen a recursos públicos relevantes.
5. Las imágenes de la galería son relevantes para el proyecto y cada una incluye un título.
6. Todas las dependencias deben especificarse en la sección de «Dependencias» de cada versión.
7. Los «archivos adicionales» solo deben usarse para fines especiales designados, como archivos JAR de origen. Es decir, se deben utilizar versiones y proyectos separados cuando corresponda en lugar de archivos adicionales.
`;
