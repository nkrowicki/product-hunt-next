import App from 'next/app';
import firebase, {FirebaseContext} from '../firebase';
import useAutenticacion from '../hooks/useAutenticacion';


const MyApp = (props) =>{
    
    const user = useAutenticacion();
    console.log(user);

    const {Component, pageProps} = props;
    
    return(
        <FirebaseContext.Provider
            value={{
                firebase,
                user
            }}
            >
                <Component {...pageProps} />

            </FirebaseContext.Provider>
    )
}

export default MyApp;