import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { FirebaseContext } from '../../firebase';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/layout';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';


const ContenedorProducto = styled.div`
    @media(min-width: 768px){
        display:grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Producto = (props) => {

    // State del componente
    const [producto, setProducto] = useState({});
    const [error, setError] = useState(false);
    const [comentario, setComentario] = useState({});
    const [consultarDB, setconsultarDB] = useState(true);

    // Routing para obtener el id actual
    const router = useRouter();
    const { query: { id } } = router;

    // Context de firebase 
    const { firebase, user } = useContext(FirebaseContext);

    useEffect(() => {
        if (id && consultarDB) {
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                if (producto.exists) {
                    setProducto(producto.data());
                    setconsultarDB(false);
                } else {
                    setError(true);
                    setconsultarDB(false);
                }
            }
            obtenerProducto();
        }

    }, [id]);

    if (Object.keys(producto).length === 0 && !error) return 'Cargando...';
    const { comentarios, creado, descripcion, empresa, nombre, url, urlImagen, votos, creador, haVotado } = producto;

    // Administrar y validar los votos
    const votarProducto = () => {
        if (!user) {
            return router.push('/login');
        }

        // Verificar si el usuario actual ha votado
        if (haVotado.includes(user.uid)) return;


        // Guardar el id del usuario que ha votado
        const nuevoHaVotado = [...haVotado, user.uid];

        //Obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;

        // Actualiza bbdd
        firebase.db.collection('productos').doc(id).update({
            votos: nuevoTotal,
            haVotado: nuevoHaVotado
        });

        // Actualizar state
        setProducto({
            ...producto,
            votos: nuevoTotal
        });

        setconsultarDB(true); //Hay un voto -> consultar a la bbdd


    }

    // Funciones para crear comentarios
    const comentarioChange = e => {
        setComentario({
            ...comentario,
            [e.target.name]: e.target.value
        })
    }

    // Identifica si el comentario es del creador del producto
    const esCreador = id => {
        if (creador.id == id) {
            return true;
        }
    }

    const agregarComentario = e => {
        e.preventDefault();

        if (!user) {
            return router.push('/login');
        }

        // Informacion extra al comentario
        comentario.usuarioId = user.uid;
        comentario.usuarioNombre = user.displayName;

        // Tomar copia de comentarios y agregarlos al arreglo
        const nuevosComentarios = [...comentarios, comentario]

        // Actualizar bbdd
        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevosComentarios
        })

        // Actualizar state
        setProducto({
            ...producto,
            comentarios: nuevosComentarios
        });

        setconsultarDB(true); // Hay un comentario, volver a consultar la bbdd 

    }

    // Funcion que revisa que el creador del producto sea el mismo que esta autenticado
    const puedeBorrar = () => {
        if (!user) return false;

        if (creador.id === user.uid) {
            return true;
        }
    }

    // Elimina un producto de la base de datos
    const eliminarProducto = async () => {
        if(!user) {
            return router.push('/login');
        }

        if(creador.id !== user.uid){
            return router.push('/');
        }

        try {
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <>
                {error ? <Error404 /> : (
                    <div className="contenedor">
                        <h1 css={css`
                        text-align:center;
                        margin-top:5rem;
                    `}>
                            {nombre}
                        </h1>
                        <ContenedorProducto>
                            <div>
                                <p>Publicado hace: {formatDistanceToNow(new Date(creado), { locale: es })}</p>
                                <p>Por: {creador.nombre} de: {empresa} </p>
                                <img src={urlImagen} />
                                <p>{descripcion}</p>

                                {user && (
                                    <>
                                        <h2>Agrega tu comentario</h2>
                                        <form
                                            onSubmit={agregarComentario}
                                        >
                                            <Campo>
                                                <input
                                                    type="text"
                                                    name="mensaje"
                                                    onChange={comentarioChange}
                                                />
                                            </Campo>
                                            <InputSubmit
                                                type="submit"
                                                value="Agregar comentario"
                                            />
                                        </form>
                                    </>
                                )}

                                <h2
                                    css={css`
                                    margin: 2rem 0;
                                `}
                                >Comentarios</h2>

                                {comentarios.length === 0 ? 'Aun no hay comentarios' : (
                                    <ul>

                                        {comentarios.map((comentario, i) => (
                                            <li
                                                key={`${comentario.usuarioId}-${i}`}
                                                css={css`
                                                border: 1px solid #e1e1e1;
                                                padding: 2rem;

                                            `}
                                            >
                                                <p>{comentario.mensaje}</p>
                                                <p>Escrito por:
                                                <span
                                                        css={css`
                                                    font-weight: bold;
                                                `}
                                                    >
                                                        {''} {comentario.usuarioNombre}</span>
                                                </p>

                                                {esCreador(comentario.usuarioId) &&
                                                    <CreadorProducto>Es creador</CreadorProducto>}
                                            </li>
                                        ))}
                                    </ul>
                                )}


                            </div>

                            <aside>
                                <Boton
                                    target="_blank"
                                    bgColor="true"
                                    href={url}
                                >Visitar URL</Boton>


                                <div css={css`
                            margin-top: 5rem;
                        `}>
                                    <p
                                        css={css`
                                    text-align: center;
                                `}
                                    >{votos} Votos</p>
                                    {user && (
                                        <Boton
                                            onClick={votarProducto}
                                        >Votar</Boton>
                                    )}

                                </div>
                            </aside>

                        </ContenedorProducto>
                        {console.log('aaaa', puedeBorrar())}
                        {puedeBorrar() &&
                            <Boton
                                onClick={eliminarProducto}
                            >Eliminar producto</Boton>}
                    </div>
                )
                }


            </>
        </Layout>
    );
}

export default Producto;