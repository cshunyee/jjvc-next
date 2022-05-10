import '../styles/globals.css'
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css'; //import this else will break the style of fontawesome
import { faCoffee,faUserEdit } from '@fortawesome/free-solid-svg-icons';

import { AuthContextProvider } from '../context/auth-context';


library.add(fab, faCoffee, faUserEdit)


function MyApp({ Component, pageProps }) {
  return <AuthContextProvider><Component {...pageProps} /></AuthContextProvider>
}

export default MyApp
