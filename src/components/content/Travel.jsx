import React, { useState, useEffect } from "react";
import "../common/shared.css"
import roadtrip2019 from "../../images/roadtrip2019-cropped.png";

const Travel = () => {
    return (
		// <article id="home" className="backgroundOpacity">
		<article id="home" className="">
			{/* <div className="backgroundCover blackCanyon zIndexNegative"/> */}
			<div className=""/>
			<section className="flexRow">
				<div className="width90Percent backgroundColorWhite marginAuto marginTopMassive paddingBottomLarge flexColumn alignCenter">
					<img src={roadtrip2019} style={{ borderBottom: '1px solid black' }} alt="roadtrip google maps screenshot" className="width80Percent marginBottomMedium" />
					<h1 className="massiveFont serifFont">2019 Roadtrip</h1>
					<h3 className="grayFont">11 National Parks, 24 Days Camping, 5000+ Miles Driven</h3>
					{/* <p className="textLeft width100Percent marginLeftLarge"> */}
					<p className="">
						During my senior year of college I began planning the trip of a lifetime with my best friend.
					</p>
					<ol>
						<li>Rocky Mountain</li>
						<li>Canyonlands</li>
						<li>Arches</li>
						<li>Capitol Reef</li>
						<li>Bryce Canyon</li>
						<li>Grand Canyon</li>
						<li>Zion</li>
						<li>Grand Teton</li>
						<li>Yellowstone</li>
						<li>Wind Cave</li>
						<li>Badlands</li>
					</ol>
				</div>
			</section>
		</article>
    )
}

export default Travel;