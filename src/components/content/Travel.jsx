import React, { useState, useEffect, useRef } from "react";
// MUI
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
// Components
import Map from './Map';
// Images
import roadtrip2019 from "../../images/roadtrip2019-cropped.png";
// CSS
import "../common/shared.css"

const Travel = () => {

	const [display, setDisplay] = useState('map');

	const handleDisplayChange = (event, newDisplay) => {
		setDisplay(newDisplay);
	  };

    return (
		<div className="flexColumn alignCenter marginTopMedium">
			<div className="width90Percent flexRow justifySpaceBetween marginBottomSmall">
				<h1 className="serifFont">Travel</h1>
				<ToggleButtonGroup
					value={display}
					exclusive
					onChange={handleDisplayChange}
					aria-label="display"
				>
					<ToggleButton className="small" value="map" aria-label="map display">
						Map
					</ToggleButton>
					<ToggleButton className="small" value="card" aria-label="card display">
						Card
					</ToggleButton>
					<ToggleButton className="small" value="list" aria-label="list display">
						List
					</ToggleButton>
				</ToggleButtonGroup>
			</div>
			{display === 'map' && <Map />}
			{display === 'card' && <Map />}
			{display === 'list' && <Map />}
		</div>
		// <article id="home" className="backgroundOpacity">
		// <article id="home" className="">
		// <article id="" className="">
		// 	{/* <div className="backgroundCover blackCanyon zIndexNegative"/> */}
		// 	<div className=""/>
		// 	<section className="flexRow">
		// 		<div className="width90Percent backgroundColorWhite marginAuto marginTopMassive paddingBottomLarge flexColumn alignCenter">
		// 			<img src={roadtrip2019} style={{ borderBottom: '1px solid black' }} alt="roadtrip google maps screenshot" className="width80Percent marginBottomMedium" />
		// 			<h1 className="massiveFont serifFont">2019 Roadtrip</h1>
		// 			<h3 className="grayFont">11 National Parks, 24 Days Camping, 5000+ Miles Driven</h3>
		// 			{/* <p className="textLeft width100Percent marginLeftLarge"> */}
		// 			<p className="">
		// 				During my senior year of college I began planning the trip of a lifetime with my best friend.
		// 			</p>
		// 			<ol>
		// 				<li>Rocky Mountain</li>
		// 				<li>Canyonlands</li>
		// 				<li>Arches</li>
		// 				<li>Capitol Reef</li>
		// 				<li>Bryce Canyon</li>
		// 				<li>Grand Canyon</li>
		// 				<li>Zion</li>
		// 				<li>Grand Teton</li>
		// 				<li>Yellowstone</li>
		// 				<li>Wind Cave</li>
		// 				<li>Badlands</li>
		// 			</ol>
		// 		</div>
		// 	</section>
		// </article>
    )
}

export default Travel;