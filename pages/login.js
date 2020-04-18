import React, { useState } from 'react';
import Layout from '../components/layout/layout';
import { css } from '@emotion/core';
import Router from 'next/router';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import firebase from '../firebase';

// Validaciones
import useValidacion from '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';


const STATE_INICIAL = {
  email: '',
  password: ''
}


export default function Login() {

  const [error, setError] = useState(false);

  const { valores, errores, handleChange, handleSubmit, handleBlur } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion)

  const { email, password } = valores;

async function iniciarSesion(){
  console.log('iniciando sesion');

  try {
    await firebase.login(email, password);
    Router.push('/');
  } catch (error) {
    console.error('Hubo un error al Iniciar sesion', error.message);
    setError(error.message);
  }
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
          >Iniciar sesion</h1>
          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >

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

            {error && <Error>{error}</Error>}

            <Campo>
              <InputSubmit
                type="submit"
                value="Iniciar Sesión"
              />
            </Campo>
          </Formulario>


        </>
      </Layout>
    </div>
  )
}
