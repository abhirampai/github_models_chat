import { useSignals } from "@preact/signals-react/runtime";
import Chat from "./Components/Chat";

function App() {
  useSignals();
  return (
    <>
      <Chat />
    </>
  );
}

export default App;
