import React from "react";
import './shared.css'

const Home = (props) => {

    const { links, setCurrentPage } = props;

    return (
        <article>
            <section className="flexColumn justifyCenter alignCenter">
                <h1 className="marginTopMassive marginBottomMassive serifFont whiteFont">What are you interested in?</h1>
                <div className="width90Percent flexFlowRowWrap justifyCenter alignCenter">
                    {links.map((link, i) => {
                        return (
                            <div onClick={() => setCurrentPage(link)} style={{ padding: '0' }} className="card justifyCenter marginLeftSmall marginRightSmall cardBackgroundImage" key={i}>
                                <h3 style={{ height: '100%', width: '100%', backgroundColor: 'rgba(256,256,256,0.7)' }} className=" justifyCenter alignCenter">{link}</h3>
                            </div>
                        )
                    })}
                </div>
            </section>
        </article>
    )
}

export default Home;