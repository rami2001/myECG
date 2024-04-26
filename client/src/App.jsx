import Layout from "@/pages/public/layout/Layout";
import UserForm from "@/components/register/UserForm";
import AuthForm from "./pages/public/login/AuthForm";

function App() {
  return (
    <Layout>
      <AuthForm />
    </Layout>
  );
}

export default App;
