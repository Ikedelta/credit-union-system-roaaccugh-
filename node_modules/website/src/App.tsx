import { AppRouter } from './routes';
import { CMSProvider } from './context/CMSContext';
import { MemberAuthProvider } from './context/MemberAuthContext';
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