# Ejemplo de integración con MercadoPago

Link de la presentación: https://docs.google.com/presentation/d/1PAL2KOnZb7MGkgEyarlL86hUgsMkOe53dDZiuwp9Yok/edit?usp=sharing

# Configuración Inicial

Instalar las dependencias del proyecto con

    npm install

Completar los datos de conexión a la db en el archivo **config/config.json**
y ejecutar
```
npx sequelize-cli db:migrate
```
Para migrar la estructura de la base. Posteriormente, ejecutar
```
npx sequelize-cli db:seed:all
```
Para agregar los productos de prueba
