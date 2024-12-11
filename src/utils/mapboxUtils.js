import mapboxglSupported from 'mapbox-gl-supported';

export const checkWebGLSupport = () => {
    return mapboxglSupported(false);
};

export const handleMapError = (error) => {
    console.error('An error occurred with the Mapbox map:', error);
    alert('An error occurred while loading the map. Please try again later.');
};