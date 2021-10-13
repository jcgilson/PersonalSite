import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import './shared.css'

const Home = () => {
    return (
        <article>
            <section className="flexColumn justifyCenter alignCenter">
                <h1 className="massiveFont marginBottomMedium">Be Inspired.</h1>
                <Button variant="contained">Get Started</Button>
            </section>
        </article>
    )
}

export default Home;