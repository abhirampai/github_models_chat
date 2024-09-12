import PropTypes from "prop-types";

import { MODELS } from "../constants";

const Header = ({ selectedModel, setSelectedModel }) => {
  return (
    <select
      className="select max-w-xs"
      value={selectedModel}
      onChange={(e) => setSelectedModel(e.target.value)}
    >
      {MODELS.map((model) => (
        <option key={model.friendlyName}>{model.friendlyName}</option>
      ))}
    </select>
  );
};

Header.propTypes = {
  selectedModel: PropTypes.string.isRequired,
  setSelectedModel: PropTypes.func.isRequired,
};

export default Header;
