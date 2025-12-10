import "react";
import InputRow from "../components/ui/InputRow";
import { useState } from "react";
import { toast } from "sonner";
import AuthTemplate from "../components/AuthTemplate";
import { isValidEmail } from "../utils";
import useAuthContext from "../context";
import { useNavigate } from "react-router";

const Login = () => {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  const { login } = useAuthContext();

  const handleChange = (e) =>
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isValidEmail(userInfo.email)) {
      setError({
        ...error,
        email: "Une addresse email valide est requise!",
      });
      return;
    } else {
      setError({ ...userInfo, email: "" });
    }
    toast.loading("Connexion...");
    const { success, message } = await login(userInfo);
    toast.dismiss();

    if (!success) {
      toast.error(message);
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <AuthTemplate
      title="Connectez vous à votre compte"
      alternativeMessage="Pas encore de compte ?"
      alternativeLink="/register"
      alternativeBtnText="S'incrire"
    >
      <div>
        <form onSubmit={handleSubmit} className="w-[340px]">
          <InputRow
            label="Email"
            name="email"
            type="email"
            placeholder="exemple@gmail.com"
            value={userInfo.email}
            onChange={handleChange}
            errorMessage={error.email}
          />
          <InputRow
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="Pa$$word1234!"
            value={userInfo.password}
            onChange={handleChange}
            min="8"
          />
          <div>
            <button className="btn w-full mt-4 border-red-300">
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </AuthTemplate>
  );
};

export default Login;
