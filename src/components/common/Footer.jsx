import React from "react";
import spotifyLogo from '../../images/spotify.png';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#1BB854', position: 'fixed', bottom: '0' }} className="width100Percent flexRow justifyCenter alignCenter paddingTopSmall paddingBottomSmall">
            <img src={spotifyLogo} style={{ height: '21px' }} alt="tiktok logo" />
            <h3 className="marginLeftSmall">Check out my Spotify for some crunchy granola tunes</h3>
        </footer>
    )
}

export default Footer;