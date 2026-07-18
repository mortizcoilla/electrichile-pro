# Contribuir a ElectriChile Pro

¡Gracias por tu interés en colaborar! Toda contribución es bienvenida — desde reportar un bug hasta agregar una nueva calculadora.

---

## 🐛 Reportar bugs

Antes de abrir un issue, verificá que:

1. El bug se reproduce en la última versión (`main`)
2. No es un problema conocido ([busca en issues](https://github.com/miguel/electrichile-pro/issues))
3. Probaste en modo incógnito / sin extensiones del navegador

Cuando abras el issue, incluí:

- **Descripción clara** del problema
- **Pasos para reproducirlo** (lo más específicos posible)
- **Comportamiento esperado** vs. **lo que realmente pasa**
- **Capturas de pantalla** si aplica
- **Entorno**: navegador, versión, sistema operativo
- **Consola del navegador**: si hay errores en la pestaña Console

---

## 💡 Pedir features

Antes de sugerir, mirá el [Roadmap en el README](README.md#-roadmap) para no duplicar.

Si tu idea no está listada:

- **Título claro**: una línea que resuma el feature
- **Problema que resuelve**: ¿qué te impide hacer hoy?
- **Solución propuesta**: cómo lo imaginás
- **Alternativas consideradas**: si se te ocurrieron otras opciones

---

## 🛠 Pull requests

### Setup

1. Fork el repo
2. Cloná tu fork:
   ```bash
   git clone https://github.com/TU_USUARIO/electrichile-pro.git
   cd electrichile-pro
   npm install
   ```
3. Creá una rama para tu feature:
   ```bash
   git checkout -b feature/mi-nueva-calculadora
   ```

### Desarrollo

```bash
npm run dev         # http://localhost:3000
npm test            # correr tests
npm run test:watch  # tests en watch mode
npm run build       # build de producción
```

### Convenciones de código

- **TypeScript strict mode** — el proyecto no acepta `any` salvo adapters
- **JSDoc obligatorio** en funciones públicas de `utils/`
- **Tests para lógica de cálculo** — toda función nueva en `utils/` debe tener al menos 1 test
- **Commits en español** con prefijo:
  - `feat:` nueva funcionalidad
  - `fix:` corrección de bug
  - `docs:` solo documentación
  - `refactor:` cambio sin alterar comportamiento
  - `test:` agregar o mejorar tests
  - `chore:` mantenimiento (deps, config)

### Estructura del commit

```
feat(ampacidad): agregar método G (bandeja perforada)

- Soporte para instalación en bandejas perforadas según IEC 60364-5-523
- Tests para el nuevo método
- Actualización de INSTALLATION_METHODS en ampacityTables.ts

Closes #42
```

### Checklist antes de mandar PR

- [ ] Los tests pasan localmente (`npm test`)
- [ ] El build pasa sin errores (`npm run build`)
- [ ] El código sigue el estilo del proyecto (mira archivos existentes)
- [ ] Agregaste tests si corresponde
- [ ] Actualizaste la documentación si es necesario
- [ ] El commit message describe claramente el cambio

### Proceso de revisión

1. Mandás el PR
2. Un maintainer lo revisa (puede pedirte cambios)
3. CI corre los tests automáticamente
4. Una vez aprobado, se mergea a `main`
5. Vercel redespliega automáticamente

---

## 📝 Áreas donde podés ayudar

### 🧮 Nuevas calculadoras

Las más pedidas (del backlog):
- **Cálculo de cortocircuito en cascada** (coordinación de protecciones)
- **Cálculo de iluminación** (lux por recinto)
- **Cálculo de puesta a tierra** (RIC N°06)
- **Factor de potencia y banco de condensadores**
- **Cálculo de demanda diversificada de empalme**

Para agregar una, seguí los pasos en [ARCHITECTURE.md → Agregar una nueva calculadora](ARCHITECTURE.md#-agregar-una-nueva-calculadora).

### 🐛 Bugs y mejoras de UX

- Mejorar la accesibilidad (roles ARIA, navegación por teclado)
- Soporte para más navegadores (iOS Safari quirks)
- Optimizaciones de performance
- Mejoras en los PDFs generados

### 📚 Documentación y normativa

- Agregar referencias faltantes al RIC
- Corregir o ampliar el contenido del Help
- Traducir a otros idiomas (inglés, portugués)

### 🌍 Internacionalización

Si querés agregar i18n, el proyecto está listo:
- Toda la UI está en español hardcodeado
- Para i18n se puede migrar a `next-intl` o similar

### 💼 Features comerciales

- OCR de placa de datos de artefactos
- Inventario de bodega
- Sincronización entre dispositivos

---

## 🇨🇱 Sobre la normativa

Si vas a tocar la lógica de cálculo o referencias al RIC:

1. **Verificá la fuente oficial**: [sec.cl](https://www.sec.cl) → Reglamentación
2. **Cita textual**: cuando agregues un artículo, copiá la cita exacta del pliego
3. **No inventes valores**: si no estás seguro, mejor no lo agregues y abrí un issue para discutirlo

---

## 🤝 Código de conducta

- Sé respetuoso y constructivo
- Asumí buena intención
- Aceptá feedback con elegancia
- Ayudá a otros contribuidores

---

## 📞 Contacto

Si tenés dudas antes de contribuir:
- 📧 contacto@electrichile.cl
- 🐛 [GitHub Issues](https://github.com/miguel/electrichile-pro/issues)

¡Gracias por hacer de ElectriChile Pro una mejor herramienta para los electricistas chilenos! ⚡
