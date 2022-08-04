import React from "react";
// import tiktokLogo from '../../images/tiktok.png';
// import nameLogo from '../../images/nameLogo.png';

const Header = (props) => {
    const { links, currentPage, setCurrentPage } = props;

    const navLinks = () => {
        return links.map((link, i) => {
            return (
                <h3
                    className={`cursorPointer marginLeftLarge${currentPage === link ? " underlined" : ""}`}
                    onClick={() => setCurrentPage(link)}
                    key={i}
                >
                    {link}
                </h3>
            );
        })
    }

    return (
        <nav className="width80Percent marginAuto flexRow justifySpaceBetween alignCenter paddingTopSmall paddingBottomSmall">
            {/* <img src={nameLogo} style={{ height: '60px' }} alt="tiktok logo" /> */}
            <a className="flexRow alignCenter cursorPointer removeTextDecoration" href="https://www.tiktok.com/@jack.gilson" target="_blank" rel="noreferrer">
                {/* <img src={tiktokLogo} style={{ height: '30px' }} alt="tiktok logo" /> */}
                <h2 className="marginLeftSmall">Jack Gilson</h2>
            </a>
            <section className="flexRow">
                {navLinks()}
            </section>
        </nav>
    )
}

export default Header;