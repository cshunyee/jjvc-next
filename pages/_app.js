import '../styles/globals.css'
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContextProvider } from '../context/auth-context';

function MyApp({ Component, pageProps }) {
  return <AuthContextProvider><Component {...pageProps} /></AuthContextProvider>
}

export default MyApp
