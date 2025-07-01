const mysql = require("mysql2");

module.exports = (app, db) => {
  // RUTAS DE PRODUCTOS
  app.get("/productos", (req, res) => {
    const query = "SELECT * FROM productos ORDER BY nombre";
    db.query(query, (err, productos) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error del servidor");
      }
      res.render("productos/index", { productos });
    });
  });

  app.get("/productos/nuevo", (req, res) => {
    res.render("productos/nuevo");
  });

  app.post("/productos", (req, res) => {
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    const query =
      "INSERT INTO productos (nombre, descripcion, precio, stock, categoria) VALUES (?, ?, ?, ?, ?)";

    db.query(query, [nombre, descripcion, precio, stock, categoria], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error al crear producto");
      }
      res.redirect("/productos");
    });
  });

  app.get("/productos/:id", (req, res) => {
    const query = "SELECT * FROM productos WHERE id = ?";
    db.query(query, [req.params.id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error del servidor");
      }
      if (results.length === 0) {
        return res.status(404).send("Producto no encontrado");
      }
      res.render("productos/detalle", { producto: results[0] });
    });
  });

  app.get("/productos/:id/editar", (req, res) => {
    const query = "SELECT * FROM productos WHERE id = ?";
    db.query(query, [req.params.id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error del servidor");
      }
      if (results.length === 0) {
        return res.status(404).send("Producto no encontrado");
      }
      res.render("productos/editar", { producto: results[0] });
    });
  });

  app.put("/productos/:id", (req, res) => {
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    const query =
      "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria = ? WHERE id = ?";

    db.query(
      query,
      [nombre, descripcion, precio, stock, categoria, req.params.id],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error al actualizar producto");
        }
        res.redirect("/productos");
      }
    );
  });

  app.delete("/productos/:id", (req, res) => {
    const query = "DELETE FROM productos WHERE id = ?";
    db.query(query, [req.params.id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error al eliminar producto");
      }
      res.redirect("/productos");
    });
  });

  // RUTAS DE VENTAS
  app.get("/ventas", (req, res) => {
    const query = `
        SELECT v.*, 
               COUNT(dv.id) as total_productos,
               GROUP_CONCAT(p.nombre SEPARATOR ', ') as productos
        FROM ventas v 
        LEFT JOIN detalles_venta dv ON v.id = dv.venta_id
        LEFT JOIN productos p ON dv.producto_id = p.id
        GROUP BY v.id 
        ORDER BY v.fecha_venta DESC
    `;

    db.query(query, (err, ventas) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error del servidor");
      }
      res.render("ventas/index", { ventas });
    });
  });

  app.get("/ventas/nueva", (req, res) => {
    const query = "SELECT * FROM productos WHERE stock > 0 ORDER BY nombre";
    db.query(query, (err, productos) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error del servidor");
      }
      res.render("ventas/nueva", { productos });
    });
  });

  app.post("/ventas", (req, res) => {
    const { cliente_nombre, cliente_email, productos } = req.body;

    // Calcular total
    let total = 0;
    const productosArray = Array.isArray(productos) ? productos : [productos];

    // Obtener precios de productos
    const productIds = productosArray.map((p) => p.id);
    const placeholders = productIds.map(() => "?").join(",");
    const queryPrecios = `SELECT id, precio, stock FROM productos WHERE id IN (${placeholders})`;

    db.query(queryPrecios, productIds, (err, productosData) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error al obtener productos");
      }

      // Validar stock y calcular total
      for (let producto of productosArray) {
        const prodData = productosData.find((p) => p.id == producto.id);
        if (!prodData || prodData.stock < producto.cantidad) {
          return res.status(400).send(`Stock insuficiente para el producto`);
        }
        total += prodData.precio * producto.cantidad;
      }

      // Crear venta
      const insertVenta =
        "INSERT INTO ventas (total, cliente_nombre, cliente_email) VALUES (?, ?, ?)";
      db.query(
        insertVenta,
        [total, cliente_nombre, cliente_email],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error al crear venta");
          }

          const ventaId = result.insertId;

          // Insertar detalles y actualizar stock
          let completed = 0;
          productosArray.forEach((producto) => {
            const prodData = productosData.find((p) => p.id == producto.id);
            const subtotal = prodData.precio * producto.cantidad;

            // Insertar detalle
            const insertDetalle =
              "INSERT INTO detalles_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)";
            db.query(
              insertDetalle,
              [
                ventaId,
                producto.id,
                producto.cantidad,
                prodData.precio,
                subtotal,
              ],
              (err) => {
                if (err) {
                  console.error(err);
                  return res
                    .status(500)
                    .send("Error al crear detalle de venta");
                }

                // Actualizar stock
                const updateStock =
                  "UPDATE productos SET stock = stock - ? WHERE id = ?";
                db.query(
                  updateStock,
                  [producto.cantidad, producto.id],
                  (err) => {
                    if (err) {
                      console.error(err);
                      return res.status(500).send("Error al actualizar stock");
                    }

                    completed++;
                    if (completed === productosArray.length) {
                      res.redirect("/ventas");
                    }
                  }
                );
              }
            );
          });
        }
      );
    });
  });

  app.get("/ventas/:id", (req, res) => {
    const queryVenta = "SELECT * FROM ventas WHERE id = ?";
    const queryDetalles = `
        SELECT dv.*, p.nombre as producto_nombre 
        FROM detalles_venta dv 
        JOIN productos p ON dv.producto_id = p.id 
        WHERE dv.venta_id = ?
    `;

    db.query(queryVenta, [req.params.id], (err, ventaResults) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error del servidor");
      }
      if (ventaResults.length === 0) {
        return res.status(404).send("Venta no encontrada");
      }

      db.query(queryDetalles, [req.params.id], (err, detalles) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error del servidor");
        }

        res.render("ventas/detalle", {
          venta: ventaResults[0],
          detalles,
        });
      });
    });
  });

};
