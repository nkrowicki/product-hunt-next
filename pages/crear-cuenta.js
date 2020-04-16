import Layout from '../components/layout/layout';
import { css } from '@emotion/core';
import { Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';
// Validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';

export default function CrearCuenta() {

  const STATE_INICIAL = {
    nombre: '',
    email: '',
    password: ''
  }

  const { valores, errores, handleChange, handleSubmit, handleBlur } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta)

  const { nombre, email, password } = valores;

  function crearCuenta() {
    console.log('Creando cuenta');
  }


  return (
    <div>
      <Layout>

        <>

          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >CrearCuenta</h1>
          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >
            <Campo>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                placeholder="Tu nombre"
                name="nombre"
                value={nombre}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>

            {errores.nombre && <Error>{errores.nombre}</Error>}

            <Campo>
              <label htmlFor="email">email</label>
              <input
                type="text"
                id="email"
                placeholder="Tu email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>

            {errores.email && <Error>{errores.email}</Error>}

            <Campo>
              <label htmlFor="password">password</label>
              <input
                type="password"
                id="password"
                placeholder="Tu password"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>

            {errores.password && <Error>{errores.password}</Error>}

            <Campo>
              <InputSubmit
                type="submit"
                value="Crear cuenta"
              />
            </Campo>
          </Formulario>


        </>
      </Layout>
    </div>
  )
}
