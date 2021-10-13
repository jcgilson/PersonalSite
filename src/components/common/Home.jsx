import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';

const Home = () => {
    return (
        <article id="home" className="backgroundCover delicateArch zIndexNegative">
            <section className="backgroundOpacity flexColumn justifyCenter alignCenter">
                <h1 className="massiveFont marginBottomMedium">Be Inspired.</h1>
                <Button variant="contained">Get Started</Button>
            </section>
        </article>
    )
}

export default Home;