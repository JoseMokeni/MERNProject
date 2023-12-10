import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white rounded-lg shadow dark:bg-gray-900 m-4 mt-8">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Marketplace by J.M.
            </span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <Link to="/" className="mr-4 hover:underline md:mr-6 ">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products/mine" className="mr-4 hover:underline md:mr-6">
                My products
              </Link>
            </li>
            <li>
              <Link
                to="/termsandconditions"
                className="mr-4 hover:underline md:mr-6 "
              >
                Terms and condition
              </Link>
            </li>
            <li>
              <a href="mailto:jmmokeni@gmail.com" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023{" "}
          <a href="mailto:jmmokeni@gmail.com" className="hover:underline">
            José Mokeni™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
