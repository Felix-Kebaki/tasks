import React from "react";
import './hero.css'

import HeroImg from "../../assets/images/Hero.jpg";
import Stars from '../../assets/images/stars.png'

export function Hero() {
  return (
    <section id="hero" className="HeroMainSec">
      <div className="HeroMainDiv">
        <div className="HeroWordingMainDiv">
          <p className="welcomeToHeroTxt text">Welcome to GoalMate</p>
          <div>
          <p className="HeroMainTitle title"> Stay Focused,<br/> Achieve More</p>
          <p className="HeroMainDesc text">
            Boost your productivity by organizing daily tasks, tracking
            long-term goals, and collaborating with your team—all in one clean,
            easy-to-use platform built for creators, thinkers, and doers.
          </p>
          </div>
          <div>
          <button className="HeroMainBtnDiv">Start Planning</button>
          </div>
        </div>
        <div className="HeroImageMainDiv">
          <img src={HeroImg} alt="" />
        </div>
      </div>
      <div className="FloatingStarsMainDiv">
        <img src={Stars} alt="" />
      </div>
    </section>
  );
}
