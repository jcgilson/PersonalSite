import React from "react";

const Header = (props) => {
    const { currentPage, setCurrentPage } = props;

    const navLinks = () => {
        const links = ["Travel", "Itineraries", "Bucket-List", "Contact"];
        return links.map((link) => {
            return (
                <h4
                    className={`cursorPointer marginRightMedium${currentPage === link ? " underlined" : ""}`}
                    onClick={() => setCurrentPage(link)}
                >
                    {link}
                </h4>
            );
        })
    }

    return (
        <nav className="flexRow justifySpaceBetween alignCenter paddingTopSmall paddingLeftLarge paddingRightLarge paddingBottomSmall">
            <h1>Jack Gilson</h1>
            <section className="flexRow">
                {navLinks()}
            </section>
        </nav>
    )
}

export default Header;