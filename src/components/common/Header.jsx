import React from "react";
import tiktokLogo from '../../images/tiktok.png';

const Header = (props) => {
    const { currentPage, setCurrentPage } = props;

    const navLinks = () => {
        const links = ["Travel", "Itineraries", "Bucket-List", "About"];
        return links.map((link) => {
            return (
                <h3
                    className={`cursorPointer marginRightMedium${currentPage === link ? " underlined" : ""}`}
                    onClick={() => setCurrentPage(link)}
                >
                    {link}
                </h3>
            );
        })
    }

    return (
        <nav className="flexRow justifySpaceBetween alignCenter paddingTopSmall paddingLeftLarge paddingRightLarge paddingBottomSmall">
            <a className="flexRow alignCenter cursorPointer removeTextDecoration" href="https://www.tiktok.com/@jack.gilson" target="_blank">
                <img src={tiktokLogo} style={{ height: '30px' }} alt="tiktok logo" />
                <h2 className="marginLeftSmall">jack.gilson</h2>
            </a>
            <section className="flexRow">
                {navLinks()}
            </section>
        </nav>
    )
}

export default Header;