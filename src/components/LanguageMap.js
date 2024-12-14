import React, { useState } from 'react';
import { useMapbox } from '../hooks/useMapbox';
import './LanguageMap.css';
import LanguageButton from './buttons/language/LanguageButton';
import GroupButton from './buttons/group/GroupButton';
import BranchButton from './buttons/branch/BranchButton';
import SubdivisionButton from "./buttons/subdivision/SubdivisionButton";
import FamilyButton from "./buttons/family/FamilyButton";

const LanguageMap = () => {
    const [languageLayerVisible, setLanguageLayerVisible] = useState(true);
    const [groupLayerVisible, setGroupLayerVisible] = useState(false);
    const [branchLayerVisible, setBranchLayerVisible] = useState(false);
    const [subdivisionLayerVisible, setSubdivisionLayerVisible] = useState(false);
    const [familyLayerVisible, setFamilyLayerVisible] = useState(false);

    const mapContainerId = 'map';
    const mapConfig = {
        style: 'mapbox://styles/ponanoix/cm2rix1yx004u01pa4crpa141',
        center: [9.22, 46.18],
        zoom: 4.47,
    };
    const languageLayers = ['Dutch-language', 'French-language', 'Italian-language', 'German-language'];
    const groupLayers = ['West-germanic', 'Western-romance', 'South-romance'];
    const branchLayers = ['Germanic', 'Romance'];
    const subdivisionLayers = ['Centum'];
    const familyLayers = ['Indo-European'];

    const { isWebGLSupported } = useMapbox(
        mapContainerId,
        mapConfig,
        languageLayers,
        languageLayerVisible,
        groupLayers,
        groupLayerVisible,
        branchLayers,
        branchLayerVisible,
        subdivisionLayers,
        subdivisionLayerVisible,
        familyLayers,
        familyLayerVisible);

    const toggleLanguageLayer = () => {
        if (!languageLayerVisible) {
            setLanguageLayerVisible((prevState) => !prevState);
            setGroupLayerVisible(false);
            setBranchLayerVisible(false);
            setSubdivisionLayerVisible(false);
            setFamilyLayerVisible(false);
        }
    };

    const toggleGroupLayer = () => {
        if (!groupLayerVisible) {
            setGroupLayerVisible((prevState) => !prevState);
            setLanguageLayerVisible(false);
            setBranchLayerVisible(false);
            setSubdivisionLayerVisible(false);
            setFamilyLayerVisible(false);
        }
    }

    const toggleBranchLayer = () => {
        if (!branchLayerVisible) {
            setBranchLayerVisible((prevState) => !prevState);
            setLanguageLayerVisible(false);
            setGroupLayerVisible(false);
            setSubdivisionLayerVisible(false);
            setFamilyLayerVisible(false);
        }
    }

    const toggleSubdivisionLayer = () => {
        if (!subdivisionLayerVisible) {
            setSubdivisionLayerVisible((prevState) => !prevState);
            setLanguageLayerVisible(false);
            setGroupLayerVisible(false);
            setBranchLayerVisible(false);
            setFamilyLayerVisible(false);
        }
    }

    const toggleFamilyLayer = () => {
        if (!familyLayerVisible) {
            setFamilyLayerVisible((prevState) => !prevState);
            setLanguageLayerVisible(false);
            setGroupLayerVisible(false);
            setBranchLayerVisible(false);
            setSubdivisionLayerVisible(false);
        }
    }

    if (!isWebGLSupported) {
        return <div>Your browser does not support WebGL, and the map cannot be displayed.</div>;
    }

    return (
        <div id="map" className="map-container">
            <LanguageButton toggleLanguageLayer={toggleLanguageLayer} />
            <GroupButton toggleGroupLayer={toggleGroupLayer} />
            <BranchButton toggleBranchLayer={toggleBranchLayer} />
            <SubdivisionButton toggleSubdivisionLayer={toggleSubdivisionLayer} />
            <FamilyButton toggleFamilyLayer={toggleFamilyLayer} />
        </div>
    );
};

export default LanguageMap;
