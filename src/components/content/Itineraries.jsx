import React, { useState, useEffect } from "react";
import './content.css';
import washington from '../../images/washington.png';
import vegas from '../../images/vegas.png';

const Itineraries = () => {
    return (
        <article>
            {/* <section className="backgroundOpacity flexColumn justifyCenter alignCenter"> */}
            {/* <section className="backgroundOpacity cardContainer flexFlowRowWrap justifyCenter alignCenter"> */}
            <section className="width90Percent flexFlowRowWrap justifyCenter alignCenter">
                {/* <div className="backgroundColorWhite width80Percent marginAuto marginTopMassive flexColumn alignCenter">
                    <h1 className="serifFont">Pacific Northwest</h1>
                    <h3 className="grayFont">Oregon, Washington, Vancouver</h3>
                </div> */}
                <div className="card marginAuto marginTopMassive flexColumn alignCenter">
                    <img src={washington} alt="Pacific Northwest" className="width100Percent" />
                    <h1 className="serifFont marginTopMedium">Pacific Northwest</h1>
                    <h3 className="grayFont">Oregon, Washington, Vancouver</h3>
                </div>
                <div className="card marginAuto marginTopMassive flexColumn alignCenter">
                    <img src={vegas} alt="Death Valley" className="width100Percent" />
                    <h1 className="serifFont marginTopMedium">Death Valley</h1>
                    <h3 className="grayFont">Salt Lake City, Great Basin, Death Valley, Las Vegas</h3>
                </div>
            </section>
        </article>
    )
}

export default Itineraries;