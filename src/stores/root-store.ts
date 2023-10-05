import eventsStore from "./events-store";
import RefStore from "./ref-store";

class RootStore {
    storeEvents = eventsStore;
    refs = RefStore;
}

export default RootStore;