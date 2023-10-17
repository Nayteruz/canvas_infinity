import { useStores } from "../stores/root-store-context"
import { observer } from "mobx-react-lite";

export const SpaceControl = observer(() => {

    const { storeEvents } = useStores();

    const setGrabMode = () => {
        storeEvents.setGrab(true);
    }

    const setNormal = () => {
        storeEvents.setGrab(false);
    }

    return (
        <div className="space-control">
            <span
                onClick={setNormal}
                className={`cursor ${!storeEvents.isGrabing ? 'active' : ''}`}
                >
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512">
                    <path d="M0 55.2V426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320H297.9c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z" />
                </svg>
            </span>
            <span
                onClick={setGrabMode}
                className={`pointer ${storeEvents.isGrabing ? 'active' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                    <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V64c0-17.7-14.3-32-32-32s-32 14.3-32 32V336c0 1.5 0 3.1 .1 4.6L67.6 283c-16-15.2-41.3-14.6-56.6 1.4s-14.6 41.3 1.4 56.6L124.8 448c43.1 41.1 100.4 64 160 64H304c97.2 0 176-78.8 176-176V128c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V64c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V32z" />
                </svg>
            </span>
            <span className="scale-percent">{Math.ceil(storeEvents.zoomPercent)}%</span>
        </div>
    )
});