const useZoomBackground = (zoom :number) => {

    const zoomInitial = zoom * 128;
    const zoomValues = [Math.trunc(zoomInitial), 4, 8];
    let viewZoom = '';
    for (const [k, v] of zoomValues.entries()) {
        if (k === 0) {
            viewZoom += `${v}px ${v}px, ${v}px ${v}px`
        } else {
            const z = zoomValues[0] / v;
            viewZoom += `, ${z}px ${z}px, ${z}px ${z}px`
        }
    }


    return viewZoom;
}

export default useZoomBackground;