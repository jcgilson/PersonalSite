import React from "react";
// import tiktokLogo from '../../images/tiktok.png';
import spotifyLogo from '../../images/spotify.png';

const Footer = (props) => {
    // const { currentPage, setCurrentPage } = props;

    // const navLinks = () => {
    //     const links = ["Travel", "Itineraries", "Bucket-List", "About"];
    //     return links.map((link) => {
    //         return (
    //             <h3
    //                 className={`cursorPointer marginRightMedium${currentPage === link ? " underlined" : ""}`}
    //                 onClick={() => setCurrentPage(link)}
    //             >
    //                 {link}
    //             </h3>
    //         );
    //     })
    // }

    return (
        <footer style={{ backgroundColor: '#1BB854', position: 'fixed', bottom: '0' }} className="width100Percent flexRow justifyCenter alignCenter paddingTopSmall paddingBottomSmall">
            <img src={spotifyLogo} style={{ height: '21px' }} alt="tiktok logo" />
            <h3 className="marginLeftSmall">Check out my Spotify for some crunchy granola tunes</h3>
            {/* <a className="flexRow alignCenter cursorPointer removeTextDecoration" href="https://www.tiktok.com/@jack.gilson" target="_blank">
                <img src={tiktokLogo} style={{ height: '30px' }} alt="tiktok logo" />
                <h2 className="marginLeftSmall">jack.gilson</h2>
            </a>
            <section className="flexRow">
                {navLinks()}
            </section> */}
        </footer>
    )
}

export default Footer;