import { observer } from "mobx-react-lite";
import "./App.scss";
import BlockMove from "./components/BlockMove";
import BlockMove2 from "./components/BlockMove2";
import BlockMove3 from "./components/BlockMove3";
import BlockMove4 from "./components/BlockMove4";
import Overlay from "./components/Overlay";
import { SpaceControl } from "./components/SpaceControl";

const App = observer(() => {
  return (
    <div className="app">
      <header className="header"></header>
      <aside className="left"></aside>
      <div className="main">
        <div className="canvas">
          <Overlay />
          <BlockMove />
          <SpaceControl />
        </div>
      </div>
      <aside className="right"></aside>
      <footer className="footer"></footer>
    </div>
  );
});

export default App;
