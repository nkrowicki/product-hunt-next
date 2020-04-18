import React, { useEffect, useState, useContext, useCallback } from 'react';
import Layout from '../components/layout/layout';
import { FirebaseContext } from '../firebase';
import DetallesProducto from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';

export default function Home() {

 const {productos} = useProductos('creado');

  return (
    <div>
      <Layout>

        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">

              {productos.map(producto => (
               
                <DetallesProducto
                  key={producto.id}
                  producto={producto}
                />
              ))}


            </ul>

          </div>
        </div>



      </Layout>
    </div>
  )
}
