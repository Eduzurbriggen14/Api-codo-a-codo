from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_mysqldb import MySQL

from config import config


app = Flask(__name__)
CORS(app)

conexion = MySQL(app)

@app.route('/productos', methods=['GET'])
def listar_productos():
    try:
        cursor = conexion.connection.cursor()
        sql = 'SELECT * FROM producto;'
        cursor.execute(sql)
        datos = cursor.fetchall()
        productos= []
        for producto in datos:

            producto = {
                'codigo': producto[0],
                'nombre': producto[1],
                'descripcion': producto[2],
                'precio': producto[3],
                'stock': producto[4],
                'categoria': producto[5],
                'imagen': producto[6],
            }
            productos.append(producto)
    
        return jsonify({'productos': productos, 'mensaje': "productos listados"})

    except Exception as e:
        return jsonify({'mensaje': "no se encontro el producto"})
    
@app.route('/producto/<codigo>', methods= ['GET'])
def producto(codigo):
    try:
        cursor= conexion.connection.cursor()
        sql= "SELECT * FROM producto WHERE codigo = '{0}'".format(codigo)
        cursor.execute(sql)
        datos= cursor.fetchone()
        if datos != None:
            producto = {
                'codigo': datos[0],
                'nombre': datos[1],
                'descripcion': datos[2],
                'precio': datos[3],
                'stock': datos[4],
                'categoria': datos[5],
                'imagen': datos[6],
            }
            return jsonify({'producto': producto, 'mensaje': 'El producto ha sido encontrado'})
        
        else:
            return jsonify({"mensaje": "Producto no encontrado"})

    except Exception as e:
        return jsonify({'mensaje': "no se encontro el producto"})
    
@app.route('/producto', methods = ['POST'])
def registrar_producto():
    try:
        cursor= conexion.connection.cursor()
        sql = """INSERT INTO producto(nombre, descripcion,precio, stock, categoria, imagen)  
                VALUES ('{0}','{1}', {2}, {3}, '{4}', '{5}')""".format(request.json['nombre'], request.json['descripcion'],
                                                                        request.json['precio'], request.json['stock'], 
                                                                        request.json['categoria'],request.json['imagen'])
        cursor.execute(sql)
        conexion.connection.commit()
        return jsonify({"mensaje": "producto registrado"})
    
    except Exception as e:
        return jsonify({'mensaje': "no se pudo registrar el producto"})

    
@app.route('/delete/<codigo>', methods= ["DELETE"])
def delete(codigo):
    try:
        cursor = conexion.connection.cursor()
        sql = "DELETE FROM producto WHERE codigo = %s"
        cursor.execute(sql, (codigo,))
        conexion.connection.commit()
        return jsonify({"mensaje": "producto fue eliminado correctamente"})


    except Exception as e:
        return jsonify({'mensaje': "no se pudo eliminar el producto, no existe el codigo que ingreso"})


@app.route('/update/<codigo>', methods=['PUT'])
def actualizar_producto(codigo):
    try:
        cursor= conexion.connection.cursor()
        sql = """UPDATE producto SET nombre= '{0}', descripcion = '{1}', precio = '{2}', stock= '{3}', categoria= '{4}', imagen='{5}'
          WHERE codigo= '{6}'""".format(request.json['nombre'], request.json['descripcion'],
                                    request.json['precio'], request.json['stock'], 
                                    request.json['categoria'],request.json['imagen'], codigo)        
        cursor.execute(sql)
        conexion.connection.commit()
        return jsonify({'mensaje': 'Producto actualizado correctamente'})

    except Exception as e:
        return jsonify({'mensaje': "no se pudo actualizar el producto, no existe el codigo que ingreso"})

    









def pagina_no_encontrada(error):
    return "<h1>La pagina a la que intentas acceder no existe, intenta con una url diferente</h1>", 404

if __name__ == '__main__':
    app.config.from_object(config["development"])
    app.register_error_handler(404, pagina_no_encontrada)
    app.run()