import { AuthProvider, ThemeProvider } from "./context/index";
import { Layout } from "./components/layout/index";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
