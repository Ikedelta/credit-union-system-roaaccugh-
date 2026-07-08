import { AppRouter } from './routes';
import { CMSProvider } from './context/CMSContext';

function App() {
  return (
    <CMSProvider>
      <AppRouter />
    </CMSProvider>
  );
}

export default App;