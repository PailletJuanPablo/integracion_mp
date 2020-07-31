const mercadopago = require("mercadopago");
mercadopago.configure({
  access_token:
    process.env.MP_CREDENTIALS
});
const { Product, Order, ProductOrder } = require("../models");

const renderCheckout = async (req, res) => {
  const products = await Product.findAll();
  const total = await Product.sum("price");
  return res.render("checkout", { products, total });
};

const processCheckoutAndGeneratePreference = async (req, res) => {
  // Obtenemos ids de los productos y los parseamos a numeros
  const parsedProductsIds = req.body["products[]"].map((p) => Number(p));
  // Obtenemos productos desde nuestra base de datos
  const databaseProducts = await Product.findAll({
    where: { id: parsedProductsIds },
  });
  // Convertimos los produtos de nuestra base de datos a la estructura necesaria para mercadoPago
  const mercadoPagoProducts = databaseProducts.map(p => generateMercadoPagoItemFromProduct(p));
  // Generamos un registro en nuestra base de datos para tener los productos solicitados y poder individualizar
  const orderId = await generateOrderInDatabase(parsedProductsIds);
  // Creamos la estructura base para generar la preferencia, enviandole el email del usuario y los productos parseados
  const mercadoPagoPreferenceStructure = generatePreferenceStructure(orderId, mercadoPagoProducts, req.body.email);
  // Por último, utilizamos el SDK de MercadoPago para generar la preferencia
  const mercadoPagoPreferency = await mercadopago.preferences.create(mercadoPagoPreferenceStructure);
  return res.redirect(mercadoPagoPreferency.response.init_point)
  
};

const generateMercadoPagoItemFromProduct = (product) => {
  return {
    title: product.name,
    quantity: 1,
    description: product.description,
    currency_id: "ARS",
    unit_price: product.price,
  };
};

const generatePreferenceStructure = (orderId, mercadoPagoProducts, userEmail) => {
  return {
    items: mercadoPagoProducts,
    payment_methods: {
      excluded_payment_types: [
        {
          id: "ticket",
        },
        {
          id: "atm",
        },
      ],
    },
    external_reference: String(orderId),
    binary_mode: true,
    auto_return: "all",
    back_urls: {
      pending: "http://localhost:3000/process/",
      failure: "http://localhost:3000/process/",
      success: "http://localhost:3000/process/",
    },
    payer: {
      email: userEmail,
    },
  };
};



const generateOrderInDatabase = async (productIds) => {
  const order = await Order.create({info: 'Orden de prueba', status: 'pending'});

  for (let pId of productIds) {
    try {
      console.log(order.id);
      await ProductOrder.create({OrderId: order.id, ProductId: pId})
    } catch (error) {
      console.log(error)
    }
  }

  return order.id
}
const processPayment = async (req, res) => {
  console.log(req.query);
/*
Recibiremos por parámetros los siguientes datos
 
"collection_status"
  Estado del pago. Los valores podrán ser:

  "pending"
      El usuario no completo el proceso de pago todavía.
  "approved"
      El pago fue aprobado y acreditado.
  "rejected"
    El pago fue rechazado. El usuario podría reintentar el pago.
  "cancelled"
  El pago fue cancelado por una de las partes o el pago expiró.
  "refunded"
    El pago fue devuelto al usuario.


  "external_reference": Id de nuestra base de datos para individualizar el pago

*/
  const order = await Order.findByPk(Number(req.query.external_reference), {include: 'products'});
  order.status = req.query.collection_status;
  await order.save();

  if(order.status == 'approved') {
    return res.render('success')
  }else {
    return res.render('rejected')
  }

  return res.json(order)
}

module.exports = { renderCheckout, processCheckoutAndGeneratePreference, processPayment};
