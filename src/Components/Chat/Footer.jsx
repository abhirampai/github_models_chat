import { useContext } from "react";

import UserInput from "./UserInput";
import { AppState } from "../../Hooks/utils";

const Footer = () => {
  const { clientMessage: message } = useContext(AppState);

  return (
    <div className="flex flex-col items-center py-2 px-3 bg-gray-50 rounded-lg dark:bg-gray-700 space-y-2">
      <UserInput message={message} />
      <a href="https://www.flaticon.com/free-icons/phone" title="phone icons">
        Phone icons created by Freepik - Flaticon
      </a>
    </div>
  );
};

export default Footer;
