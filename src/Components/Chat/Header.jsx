import PropTypes from "prop-types";

const MODELS = [
  "AI21 Jamba 1.5 Large",
  "AI21 Jamba 1.5 Mini",
  "AI21-Jamba-Instruct",
  "Cohere Command R",
  "Cohere Command R+",
  "Cohere Embed v3 English",
  "Cohere Embed v3 Multilingual",
  "Meta-Llama-3-70B-Instruct",
  "Meta-Llama-3-8B-Instruct",
  "Meta-Llama-3.1-405B-Instruct",
  "Meta-Llama-3.1-70B-Instruct",
  "Meta-Llama-3.1-8B-Instruct",
  "Mistral Large",
  "Mistral Large (2407)",
  "Mistral Nemo",
  "Mistral Small",
  "OpenAI GPT-4o",
  "OpenAI GPT-4o mini",
  "OpenAI Text Embedding 3 (large)",
  "OpenAI Text Embedding 3 (small)",
  "Phi-3-medium instruct (128k)",
  "Phi-3-medium instruct (4k)",
  "Phi-3-mini instruct (128k)",
  "Phi-3-mini instruct (4k)",
  "Phi-3-small instruct (128k)",
  "Phi-3-small instruct (8k)",
  "Phi-3.5-mini instruct (128k)",
];

const Header = ({ selectedModel, setSelectedModel }) => {
  return (
    <select
      className="select max-w-xs"
      value={selectedModel}
      onChange={(e) => setSelectedModel(e.target.value)}
    >
      {MODELS.map((model) => (
        <option key={model}>{model}</option>
      ))}
    </select>
  );
};

Header.propTypes = {
  selectedModel: PropTypes.string.isRequired,
  setSelectedModel: PropTypes.func.isRequired,
};

export default Header;
