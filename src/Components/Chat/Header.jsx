import { MODELS } from "../constants";
import { useContext } from "react";
import { AppState } from "../../Hooks/utils";

const Header = () => {
  const { selectedModel } = useContext(AppState);

  return (
    <select
      className="select max-w-xs"
      value={selectedModel.value}
      onChange={(e) => (selectedModel.value = e.target.value)}
    >
      {MODELS.map((model) => (
        <option key={model.friendlyName}>{model.friendlyName}</option>
      ))}
    </select>
  );
};

export default Header;
