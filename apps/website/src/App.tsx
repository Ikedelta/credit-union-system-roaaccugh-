import { AppRouter } from './routes';
import { CMSProvider } from './context/CMSContext';
import { MemberAuthProvider } from './context/MemberAuthContext';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';
function App() {
  return (
    <CMSProvider>
      <MemberAuthProvider>
        <AppRouter />
      </MemberAuthProvider>
    </CMSProvider>
  );
}

export default App;