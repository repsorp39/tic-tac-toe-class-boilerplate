import React from "react";
import InputRow from "../components/ui/InputRow";
import { useState } from "react";
import { toast } from "sonner";
import AuthTemplate from "../components/AuthTemplate";
import { isStrongPassword, isValidEmail, isValidPseudo } from "../utils";
import useAuthContext from "../context";
import { useNavigate } from "react-router";


const Register = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    pseudo: "",
  });
  const { register, login } = useAuthContext();
  const [error, setError] = useState({ email: "", password: "", pseudo: "" });

  const validator = {
    email: {
      validate: isValidEmail,
      message: "Une addresse email valide est requise!",
    },
    password: {
      validate: isStrongPassword,
      message: "8 caractères dont au moins un chiffre et une lettre!",
    },
    pseudo: {
      validate: isValidPseudo,
      message: "Le pseudo est compris en 3 et 12 caractères.",
    },
  };

  const handleChange = (e) =>
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = {};

    Object.keys(userInfo).forEach((key) => {
      if (!validator[key].validate(userInfo[key])) {
        errors[key] = validator[key].message;
      } else errors[key] = "";
    });

    setError(errors);

    const cannotSave = Object.values(errors).some(Boolean);

    if (cannotSave) return;

    toast.loading("Enrégistrement du joueur...");
    const registerResponse = await register(userInfo);
    toast.dismiss();

    if (registerResponse.success) {
      await login(userInfo);
      navigate("/");
    } else {
      toast.error(registerResponse.message);
    }
  }

  return (
    <AuthTemplate
      title="Rejoignez nous dès maintenant sur"
      alternativeMessage="Déjà un compte ?"
      alternativeLink="/login"
      alternativeBtnText="Se connecter"
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
            label="Pseudo"
            name="pseudo"
            type="pseudo"
            placeholder="Prosper19"
            value={userInfo.pseudo}
            onChange={handleChange}
            errorMessage={error.pseudo}
            max="12"
          />

          <InputRow
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="Pa$$word1234!"
            value={userInfo.password}
            errorMessage={error.password}
            onChange={handleChange}
            min="8"
          />
          <div>
            <button className="btn w-full mt-4 border-red-300">
              S'incrire
            </button>
          </div>
        </form>
      </div>
    </AuthTemplate>
  );
};

export default Register;
