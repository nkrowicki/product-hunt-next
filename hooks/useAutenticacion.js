import React, { useEffect, useState } from 'react';
import firebase from '../firebase';

function useAutenticacion() {
    const [usuarioAutenticado, setusuarioAutenticado] = useState(null);

    useEffect(() => {
        const unsuscribe = firebase.auth.onAuthStateChanged(user => {
            if (user) {
                setusuarioAutenticado(user);
            } else {
                setusuarioAutenticado(null);
            }
        });

        return () => unsuscribe();

    }, []);

    return usuarioAutenticado;

}
export default useAutenticacion;