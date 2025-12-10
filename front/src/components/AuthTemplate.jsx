import BrandName from "./ui/BrandName";
import { Link } from "react-router";

const AuthTemplate = ({
  children,
  title,
  alternativeMessage,
  alternativeLink,
  alternativeBtnText,
}) => {
  return (
    <section className="flex items-center justify-center lg:py-0 py-15">
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div>
          <h1 className="text-gray-500 text-sm text-center mb-4">
            {title} <BrandName />.
          </h1>
          {children}
          <span className="divider"></span>
          <div className="flex items-center justify-center">
            <p className="text-sm">
              {alternativeMessage}
              <Link to={alternativeLink} className="ms-2 text-red-300 underline">
                {alternativeBtnText}
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="w-1/2 hidden lg:block h-screen bg-[url(cover-2.png)] bg-no-repeat bg-center border-2 border-blue-50"></div>
    </section>
  );
};

export default AuthTemplate;
